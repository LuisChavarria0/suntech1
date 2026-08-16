"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function SelfConsumption() {
  const t = useTranslations("self_consumption");
  const [openKey, setOpenKey] = useState<"homes" | "business">("homes");

  const items = [
    { key: "homes" as const, title: t("homes_title"), desc: t("homes_desc") },
    { key: "business" as const, title: t("business_title"), desc: t("business_desc") },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* Text + accordion */}
        <div className="bg-navy-800 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
            {t("title")} {t("title_highlight")}
          </h2>

          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const isOpen = openKey === item.key;
              return (
                <div
                  key={item.key}
                  className="rounded-2xl border border-white/25 px-6 py-5 transition-colors"
                >
                  <button
                    onClick={() => setOpenKey(item.key)}
                    className="flex items-center justify-between gap-4 w-full text-left"
                  >
                    <span className="text-lg font-bold text-white leading-snug">
                      {item.title}
                    </span>
                    <span className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full border border-white/40 text-white">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  {isOpen && item.desc && (
                    <p className="mt-4 text-navy-300 text-sm leading-relaxed">{item.desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[300px] md:min-h-0 overflow-hidden">
          <Image
            src="/fotografias/paneles-soluciones.png"
            alt={t("homes_title")}
            fill
            className="object-cover object-[50%_75%] scale-125"
          />
        </div>
      </div>
    </section>
  );
}
