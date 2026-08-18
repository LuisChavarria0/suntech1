"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/lib/data/company";
import { calculateQuote, type QuoteResult } from "@/lib/cotizador/calculate";
import { generateQuotePdf } from "@/lib/cotizador/generatePdf";
import type { CotizadorConfig } from "@/lib/cotizador/config";

const currency = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
});

export function CotizadorCalculator() {
  const t = useTranslations("cotizador");
  const locale = useLocale() as "es" | "en";
  const [config, setConfig] = useState<CotizadorConfig | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [consumo, setConsumo] = useState("");
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    fetch("/api/cotizador/config")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then(setConfig)
      .catch(() => setLoadError(true));
  }, []);

  const quote: QuoteResult | null = useMemo(() => {
    if (!config) return null;
    const value = parseFloat(consumo);
    if (!value || value <= 0) return null;
    return calculateQuote(value, config);
  }, [config, consumo]);

  const whatsappHref = useMemo(() => {
    if (!quote || !quote.inverterTier) return null;
    const text = encodeURIComponent(
      t("whatsapp_message", {
        consumo: quote.consumoMensualKwh,
        paneles: quote.panelesNecesarios,
        inversor: quote.inverterTier.capacityLabel,
        total: currency.format(quote.total),
      })
    );
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
  }, [quote, t]);

  const sendViaWhatsapp = async () => {
    if (!quote || !whatsappHref) return;
    setPreparing(true);
    try {
      const blob = await generateQuotePdf(quote, locale);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion-suntech-${quote.consumoMensualKwh}kwh.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setPreparing(false);
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-base p-6 md:p-8 mb-8">
        <label
          htmlFor="consumo"
          className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
        >
          {t("input_label")}
        </label>
        <input
          id="consumo"
          type="number"
          min={0}
          inputMode="decimal"
          value={consumo}
          onChange={(e) => setConsumo(e.target.value)}
          placeholder={t("input_placeholder")}
          className="w-full h-14 px-4 rounded-xl border border-slate-200 text-lg text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
        />
        {loadError && (
          <p className="mt-3 text-sm text-red-600">{t("load_error")}</p>
        )}
      </div>

      {quote && quote.panelesNecesarios > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="card-base p-5 text-center">
              <div className="text-3xl font-extrabold text-navy-800">
                {quote.panelesNecesarios}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t("panels_needed")}</div>
            </div>
            <div className="card-base p-5 text-center">
              <div className="text-3xl font-extrabold text-navy-800">
                {quote.inverterTier?.capacityLabel ?? "—"}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t("inverter_recommended")}</div>
            </div>
            <div className="card-base p-5 text-center col-span-2 sm:col-span-1">
              <div className="text-3xl font-extrabold text-gold-600">
                {currency.format(quote.total)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t("total_estimated")}</div>
            </div>
          </div>

          {quote.exceedsStandardCapacity && (
            <div className="rounded-xl bg-gold-500/10 border border-gold-500/30 text-navy-900 text-sm p-4">
              {t("exceeds_capacity")}
            </div>
          )}

          {/* Mobile: stacked cards */}
          <div className="card-base divide-y divide-slate-100 sm:hidden">
            {quote.lines.map((line) => (
              <div key={line.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-navy-900 font-medium text-sm">{line.name}</span>
                  <span className="text-navy-900 font-semibold text-sm whitespace-nowrap">
                    {currency.format(line.subtotal)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {line.quantity} × {currency.format(line.unitPrice)}
                </div>
              </div>
            ))}
            <div className="p-4 space-y-1.5 bg-slate-50">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t("table_subtotal")}</span>
                <span>{currency.format(quote.subtotal)}</span>
              </div>
              {quote.discount > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t("discount")}</span>
                  <span>-{currency.format(quote.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-navy-900 pt-1">
                <span>{t("total_with_tax")}</span>
                <span className="text-gold-600">{currency.format(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Desktop: table */}
          <div className="card-base overflow-hidden hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-800 text-white text-left">
                  <th className="py-3 px-4 font-semibold">{t("table_product")}</th>
                  <th className="py-3 px-4 font-semibold text-center">{t("table_qty")}</th>
                  <th className="py-3 px-4 font-semibold text-right">{t("table_unit_price")}</th>
                  <th className="py-3 px-4 font-semibold text-right">{t("table_subtotal")}</th>
                </tr>
              </thead>
              <tbody>
                {quote.lines.map((line) => (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="py-2.5 px-4 text-navy-900">{line.name}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600">{line.quantity}</td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {currency.format(line.unitPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-navy-900 font-medium">
                      {currency.format(line.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200">
                  <td colSpan={3} className="py-2.5 px-4 text-right font-semibold text-navy-900">
                    {t("table_subtotal")}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                    {currency.format(quote.subtotal)}
                  </td>
                </tr>
                {quote.discount > 0 && (
                  <tr>
                    <td colSpan={3} className="py-2.5 px-4 text-right font-semibold text-navy-900">
                      {t("discount")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                      -{currency.format(quote.discount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50">
                  <td colSpan={3} className="py-3 px-4 text-right font-bold text-navy-900">
                    {t("total_with_tax")}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gold-600 text-base">
                    {currency.format(quote.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {whatsappHref && (
            <div>
              <button
                onClick={sendViaWhatsapp}
                disabled={preparing}
                className="btn-shine inline-flex items-center gap-2 h-14 px-8 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {preparing ? t("generating_pdf") : t("send_whatsapp")}
              </button>
              <p className="mt-2 text-sm text-slate-500">{t("whatsapp_hint")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
