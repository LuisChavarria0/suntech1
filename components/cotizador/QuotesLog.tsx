"use client";

import { useState } from "react";
import type { QuoteLogEntry } from "@/lib/cotizador/quotesLog";
import type { SessionPayload } from "@/lib/cotizador/auth";
import { AdminShell } from "./AdminShell";

const dateFormatter = new Intl.DateTimeFormat("es-SV", {
  dateStyle: "medium",
  timeStyle: "short",
});

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const QUOTES_PER_PAGE = 10;

const selectClass =
  "h-9 px-3 rounded-lg border border-slate-200 text-sm text-navy-900 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all cursor-pointer";

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function QuotesLog({
  initialQuotes,
  availableMonths,
  session,
}: {
  initialQuotes: QuoteLogEntry[];
  availableMonths: string[];
  session: SessionPayload;
}) {
  const defaultYearMonth = availableMonths[0] ?? currentYearMonth();
  const [defaultYear, defaultMonth] = defaultYearMonth.split("-");

  const [quotes, setQuotes] = useState<QuoteLogEntry[]>(initialQuotes);
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState<string>(defaultMonth); // "" = todo el año
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const years = Array.from(new Set(availableMonths.map((m) => m.slice(0, 4))));
  if (!years.includes(defaultYear)) years.unshift(defaultYear);
  years.sort().reverse();

  const monthsForYear = availableMonths
    .filter((m) => m.startsWith(`${year}-`))
    .map((m) => m.slice(5));
  if (year === defaultYear && !monthsForYear.includes(defaultMonth)) {
    monthsForYear.unshift(defaultMonth);
  }

  const load = async (nextYear: string, nextMonth: string) => {
    setLoading(true);
    const qs = new URLSearchParams({ year: nextYear });
    if (nextMonth) qs.set("month", nextMonth);
    try {
      const res = await fetch(`/api/cotizador/quotes?${qs.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.entries);
        setPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const onYearChange = (nextYear: string) => {
    setYear(nextYear);
    setMonth("");
    load(nextYear, "");
  };

  const onMonthChange = (nextMonth: string) => {
    setMonth(nextMonth);
    load(year, nextMonth);
  };

  const totalPages = Math.max(1, Math.ceil(quotes.length / QUOTES_PER_PAGE));
  const paged = quotes.slice((page - 1) * QUOTES_PER_PAGE, page * QUOTES_PER_PAGE);

  return (
    <AdminShell session={session} maxWidth="5xl">
      <h1 className="text-xl font-bold text-navy-900 mb-8">Registro de cotizaciones</h1>

      <section className="card-base p-6">
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Año
            <select
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              className={selectClass}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Mes
            <select
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Todos los meses</option>
              {monthsForYear.map((m) => (
                <option key={m} value={m}>
                  {MONTH_NAMES[parseInt(m, 10) - 1]}
                </option>
              ))}
            </select>
          </label>
          {loading && <span className="text-xs text-slate-400">Cargando…</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-800 text-white text-left">
                <th className="py-2.5 px-3 font-semibold">Fecha</th>
                <th className="py-2.5 px-3 font-semibold">Tipo de sistema</th>
                <th className="py-2.5 px-3 font-semibold">KW</th>
                <th className="py-2.5 px-3 font-semibold">Nombre</th>
                <th className="py-2.5 px-3 font-semibold">Dirección</th>
                <th className="py-2.5 px-3 font-semibold">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 px-3 text-center text-slate-400">
                    No hay cotizaciones registradas para este período.
                  </td>
                </tr>
              )}
              {paged.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100 align-top">
                  <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                    {dateFormatter.format(new Date(entry.timestamp))}
                  </td>
                  <td className="py-2 px-3 text-slate-600 whitespace-nowrap">{entry.systemType}</td>
                  <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                    {entry.kw != null ? `${entry.kw} KW` : "—"}
                  </td>
                  <td className="py-2 px-3 text-navy-900 font-medium whitespace-nowrap">{entry.name}</td>
                  <td className="py-2 px-3 text-slate-600">{entry.address}</td>
                  <td className="py-2 px-3 text-slate-600 whitespace-nowrap">{entry.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quotes.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-500">
              Página {page} de {totalPages} — {quotes.length} registros
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-3 rounded-lg border border-slate-200 text-sm font-medium text-navy-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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
