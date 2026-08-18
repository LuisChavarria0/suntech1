import fs from "node:fs/promises";
import path from "node:path";

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

const CONFIG_PATH = path.join(process.cwd(), "data", "cotizador-config.json");

export async function readCotizadorConfig(): Promise<CotizadorConfig> {
  const raw = await fs.readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as CotizadorConfig;
}

export async function writeCotizadorConfig(config: CotizadorConfig): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
}
