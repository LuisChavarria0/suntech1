"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
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

// Example receipt infographic shown under the "how to read your bill" help text.
const RECEIPT_EXAMPLE_IMG = "/images/kWh.png";

// Infographic pages explaining how to identify a single/three-phase supply.
const CONNECTION_GUIDE_IMGS = [
  "/images/info-coti1.webp",
  "/images/info-coti2.webp",
  "/images/info-coti3.webp",
];

const CONNECTION_OPTIONS = ["mono", "tri", "unknown"] as const;
type ConnectionType = (typeof CONNECTION_OPTIONS)[number];

// Admin-facing labels for the quotes log — always Spanish, independent of the
// visitor's site locale.
const SYSTEM_TYPE_LABELS: Record<ConnectionType, string> = {
  mono: "Monofásico",
  tri: "Trifásico",
  unknown: "Sin especificar",
};

export function CotizadorCalculator() {
  const t = useTranslations("cotizador");
  const locale = useLocale() as "es" | "en";
  const [config, setConfig] = useState<CotizadorConfig | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [consumo, setConsumo] = useState("");
  const [connection, setConnection] = useState<ConnectionType | null>(null);
  const [showConnectionGuide, setShowConnectionGuide] = useState(false);
  const [receiptImgOk, setReceiptImgOk] = useState(true);
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const hadResultsRef = useRef(false);

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

  const hasResults = !!(quote && quote.panelesNecesarios > 0);

  // Slide down to the results the first time they appear after entering consumption.
  useEffect(() => {
    if (hasResults && !hadResultsRef.current) {
      const id = window.setTimeout(() => {
        hadResultsRef.current = true;
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => window.clearTimeout(id);
    }
    if (!hasResults) hadResultsRef.current = false;
  }, [hasResults]);

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
        connection,
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

      // Best-effort: log the quote for the admin registry. Never blocks or
      // breaks the WhatsApp handoff if it fails.
      fetch("/api/cotizador/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemType: connection ? SYSTEM_TYPE_LABELS[connection] : SYSTEM_TYPE_LABELS.unknown,
          kw: quote.inverterTier?.capacityKw ?? null,
          name: clientName.trim(),
          address: clientAddress.trim(),
          phone: clientPhone.trim(),
        }),
      }).catch(() => {});
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
        <p className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
          {t("connection_title")}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {CONNECTION_OPTIONS.map((opt) => {
            const selected = connection === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setConnection(selected ? null : opt)}
                aria-pressed={selected}
                className={`flex-1 h-11 px-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                  selected
                    ? "border-gold-400 bg-gold-400/10 text-navy-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {t(`connection_${opt}`)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowConnectionGuide((v) => !v)}
          aria-expanded={showConnectionGuide}
          className="mt-3 text-sm font-semibold text-gold-600 hover:text-gold-700 cursor-pointer"
        >
          {showConnectionGuide ? t("connection_guide_hide") : t("connection_guide_show")}
        </button>
        {connection && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {t(`connection_${connection}_info`)}
          </p>
        )}
        {showConnectionGuide && (
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {CONNECTION_GUIDE_IMGS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={t("connection_guide_alt", { page: i + 1 })}
                loading="lazy"
                onClick={() => setZoomImg(src)}
                className="w-28 sm:w-32 rounded-lg border border-slate-200 cursor-zoom-in transition-transform hover:scale-[1.03]"
              />
            ))}
          </div>
        )}

        {connection && (
          <>
            <hr className="my-6 border-slate-200" />

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
              onWheel={(e) => e.currentTarget.blur()}
              placeholder={t("input_placeholder")}
              className="w-full h-14 px-4 rounded-xl border border-slate-200 text-lg text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {loadError && (
              <p className="mt-3 text-sm text-red-600">{t("load_error")}</p>
            )}

            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 sm:items-start">
              {receiptImgOk && (
                <img
                  src={RECEIPT_EXAMPLE_IMG}
                  alt={t("receipt_help_image_alt")}
                  onError={() => setReceiptImgOk(false)}
                  onClick={() => setZoomImg(RECEIPT_EXAMPLE_IMG)}
                  className="w-32 sm:w-40 shrink-0 rounded-lg border border-slate-200 cursor-zoom-in transition-transform hover:scale-[1.03]"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-navy-800">{t("receipt_help_title")}</p>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{t("receipt_help_body")}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {hasResults && quote && (
        <div ref={resultsRef} className="space-y-6 scroll-mt-4">
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

          {/* {quote.exceedsStandardCapacity && (
            <div className="rounded-xl bg-gold-500/10 border border-gold-500/30 text-navy-900 text-sm p-4">
              {t("exceeds_capacity")}
            </div>
          )} */}

          {/* Mobile: stacked cards */}
          <div className="card-base divide-y divide-slate-100 sm:hidden">
            {quote.lines.map((line) => (
              <div key={line.id} className="p-4 flex items-start justify-between gap-3">
                <span className="text-navy-900 font-medium text-sm">{line.name}</span>
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  {t("table_qty")} {line.quantity}
                </span>
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
                </tr>
              </thead>
              <tbody>
                {quote.lines.map((line) => (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="py-2.5 px-4 text-navy-900">{line.name}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600">{line.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200">
                  <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                    {t("table_subtotal")}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-navy-900 whitespace-nowrap">
                    {currency.format(quote.subtotal)}
                  </td>
                </tr>
                {quote.discount > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                      {t("discount")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-navy-900 whitespace-nowrap">
                      -{currency.format(quote.discount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50">
                  <td className="py-3 px-4 text-right font-bold text-navy-900">
                    {t("total_with_tax")}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gold-600 text-base whitespace-nowrap">
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

      {zoomImg && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-navy-950/90 p-4 cursor-zoom-out"
          onClick={() => setZoomImg(null)}
        >
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => setZoomImg(null)}
            className="absolute top-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={zoomImg}
            alt={t("receipt_help_image_alt")}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full w-auto rounded-lg cursor-default"
          />
        </div>
      )}
    </div>
  );
}
