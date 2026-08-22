import { jsPDF } from "jspdf";
import type { QuoteResult } from "./calculate";

const NAVY: [number, number, number] = [10, 30, 77];
const NAVY_LIGHT: [number, number, number] = [100, 116, 139];
const GOLD: [number, number, number] = [249, 115, 22];

const currency = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
});

export type Locale = "es" | "en";

export interface ClientInfo {
  name: string;
  address: string;
  phone: string;
}

interface DescSegment {
  text: string;
  bold?: boolean;
}

const LABELS: Record<
  Locale,
  {
    preliminary: string;
    quoteDate: string;
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    systemAmount: string;
    consumptionBanner: (kwh: number) => string;
    headerNote: string;
    description: (quote: QuoteResult) => DescSegment[][];
  }
> = {
  es: {
    preliminary: "COTIZACIÓN PRELIMINAR, GENERADA AUTOMÁTICAMENTE",
    quoteDate: "Fecha de cotización",
    clientName: "Nombre del cliente",
    clientAddress: "Dirección del cliente",
    clientPhone: "Teléfono del cliente",
    systemAmount: "Monto total del sistema",
    consumptionBanner: (kwh) =>
      `Sistema fotovoltaico, proyectado según el consumo de los últimos 6 meses: ${kwh} kWh`,
    headerNote:
      "sin tomar en cuenta inspección técnica: revisión de sistema eléctrico y superficie a instalar",
    description: (q) => [
      [
        { text: "Sistema Solar Fotovoltaico (SFV) con inyección a la red eléctrica, diseñado para un consumo promedio de " },
        { text: `${q.consumoMensualKwh} kWh`, bold: true },
        { text: " mensuales. El sistema está compuesto por " },
        {
          text: `${q.panelesNecesarios} panel(es) solar(es) y un inversor ${q.inverterTier?.capacityLabel ?? "—"}`,
          bold: true,
        },
        {
          text: ", rieles y herrajes para la fijación de los paneles sobre techo, protecciones eléctricas AC y DC, así como todos los suministros necesarios para la instalación eléctrica y mecánica.",
        },
      ],
      [
        {
          text: "Incluye instalación, configuración y puesta en marcha del sistema, monitoreo en línea de la producción fotovoltaica y del consumo de la propiedad (requiere conexión WiFi), además de la gestión de los trámites de inyección a la red ante la compañía distribuidora de energía eléctrica.",
        },
      ],
    ],
  },
  en: {
    preliminary: "PRELIMINARY QUOTE, AUTOMATICALLY GENERATED",
    quoteDate: "Quote date",
    clientName: "Client name",
    clientAddress: "Client address",
    clientPhone: "Client phone",
    systemAmount: "Total system amount",
    consumptionBanner: (kwh) =>
      `Solar system, projected from the last 6 months of consumption: ${kwh} kWh`,
    headerNote:
      "not accounting for the technical inspection: review of the electrical system and installation surface",
    description: (q) => [
      [
        { text: "Grid-tied Photovoltaic System (PV) designed for an average consumption of " },
        { text: `${q.consumoMensualKwh} kWh`, bold: true },
        { text: " per month. The system is made up of " },
        {
          text: `${q.panelesNecesarios} solar panel(s) and a ${q.inverterTier?.capacityLabel ?? "—"} inverter`,
          bold: true,
        },
        {
          text: ", rails and mounting hardware to fix the panels to the roof, AC and DC electrical protections, and all supplies necessary for the electrical and mechanical installation.",
        },
      ],
      [
        {
          text: "Includes installation, configuration and commissioning of the system, online monitoring of the photovoltaic production and property consumption (requires WiFi connection), plus managing the grid-injection paperwork with the utility company.",
        },
      ],
    ],
  },
};

// Exact letterhead template (public/cotizardor/quote-letterhead.png), traced from the
// approved reference PDF. Fractions below are pixel-measured against that image's
// 2481x3509 canvas so the overlay text lands precisely in its blank slots.
const LETTERHEAD_URL = "/cotizardor/quote-letterhead.jpg";

const MARGIN_X_FRAC = 0.1;
const HEADER_BOTTOM_FRAC = 0.1114;
const BADGE_LEFT_FRAC = 0.728;
const BANNER_TOP_FRAC = 0.3785;
const BANNER_BOTTOM_FRAC = 0.4312;
const PRODUCT_COL_RIGHT_FRAC = 0.5829;
const COST_BOX = { left: 0.7497, right: 0.8755, top: 0.5831, bottom: 0.6384 };

