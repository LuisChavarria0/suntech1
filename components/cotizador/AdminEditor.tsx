"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CotizadorConfig, ProductItem } from "@/lib/cotizador/config";
import type { SessionPayload } from "@/lib/cotizador/auth";

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";

function updateProduct(
  config: CotizadorConfig,
  id: string,
  patch: Partial<ProductItem>
): CotizadorConfig {
  return {
    ...config,
    products: config.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  };
}

export function AdminEditor({
  initialConfig,
  session,
}: {
  initialConfig: CotizadorConfig;
  session: SessionPayload;
}) {
  const router = useRouter();
  const [config, setConfig] = useState<CotizadorConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/cotizador/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setMessage(res.ok ? "Cambios guardados." : "No se pudo guardar. Intenta de nuevo.");
  };

  const logout = async () => {
    await fetch("/api/cotizador/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const panel = config.products.find((p) => p.category === "panel");
  const inverters = config.products.filter((p) => p.category === "inverter");
  const scaling = config.products.filter((p) => p.category === "scaling");
  const fixed = config.products.filter((p) => p.category === "fixed");
  const permits = config.products.filter(
    (p) => p.category === "permit-baja" || p.category === "permit-media"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Cotizador — Administración</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sesión: <span className="font-semibold text-navy-800">{session.username}</span>{" "}
            ({session.role === "super_admin" ? "Super administrador" : "Editor"})
          </p>
        </div>
        <div className="flex items-center gap-4">
          {session.role === "super_admin" && (
            <Link
              href="/admin/usuarios"
              className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors"
            >
              Usuarios y registro
            </Link>
          )}
          <button
            onClick={logout}
            className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Formula constants */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Fórmula de dimensionamiento</h2>
        <p className="text-xs text-slate-500 mb-4">
          Paneles = ceil( (consumo_kwh / 30) × 1000 × factor_seguridad / (potencia_panel × HSP) )
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="HSP (horas sol pico)">
            <input
              type="number"
              step="0.1"
              value={config.formula.hsp}
              onChange={(e) =>
                setConfig({
                  ...config,
                  formula: { ...config.formula, hsp: parseFloat(e.target.value) || 0 },
                })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Factor de seguridad">
            <input
              type="number"
              step="0.01"
              value={config.formula.safetyFactor}
              onChange={(e) =>
                setConfig({
                  ...config,
                  formula: {
                    ...config.formula,
                    safetyFactor: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Potencia del panel (W)">
            <input
              type="number"
              value={config.formula.panelWattage}
              onChange={(e) =>
                setConfig({
                  ...config,
                  formula: {
                    ...config.formula,
                    panelWattage: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Descuento especial ($)">
            <input
              type="number"
              step="0.01"
              value={config.discount}
              onChange={(e) => setConfig({ ...config, discount: parseFloat(e.target.value) || 0 })}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Panel */}
      {panel && (
        <section className="card-base p-6 mb-6">
          <h2 className="font-bold text-navy-900 mb-4">Panel solar</h2>
          <ProductRow
            product={panel}
            onChange={(patch) => setConfig(updateProduct(config, panel.id, patch))}
          />
        </section>
      )}

      {/* Inverters + tiers */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Inversores y capacidades</h2>
        <div className="space-y-4">
          {config.inverterTiers
            .slice()
            .sort((a, b) => a.capacityKw - b.capacityKw)
            .map((tier) => {
              const product = inverters.find((p) => p.id === tier.productId);
              if (!product) return null;
              return (
                <div
                  key={tier.productId}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_140px_140px] gap-3 items-end border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm text-navy-900">{product.name}</p>
                  </div>
                  <Field label="Precio ($)">
                    <input
                      type="number"
                      step="0.01"
                      value={product.unitPrice}
                      onChange={(e) =>
                        setConfig(
                          updateProduct(config, product.id, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Máx. paneles">
                    <input
                      type="number"
                      value={tier.maxPanels}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          inverterTiers: config.inverterTiers.map((t) =>
                            t.productId === tier.productId
                              ? { ...t, maxPanels: parseInt(e.target.value) || 0 }
                              : t
                          ),
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              );
            })}
        </div>
      </section>

      {/* Scaling items */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-1">Insumos que escalan por panel</h2>
        <p className="text-xs text-slate-500 mb-4">Cantidad = redondear hacia arriba(paneles × ratio)</p>
        <div className="space-y-3">
          {scaling.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              showRatio
              onChange={(patch) => setConfig(updateProduct(config, product.id, patch))}
            />
          ))}
        </div>
      </section>

      {/* Fixed items */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Insumos fijos (no cambian con el tamaño)</h2>
        <div className="space-y-3">
          {fixed.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              showFixedQty
              onChange={(patch) => setConfig(updateProduct(config, product.id, patch))}
            />
          ))}
        </div>
      </section>

      {/* Permits */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-1">Trámites UPR</h2>
        <p className="text-xs text-slate-500 mb-4">
          Baja tensión se aplica hasta 10K; media tensión se aplica en el tramo de 20K.
        </p>
        <div className="space-y-3">
          {permits.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onChange={(patch) => setConfig(updateProduct(config, product.id, patch))}
            />
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="h-12 px-8 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function ProductRow({
  product,
  onChange,
  showRatio,
  showFixedQty,
}: {
  product: ProductItem;
  onChange: (patch: Partial<ProductItem>) => void;
  showRatio?: boolean;
  showFixedQty?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px] gap-3 items-end border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <p className="text-sm text-navy-900">{product.name}</p>
      <Field label="Precio ($)">
        <input
          type="number"
          step="0.01"
          value={product.unitPrice}
          onChange={(e) => onChange({ unitPrice: parseFloat(e.target.value) || 0 })}
          className={inputClass}
        />
      </Field>
      {showRatio && (
        <Field label="Ratio / panel">
          <input
            type="number"
            step="0.01"
            value={product.ratioPerPanel ?? 0}
            onChange={(e) => onChange({ ratioPerPanel: parseFloat(e.target.value) || 0 })}
            className={inputClass}
          />
        </Field>
      )}
      {showFixedQty && (
        <Field label="Cantidad fija">
          <input
            type="number"
            value={product.fixedQuantity ?? 0}
            onChange={(e) => onChange({ fixedQuantity: parseInt(e.target.value) || 0 })}
            className={inputClass}
          />
        </Field>
      )}
    </div>
  );
}
