import type { CotizadorConfig } from "./config";

export function diffConfig(oldConfig: CotizadorConfig, newConfig: CotizadorConfig): string[] {
  const changes: string[] = [];

  (Object.keys(newConfig.formula) as (keyof CotizadorConfig["formula"])[]).forEach((key) => {
    if (oldConfig.formula[key] !== newConfig.formula[key]) {
      changes.push(`Fórmula ${key}: ${oldConfig.formula[key]} → ${newConfig.formula[key]}`);
    }
  });

  if (oldConfig.discount !== newConfig.discount) {
    changes.push(`Descuento especial: ${oldConfig.discount} → ${newConfig.discount}`);
  }

  newConfig.inverterTiers.forEach((tier) => {
    const old = oldConfig.inverterTiers.find((t) => t.productId === tier.productId);
    if (old && old.maxPanels !== tier.maxPanels) {
      changes.push(`${tier.capacityLabel} máx. paneles: ${old.maxPanels} → ${tier.maxPanels}`);
    }
  });

  newConfig.products.forEach((product) => {
    const old = oldConfig.products.find((p) => p.id === product.id);
    if (!old) return;
    if (old.unitPrice !== product.unitPrice) {
      changes.push(`${product.name} — precio: ${old.unitPrice} → ${product.unitPrice}`);
    }
    if ((old.ratioPerPanel ?? 0) !== (product.ratioPerPanel ?? 0)) {
      changes.push(
        `${product.name} — ratio/panel: ${old.ratioPerPanel ?? 0} → ${product.ratioPerPanel ?? 0}`
      );
    }
    if ((old.fixedQuantity ?? 0) !== (product.fixedQuantity ?? 0)) {
      changes.push(
        `${product.name} — cantidad fija: ${old.fixedQuantity ?? 0} → ${product.fixedQuantity ?? 0}`
      );
    }
  });

  return changes;
}