function drawRichParagraph(
  doc: jsPDF,
  segments: DescSegment[],
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  // Flatten segments into a single character stream (preserving adjacency across
  // segment boundaries, e.g. a bold word directly followed by a comma) so word
  // wrapping doesn't insert spurious spaces at segment edges.
  let fullText = "";
  const boldAt: boolean[] = [];
  segments.forEach((segment) => {
    for (const ch of segment.text) {
      fullText += ch;
      boldAt.push(Boolean(segment.bold));
    }
  });

  let cursorX = x;
  let cursorY = startY;
  let index = 0;

  fullText.split(" ").forEach((word) => {
    const wordStart = index;
    index += word.length + 1;
    if (word === "") return;
    const bold = boldAt[wordStart];
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const wordWidth = doc.getTextWidth(word);
    const spaceWidth = cursorX === x ? 0 : doc.getTextWidth(" ");
    if (cursorX !== x && cursorX + spaceWidth + wordWidth > x + maxWidth) {
      cursorX = x;
      cursorY += lineHeight;
    } else if (cursorX !== x) {
      doc.text(" ", cursorX, cursorY);
      cursorX += spaceWidth;
    }
    doc.text(word, cursorX, cursorY);
    cursorX += wordWidth;
  });

  return cursorY + lineHeight;
}

async function loadImageDataUrl(url: string): Promise<string> {
  const res = await fetch(encodeURI(url));
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateQuotePdf(
  quote: QuoteResult,
  locale: Locale = "es",
  client: ClientInfo = { name: "", address: "", phone: "" }
): Promise<Blob> {
  const t = LABELS[locale];
  const dateLocale = locale === "es" ? "es-SV" : "en-US";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = MARGIN_X_FRAC * pageWidth;

  const letterhead = await loadImageDataUrl(LETTERHEAD_URL);
  doc.addImage(letterhead, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "NONE");

  // --- Title + subtitle (blank gap between header and consumption banner) ---
  const titleWidth = BADGE_LEFT_FRAC * pageWidth - margin - 20;
  let cursorY = HEADER_BOTTOM_FRAC * pageHeight + 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(t.preliminary, titleWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 17 + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY_LIGHT);
  const subtitleLines = doc.splitTextToSize(
    `${t.consumptionBanner(quote.consumoMensualKwh)} ${t.headerNote}`,
    titleWidth
  );
  doc.text(subtitleLines, margin, cursorY);
  cursorY += subtitleLines.length * 11 + 16;

  // --- Client info rows ---
  const dateStr = new Intl.DateTimeFormat(dateLocale, { dateStyle: "long" }).format(new Date());
  const clientRows: [string, string][] = [
    [t.quoteDate, dateStr],
    [t.clientName, client.name || "—"],
    [t.clientAddress, client.address || "—"],
    [t.clientPhone, client.phone || "—"],
    [t.systemAmount, currency.format(quote.total)],
  ];
  clientRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...NAVY);
    doc.text(`${label}:`, margin, cursorY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(value, margin + 130, cursorY);
    cursorY += 16;
  });

  // --- Consumption value inside the navy banner ---
  const bannerCenterY = ((BANNER_TOP_FRAC + BANNER_BOTTOM_FRAC) / 2) * pageHeight;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(t.consumptionBanner(quote.consumoMensualKwh), pageWidth / 2, bannerCenterY + 4, {
    align: "center",
  });

  // --- Description paragraph inside the Producto column ---
  const productColX = margin + 8;
  const productColWidth = PRODUCT_COL_RIGHT_FRAC * pageWidth - productColX - 10;
  const productTop = BANNER_BOTTOM_FRAC * pageHeight + 70;

  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  let descY = productTop;
  t.description(quote).forEach((paragraph) => {
    descY = drawRichParagraph(doc, paragraph, productColX, descY, productColWidth, 13.5);
  });

  // --- Total cost inside the cost box ---
  const costBoxCx = ((COST_BOX.left + COST_BOX.right) / 2) * pageWidth;
  const costBoxCy = ((COST_BOX.top + COST_BOX.bottom) / 2) * pageHeight;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(currency.format(quote.total), costBoxCx, costBoxCy + 5, { align: "center" });

  return doc.output("blob");
}
