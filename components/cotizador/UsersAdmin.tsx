"use client";

import { useState, type FormEvent } from "react";
import type { PublicUser } from "@/lib/cotizador/users";
import type { AuditLogEntry } from "@/lib/cotizador/auditLog";
import type { SessionPayload } from "@/lib/cotizador/auth";
import { AdminShell } from "./AdminShell";

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all";

const dateFormatter = new Intl.DateTimeFormat("es-SV", {
  dateStyle: "medium",
  timeStyle: "short",
});

const LOGS_PER_PAGE = 10;

const ACTION_LABELS: Record<string, string> = {
  update_config: "Actualizó cotizador",
  create_user: "Creó usuario",
  disable_user: "Inhabilitó usuario",
  enable_user: "Habilitó usuario",
};

export function UsersAdmin({
  initialUsers,
  initialLogs,
  session,
}: {
  initialUsers: PublicUser[];
  initialLogs: AuditLogEntry[];
  session: SessionPayload;
}) {
  const currentUserId = session.userId;
  const [users, setUsers] = useState<PublicUser[]>(initialUsers);
  const [logs] = useState<AuditLogEntry[]>(initialLogs);
  const [logPage, setLogPage] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const totalLogPages = Math.max(1, Math.ceil(logs.length / LOGS_PER_PAGE));
  const pagedLogs = logs.slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  const addUser = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    const res = await fetch("/api/cotizador/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear el usuario");
      return;
    }

    const newUser: PublicUser = await res.json();
    setUsers((prev) => [...prev, newUser]);
    setUsername("");
    setPassword("");
  };

  const toggleDisabled = async (user: PublicUser) => {
    setTogglingId(user.id);
    const res = await fetch(`/api/cotizador/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !user.disabled }),
    });
    setTogglingId(null);

    if (!res.ok) return;

    const updated: PublicUser = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <AdminShell session={session} maxWidth="4xl">
      <h1 className="text-xl font-bold text-navy-900 mb-8">Usuarios y registro de cambios</h1>

      {/* Users table */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-4">Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-800 text-white text-left">
                <th className="py-2.5 px-3 font-semibold">Usuario</th>
                <th className="py-2.5 px-3 font-semibold">Rol</th>
                <th className="py-2.5 px-3 font-semibold">Estado</th>
                <th className="py-2.5 px-3 font-semibold">Creado</th>
                <th className="py-2.5 px-3 font-semibold">Creado por</th>
                <th className="py-2.5 px-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="py-2 px-3 text-navy-900 font-medium">{u.username}</td>
                  <td className="py-2 px-3 text-slate-600">
                    {u.role === "super_admin" ? "Super administrador" : "Editor"}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.disabled
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.disabled ? "Inhabilitado" : "Activo"}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-600">{dateFormatter.format(new Date(u.createdAt))}</td>
                  <td className="py-2 px-3 text-slate-600">{u.createdBy ?? "—"}</td>
                  <td className="py-2 px-3 text-right">
                    {u.id === currentUserId ? (
                      <span className="text-xs text-slate-400">(tu cuenta)</span>
                    ) : (
                      <button
                        onClick={() => toggleDisabled(u)}
                        disabled={togglingId === u.id}
                        className="text-xs font-semibold text-navy-700 hover:text-navy-900 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {u.disabled ? "Habilitar" : "Inhabilitar"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add user */}
      <section className="card-base p-6 mb-6">
        <h2 className="font-bold text-navy-900 mb-1">Agregar usuario</h2>
        <p className="text-xs text-slate-500 mb-4">
          El nuevo usuario solo podrá modificar los valores del cotizador (rol Editor).
        </p>
        <form onSubmit={addUser} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Usuario
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            className="h-10 px-6 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            {creating ? "Creando..." : "Agregar"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      {/* Audit log */}
      <section className="card-base p-6">
        <h2 className="font-bold text-navy-900 mb-4">Registro de cambios</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-800 text-white text-left">
                <th className="py-2.5 px-3 font-semibold">Fecha</th>
                <th className="py-2.5 px-3 font-semibold">Usuario</th>
                <th className="py-2.5 px-3 font-semibold">Acción</th>
                <th className="py-2.5 px-3 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 px-3 text-center text-slate-400">
                    Todavía no hay cambios registrados.
                  </td>
                </tr>
              )}
              {pagedLogs.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100 align-top">
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {dateFormatter.format(new Date(entry.timestamp))}
                  </td>
                  <td className="py-2 px-3 text-navy-900 font-medium whitespace-nowrap">
                    {entry.username}
                  </td>
                  <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-500">
              Página {logPage} de {totalLogPages} — {logs.length} registros
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                disabled={logPage === 1}
                className="h-8 px-3 rounded-lg border border-slate-200 text-sm font-medium text-navy-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                disabled={logPage === totalLogPages}
                className="h-8 px-3 rounded-lg border border-slate-200 text-sm font-medium text-navy-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
