"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CotizadorConfig, ProductItem } from "@/lib/cotizador/config";
import type { SessionPayload } from "@/lib/cotizador/auth";

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

/**
 * Numeric input that keeps the raw text while editing, so partial values like
 * "12." or an empty field don't get stripped mid-keystroke. While focused the
 * field is never overwritten from outside; an empty field only becomes 0 once
 * you leave it (blur).
 */
function NumberInput({
  value,
  onValueChange,
  integer,
  step,
}: {
  value: number;
  onValueChange: (n: number) => void;
  integer?: boolean;
  step?: string;
}) {
  const [text, setText] = useState(String(value));
  const focusedRef = useRef(false);

  // Sync from outside only when the user isn't editing this field.
  useEffect(() => {
    if (!focusedRef.current) setText(String(value));
  }, [value]);

  return (
    <input
      type="number"
      inputMode={integer ? "numeric" : "decimal"}
      step={step ?? (integer ? "1" : "0.01")}
      value={text}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onWheel={(e) => e.currentTarget.blur()}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        if (raw.trim() === "") return; // leave the field empty, don't force 0
        const n = integer ? parseInt(raw, 10) : Number(raw);
        if (Number.isFinite(n)) onValueChange(n);
      }}
      onBlur={() => {
        focusedRef.current = false;
        const n = integer ? parseInt(text, 10) : Number(text);
        const clean = text.trim() !== "" && Number.isFinite(n) ? n : 0;
        onValueChange(clean);
        setText(String(clean));
      }}
      className={inputClass}
    />
  );
}

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
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/cotizador/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Cambios guardados.");
      return;
    }
    const detail = await res.json().catch(() => null);
    setMessage(
      detail?.error
        ? `No se pudo guardar: ${detail.error}`
        : "No se pudo guardar. Intenta de nuevo."
    );
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
          <Link
            href="/admin/proyectos"
            className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors"
          >
            Proyectos
          </Link>
          <button
            onClick={() => setShowPasswordForm((v) => !v)}
            className="text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors cursor-pointer"
          >
            Cambiar contraseña
          </button>
          <button
            onClick={logout}
            className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <ChangePasswordModal onClose={() => setShowPasswordForm(false)} />
      )}

      {/* Formula constants */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Fórmula de dimensionamiento</h2>
        <p className="text-xs text-slate-500 mb-4">
          Paneles = ceil( (consumo_kwh / 30) × 1000 × factor_seguridad / (potencia_panel × HSP) )
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="HSP (horas sol pico)">
            <NumberInput
              step="0.1"
              value={config.formula.hsp}
              onValueChange={(hsp) =>
                setConfig({ ...config, formula: { ...config.formula, hsp } })
              }
            />
          </Field>
          <Field label="Factor de seguridad">
            <NumberInput
              value={config.formula.safetyFactor}
              onValueChange={(safetyFactor) =>
                setConfig({ ...config, formula: { ...config.formula, safetyFactor } })
              }
            />
          </Field>
          <Field label="Potencia del panel (W)">
            <NumberInput
              integer
              value={config.formula.panelWattage}
              onValueChange={(panelWattage) =>
                setConfig({ ...config, formula: { ...config.formula, panelWattage } })
              }
            />
          </Field>
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Descuento especial ($)">
            <NumberInput
              value={config.discount}
              onValueChange={(discount) => setConfig({ ...config, discount })}
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
                    <NumberInput
                      value={product.unitPrice}
                      onValueChange={(unitPrice) =>
                        setConfig(updateProduct(config, product.id, { unitPrice }))
                      }
                    />
                  </Field>
                  <Field label="Máx. paneles">
                    <NumberInput
                      integer
                      value={tier.maxPanels}
                      onValueChange={(maxPanels) =>
                        setConfig({
                          ...config,
                          inverterTiers: config.inverterTiers.map((t) =>
                            t.productId === tier.productId ? { ...t, maxPanels } : t
                          ),
                        })
                      }
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
          Media tensión se aplica cuando el inversor recomendado supera los 10K.
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

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async () => {
    setError(null);
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirm) {
      setError("La confirmación no coincide.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/cotizador/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setBusy(false);
    if (res.ok) {
      setOk(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      return;
    }
    const detail = await res.json().catch(() => null);
    setError(detail?.error ?? "No se pudo cambiar la contraseña.");
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <section
        className="card-base p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900">Cambiar contraseña</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-xs font-semibold text-slate-500 hover:text-navy-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
        {ok ? (
          <div className="space-y-4">
            <p className="text-sm text-green-700">Contraseña actualizada.</p>
            <button
              onClick={onClose}
              className="h-11 px-6 bg-navy-800 hover:bg-navy-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              Listo
            </button>
          </div>
        ) : (
        <div className="space-y-4">
          <Field label="Contraseña actual">
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Nueva contraseña">
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Confirmar nueva contraseña">
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={submit}
            disabled={busy || !currentPassword || !newPassword || !confirm}
            className="h-11 px-6 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            {busy ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
        )}
      </section>
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
        <NumberInput
          value={product.unitPrice}
          onValueChange={(unitPrice) => onChange({ unitPrice })}
        />
      </Field>
      {showRatio && (
        <Field label="Ratio / panel">
          <NumberInput
            value={product.ratioPerPanel ?? 0}
            onValueChange={(ratioPerPanel) => onChange({ ratioPerPanel })}
          />
        </Field>
      )}
      {showFixedQty && (
        <Field label="Cantidad fija">
          <NumberInput
            integer
            value={product.fixedQuantity ?? 0}
            onValueChange={(fixedQuantity) => onChange({ fixedQuantity })}
          />
        </Field>
      )}
    </div>
  );
}
