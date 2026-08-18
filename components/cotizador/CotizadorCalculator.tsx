"use client";

import { useEffect, useMemo, useState } from "react";
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
      `Hola, quiero cotizar un sistema solar.\nConsumo promedio: ${quote.consumoMensualKwh} Kwh\nPaneles estimados: ${quote.panelesNecesarios}\nInversor: ${quote.inverterTier.capacityLabel}\nTotal estimado: ${currency.format(quote.total)}\n\nAdjunto el PDF de mi cotización descargada.`
    );
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
  }, [quote]);

  const sendViaWhatsapp = async () => {
    if (!quote || !whatsappHref) return;
    setPreparing(true);
    try {
      const blob = await generateQuotePdf(quote);
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
          Ingresar Consumo Promedio de Factura Eléctrica (Kwh, entre 30 días)
        </label>
        <input
          id="consumo"
          type="number"
          min={0}
          inputMode="decimal"
          value={consumo}
          onChange={(e) => setConsumo(e.target.value)}
          placeholder="Ej. 350"
          className="w-full h-14 px-4 rounded-xl border border-slate-200 text-lg text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
        />
        {loadError && (
          <p className="mt-3 text-sm text-red-600">
            No se pudo cargar la configuración del cotizador. Intenta recargar la página.
          </p>
        )}
      </div>

      {quote && quote.panelesNecesarios > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="card-base p-5 text-center">
              <div className="text-3xl font-extrabold text-navy-800">
                {quote.panelesNecesarios}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Paneles necesarios</div>
            </div>
            <div className="card-base p-5 text-center">
              <div className="text-3xl font-extrabold text-navy-800">
                {quote.inverterTier?.capacityLabel ?? "—"}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Inversor recomendado</div>
            </div>
            <div className="card-base p-5 text-center col-span-2 sm:col-span-1">
              <div className="text-3xl font-extrabold text-gold-600">
                {currency.format(quote.total)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total estimado</div>
            </div>
          </div>

          {quote.exceedsStandardCapacity && (
            <div className="rounded-xl bg-gold-500/10 border border-gold-500/30 text-navy-900 text-sm p-4">
              Este consumo supera nuestra capacidad estándar de cotización automática.
              Te mostramos el sistema más grande disponible; contáctanos para una propuesta a medida.
            </div>
          )}

          <div className="card-base overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-800 text-white text-left">
                  <th className="py-3 px-4 font-semibold">Producto</th>
                  <th className="py-3 px-4 font-semibold text-center">Cant.</th>
                  <th className="py-3 px-4 font-semibold text-right">PU</th>
                  <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
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
                    Subtotal
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                    {currency.format(quote.subtotal)}
                  </td>
                </tr>
                {quote.discount > 0 && (
                  <tr>
                    <td colSpan={3} className="py-2.5 px-4 text-right font-semibold text-navy-900">
                      Descuento especial
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-navy-900">
                      -{currency.format(quote.discount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50">
                  <td colSpan={3} className="py-3 px-4 text-right font-bold text-navy-900">
                    Total (IVA incluido)
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
                {preparing ? "Generando PDF..." : "Descargar PDF y enviar por WhatsApp"}
              </button>
              <p className="mt-2 text-s text-slate-500">
                Se descargará el PDF de tu cotización y se abrirá WhatsApp — adjúnta la cotización descargada.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
