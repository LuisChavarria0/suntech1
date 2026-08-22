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
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const clientInfoComplete =
    clientName.trim().length > 0 && clientAddress.trim().length > 0 && clientPhone.trim().length > 0;

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
    if (!quote || !whatsappHref || !clientInfoComplete) return;
    setPreparing(true);
    // Open the WhatsApp tab synchronously (still inside the click handler) so mobile
    // browsers don't treat it as a blocked popup once we hand it a URL later.
    const waWindow = window.open("", "_blank");
    try {
      const blob = await generateQuotePdf(quote, locale, {
        name: clientName.trim(),
        address: clientAddress.trim(),
        phone: clientPhone.trim(),
      });
      const url = URL.createObjectURL(blob);
      const stamp = new Intl.DateTimeFormat("sv-SE", {
        dateStyle: "short",
        timeStyle: "medium",
      })
        .format(new Date())
        .replace(/[: ]/g, "-");
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion-suntech-${quote.consumoMensualKwh}kwh-${stamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Give mobile browsers a moment to actually start the download before we
      // navigate away to WhatsApp and revoke the blob URL.
      await new Promise((resolve) => setTimeout(resolve, 800));
      URL.revokeObjectURL(url);
    } finally {
      setPreparing(false);
      if (waWindow) {
        waWindow.location.href = whatsappHref;
      } else {
        window.open(whatsappHref, "_blank", "noopener,noreferrer");
      }
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
            <div className="card-base p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">
                {t("client_info_title")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
                  >
                    {t("client_name_label")}
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t("client_name_placeholder")}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientAddress"
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
                  >
                    {t("client_address_label")}
                  </label>
                  <input
                    id="clientAddress"
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder={t("client_address_placeholder")}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientPhone"
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2"
                  >
                    {t("client_phone_label")}
                  </label>
                  <input
                    id="clientPhone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={t("client_phone_placeholder")}
                    className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={sendViaWhatsapp}
                  disabled={preparing || !clientInfoComplete}
                  className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-14 px-6 sm:px-8 py-3 bg-navy-800 hover:bg-navy-700 disabled:opacity-60 text-white text-base sm:text-lg font-bold text-center rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:hover:translate-y-0"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  {preparing ? t("generating_pdf") : t("send_whatsapp")}
                </button>
                <p className="mt-2 text-sm text-slate-500">
                  {clientInfoComplete ? t("whatsapp_hint") : t("client_info_required")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
