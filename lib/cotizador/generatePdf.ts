import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuoteResult } from "./calculate";
import { COMPANY_INFO, CONTACT } from "@/lib/data/company";

const NAVY: [number, number, number] = [10, 30, 77];
const NAVY_LIGHT: [number, number, number] = [100, 116, 139];
const GOLD: [number, number, number] = [249, 115, 22];
const BORDER: [number, number, number] = [226, 232, 240];

const currency = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
});

type Locale = "es" | "en";

const LABELS: Record<
  Locale,
  {
    title: string;
    avgConsumption: string;
    panelsNeeded: string;
    recommendedInverter: string;
    tableProduct: string;
    tableQty: string;
    tableUnitPrice: string;
    tableSubtotal: string;
    subtotal: string;
    discount: string;
    total: string;
    exceedsCapacity: string;
    disclaimer: string;
    perMonth: string;
  }
> = {
  es: {
    title: "Cotización — Sistema Solar",
    avgConsumption: "Consumo promedio",
    panelsNeeded: "Paneles necesarios",
    recommendedInverter: "Inversor recomendado",
    tableProduct: "Producto",
    tableQty: "Cant.",
    tableUnitPrice: "P.U.",
    tableSubtotal: "Subtotal",
    subtotal: "Subtotal",
    discount: "Descuento especial",
    total: "Total (IVA incluido)",
    exceedsCapacity:
      "Este consumo supera la capacidad estándar de cotización automática. Se muestra el sistema más grande disponible; contáctanos para una propuesta a medida.",
    disclaimer:
      "Esta cotización tiene fines informativos y puede variar dependiendo de la inspección técnica virtual o presencial que se pueda realizar.",
    perMonth: "Kwh / mes",
  },
  en: {
    title: "Quote — Solar System",
    avgConsumption: "Average consumption",
    panelsNeeded: "Panels needed",
    recommendedInverter: "Recommended inverter",
    tableProduct: "Product",
    tableQty: "Qty.",
    tableUnitPrice: "Unit price",
    tableSubtotal: "Subtotal",
    subtotal: "Subtotal",
    discount: "Special discount",
    total: "Total (tax included)",
    exceedsCapacity:
      "This consumption exceeds our standard automatic quoting capacity. We're showing you the largest available system; contact us for a custom proposal.",
    disclaimer:
      "This quote is for informational purposes and may vary depending on the virtual or on-site technical inspection that may be carried out.",
    perMonth: "Kwh / month",
  },
};

function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas context"));
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function generateQuotePdf(quote: QuoteResult, locale: Locale = "es"): Promise<Blob> {
  const t = LABELS[locale];
  const dateLocale = locale === "es" ? "es-SV" : "en-US";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  let logo: { dataUrl: string; width: number; height: number } | null = null;
  try {
    logo = await loadImageAsDataUrl(COMPANY_INFO.logoUrl);
  } catch {
    logo = null;
  }

  let cursorY = margin;

  if (logo) {
    const logoHeight = 36;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    doc.addImage(logo.dataUrl, "PNG", margin, cursorY, logoWidth, logoHeight);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(t.title, pageWidth - margin, cursorY + 14, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY_LIGHT);
  const dateStr = new Intl.DateTimeFormat(dateLocale, { dateStyle: "long" }).format(new Date());
  doc.text(dateStr, pageWidth - margin, cursorY + 28, { align: "right" });

  cursorY += 60;

  doc.setDrawColor(...BORDER);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 24;

  const summaryItems: [string, string][] = [
    [t.avgConsumption, `${quote.consumoMensualKwh} ${t.perMonth}`],
    [t.panelsNeeded, `${quote.panelesNecesarios}`],
    [t.recommendedInverter, quote.inverterTier?.capacityLabel ?? "—"],
  ];
  const colWidth = (pageWidth - margin * 2) / 3;
  summaryItems.forEach(([label, value], i) => {
    const x = margin + colWidth * i;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY_LIGHT);
    doc.text(label.toUpperCase(), x, cursorY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text(value, x, cursorY + 18);
  });

  cursorY += 44;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [[t.tableProduct, t.tableQty, t.tableUnitPrice, t.tableSubtotal]],
    body: quote.lines.map((line) => [
      line.name,
      String(line.quantity),
      currency.format(line.unitPrice),
      currency.format(line.subtotal),
    ]),
    styles: { fontSize: 8, cellPadding: 5, textColor: [15, 23, 42] },
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 70, halign: "right" },
      3: { cellWidth: 80, halign: "right" },
    },
  });

  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  const totalsX = pageWidth - margin;
  let totalsY = afterTableY;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY_LIGHT);
  doc.text(t.subtotal, totalsX - 100, totalsY, { align: "right" });
  doc.text(currency.format(quote.subtotal), totalsX, totalsY, { align: "right" });
  totalsY += 16;

  if (quote.discount > 0) {
    doc.text(t.discount, totalsX - 100, totalsY, { align: "right" });
    doc.text(`-${currency.format(quote.discount)}`, totalsX, totalsY, { align: "right" });
    totalsY += 16;
  }

  doc.setDrawColor(...BORDER);
  doc.line(totalsX - 180, totalsY, totalsX, totalsY);
  totalsY += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text(t.total, totalsX - 100, totalsY, { align: "right" });
  doc.setTextColor(...GOLD);
  doc.text(currency.format(quote.total), totalsX, totalsY, { align: "right" });

  if (quote.exceedsStandardCapacity) {
    totalsY += 26;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY_LIGHT);
    const note = doc.splitTextToSize(t.exceedsCapacity, pageWidth - margin * 2);
    doc.text(note, margin, totalsY);
    totalsY += note.length * 10;
  }

  totalsY += 22;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY_LIGHT);
  const disclaimer = doc.splitTextToSize(t.disclaimer, pageWidth - margin * 2);
  doc.text(disclaimer, margin, totalsY);

  const footerY = pageHeight - 40;
  doc.setDrawColor(...BORDER);
  doc.line(margin, footerY - 14, pageWidth - margin, footerY - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY_LIGHT);
  doc.text(
    `${COMPANY_INFO.name}  •  Tel: ${CONTACT.phone}  •  WhatsApp: ${CONTACT.whatsapp}  •  ${CONTACT.email}`,
    margin,
    footerY
  );
  doc.text(CONTACT.address, margin, footerY + 12);

  return doc.output("blob");
}
