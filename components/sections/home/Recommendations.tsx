"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, FileText, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { LockedPdfViewer } from "@/components/ui/LockedPdfViewer";

const LETTERS = [
  {
    key: "textufil",
    nameKey: "textufil_name" as const,
    logo: "/logos/clientes/TEXTUFIL.png",
    pdf: "/carta1.pdf",
  },
  {
    key: "zonasolar",
    nameKey: "zonasolar_name" as const,
    logo: "/logos/zona-Solar.png",
    pdf: "/carta2.pdf",
  },
];

export function Recommendations() {
  const t = useTranslations("recommendations");
  const [openPdf, setOpenPdf] = useState<string | null>(null);

  useEffect(() => {
    if (!openPdf) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPdf(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openPdf]);

  return (
    <section className="pt-10 md:pt-14 pb-2 bg-white">
      <div className="container-tight flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-2">
          {t("eyebrow")}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-6">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl w-full">
          {LETTERS.map((letter) => (
            <button
              key={letter.key}
              onClick={() => setOpenPdf(letter.pdf)}
              className="group relative flex items-center gap-4 rounded-2xl border-l-4 border-l-navy-800 bg-white p-5 text-left shadow-xl shadow-slate-400/50 hover:shadow-2xl hover:shadow-navy-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <Quote className="absolute -top-2 -right-1 h-16 w-16 text-navy-800/5 rotate-12" />
              <div className="relative h-16 w-16 shrink-0 rounded-xl bg-navy-800/10 ring-1 ring-navy-800/20 p-2.5">
                <Image src={letter.logo} alt="" fill className="object-contain" />
              </div>
              <div className="relative">
                <p className="font-bold text-navy-900 text-sm leading-snug mb-1">
                  {t(letter.nameKey)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-navy-700 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
                  <FileText className="h-3.5 w-3.5" />
                  {t("cta")} &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Locked PDF viewer modal */}
      {openPdf && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setOpenPdf(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="relative w-full max-w-3xl h-[85dvh] bg-white rounded-2xl overflow-hidden shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenPdf(null)}
              aria-label={t("close")}
              className="absolute top-3 right-3 z-10 flex items-center justify-center h-9 w-9 rounded-full bg-navy-900/80 hover:bg-navy-900 text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <LockedPdfViewer src={openPdf} />
          </div>
        </div>
      )}
    </section>
  );
}
