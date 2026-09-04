"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
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
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Contraseña actual
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nueva contraseña
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Confirmar nueva contraseña
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </label>
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
