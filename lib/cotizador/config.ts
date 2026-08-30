import { readJson, writeJson } from "./jsonStore";

export type ProductCategory =
  | "panel"
  | "inverter"
  | "scaling"
  | "fixed"
  | "permit-baja"
  | "permit-media";

export interface ProductItem {
  id: string;
  name: string;
  unitPrice: number;
  category: ProductCategory;
  fixedQuantity?: number;
  ratioPerPanel?: number;
}

export interface InverterTier {
  capacityLabel: string;
  capacityKw: number;
  maxPanels: number;
  productId: string;
}

export interface CotizadorFormula {
  hsp: number;
  safetyFactor: number;
  panelWattage: number;
}

export interface CotizadorConfig {
  formula: CotizadorFormula;
  discount: number;
  inverterTiers: InverterTier[];
  products: ProductItem[];
}

const KEY = "cotizador-config";
const FILE = "cotizador-config.json";

export async function readCotizadorConfig(): Promise<CotizadorConfig> {
  return readJson<CotizadorConfig>(KEY, FILE, {
    formula: { hsp: 6, safetyFactor: 1.2, panelWattage: 620 },
    discount: 0,
    inverterTiers: [],
    products: [],
  });
}

export async function writeCotizadorConfig(config: CotizadorConfig): Promise<void> {
  await writeJson(KEY, FILE, config);
}
