"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CotizadorCalculator } from "@/components/cotizador/CotizadorCalculator";
import { useCotizadorModal } from "@/components/cotizador/CotizadorModalContext";

export function CotizadorModal() {
  const t = useTranslations("cotizador");
  const { isOpen, close } = useCotizadorModal();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label={t("close")}
          className="absolute top-3 right-3 flex items-center justify-center h-9 w-9 rounded-full bg-navy-900/5 hover:bg-navy-900/10 text-navy-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 text-center pr-8">
          {t("modal_title")}
        </h2>
        <p className="text-slate-500 text-center max-w-xl mx-auto mb-8 text-sm">
          {t("modal_subtitle")}
        </p>

        <CotizadorCalculator />
      </div>
    </div>
  );
}
