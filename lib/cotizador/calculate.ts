import type { CotizadorConfig, InverterTier, ProductItem } from "./config";

export interface QuoteLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteResult {
  consumoMensualKwh: number;
  panelesNecesarios: number;
  inverterTier: InverterTier | null;
  exceedsStandardCapacity: boolean;
  lines: QuoteLine[];
  subtotal: number;
  discount: number;
  total: number;
}

export function calculatePanelsNeeded(
  consumoMensualKwh: number,
  formula: CotizadorConfig["formula"]
): number {
  if (!consumoMensualKwh || consumoMensualKwh <= 0) return 0;

  const dailyKwh = consumoMensualKwh / 30;
  const dailyWh = dailyKwh * 1000;
  const dailyWhWithSafety = dailyWh * formula.safetyFactor;
  const panelDailyWh = formula.panelWattage * formula.hsp;

  return Math.floor(dailyWhWithSafety / panelDailyWh);
}

export function pickInverterTier(
  panelesNecesarios: number,
  tiers: InverterTier[]
): { tier: InverterTier | null; exceeds: boolean } {
  if (panelesNecesarios <= 0) return { tier: null, exceeds: false };

  const sorted = [...tiers].sort((a, b) => a.capacityKw - b.capacityKw);
  const fit = sorted.find((t) => t.maxPanels >= panelesNecesarios);
  if (fit) return { tier: fit, exceeds: false };

  const largest = sorted[sorted.length - 1] ?? null;
  return { tier: largest, exceeds: true };
}

function findProduct(products: ProductItem[], id: string): ProductItem | undefined {
  return products.find((p) => p.id === id);
}

export function calculateQuote(
  consumoMensualKwh: number,
  config: CotizadorConfig
): QuoteResult {
  const panelesNecesarios = calculatePanelsNeeded(consumoMensualKwh, config.formula);
  const { tier, exceeds } = pickInverterTier(panelesNecesarios, config.inverterTiers);

  const lines: QuoteLine[] = [];

  const pushLine = (product: ProductItem, quantity: number) => {
    if (quantity <= 0) return;
    lines.push({
      id: product.id,
      name: product.name,
      quantity,
      unitPrice: product.unitPrice,
      subtotal: Math.round(quantity * product.unitPrice * 100) / 100,
    });
  };

  for (const product of config.products) {
    switch (product.category) {
      case "panel":
        pushLine(product, panelesNecesarios);
        break;
      case "inverter":
        pushLine(product, tier?.productId === product.id ? 1 : 0);
        break;
      case "scaling":
        pushLine(product, Math.ceil(panelesNecesarios * (product.ratioPerPanel ?? 0)));
        break;
      case "fixed":
        pushLine(product, product.fixedQuantity ?? 0);
        break;
      case "permit-baja":
        pushLine(product, tier && tier.capacityKw <= 10 ? 1 : 0);
        break;
      case "permit-media":
        pushLine(product, tier && tier.capacityKw > 10 ? 1 : 0);
        break;
    }
  }

  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.subtotal, 0) * 100) / 100;
  const total = Math.round((subtotal - config.discount) * 100) / 100;

  return {
    consumoMensualKwh,
    panelesNecesarios,
    inverterTier: tier,
    exceedsStandardCapacity: exceeds,
    lines,
    subtotal,
    discount: config.discount,
    total,
  };
}

// Re-exported for consumers that only need the product lookup helper.
export { findProduct };
