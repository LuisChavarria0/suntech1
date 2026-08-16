"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const PROJECTS = [
  {
    key: "power-drill",
    name: "Power Drill",
    specs: "200 paneles / 4 Inversores de 20K",
    image: "/fotografias/POWER DRILL.png",
    logo: "/logos/clientes/POWER DRILL.png",
  },
  {
    key: "super-keny",
    name: "Super Keny",
    specs: "84 paneles / 4 Inversores de 10K",
    image: "/fotografias/SUPER KENY.jpg",
    logo: "/logos/clientes/SUPER KENY.png",
  },
  {
    key: "super-baratillo",
    name: "Super el Baratillo",
    specs: "290 paneles / 12 inversores de 10K",
    image: "/fotografias/SUPER BARATILLO.png",
    logo: "/logos/clientes/EL BARATILLO.png",
  },
  {
    key: "ariana-reyes",
    name: "Ariana Reyes",
    specs: "40 paneles / 1 inversor de 10K y 6K",
    image: "/fotografias/ARIANNA REYES.png",
    logo: "/logos/clientes/ARIANNA REYES.png",
  },
  {
    key: "paseo-prado",
    name: "Paseo del Prado",
    specs: "120 paneles / 3 inversores de 15K",
    image: "/fotografias/paseo-prado.jpg",
    logo: "/logos/clientes/PASEO DEL PRADO.png",
  },
];

export function PanelsShowcase() {
  const t = useTranslations("panels_showcase");
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const getMaxIndex = (track: HTMLElement) => {
    const card = track.querySelector<HTMLElement>("[data-index]");
    if (!card) return PROJECTS.length - 1;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const visibleCount = Math.max(1, Math.round((track.clientWidth + gap) / (cardWidth + gap)));
    return Math.max(0, PROJECTS.length - visibleCount);
  };

  const goTo = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const maxIndex = getMaxIndex(track);
    let next: number;
    if (direction === 1) {
      next = index >= maxIndex ? 0 : index + 1;
    } else {
      next = index <= 0 ? maxIndex : index - 1;
    }
    setIndex(next);

    const card = track.querySelector<HTMLElement>(`[data-index="${next}"]`);
    if (!card) return;

    const targetLeft =
      card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-tight">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-8">
          <span className="text-navy-800">{t("title_bold")}</span>{" "}
          <span className="text-navy-500 font-semibold">{t("title_rest")}</span>
        </h2>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.key}
              data-index={i}
              className="snap-start shrink-0 w-[78%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 78vw"
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0">
                  <Image src={project.logo} alt="" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-bold text-navy-900 text-sm leading-tight">
                    {project.name}
                    <span className="font-normal">:</span>
                  </p>
                  <p className="text-slate-500 text-xs leading-snug mt-0.5">{project.specs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => goTo(-1)}
            aria-label={t("prev")}
            className="flex items-center justify-center h-14 w-14 rounded-full bg-gold-500 hover:bg-gold-600 text-white transition-colors"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={() => goTo(1)}
            aria-label={t("next")}
            className="flex items-center justify-center h-14 w-14 rounded-full bg-gold-500 hover:bg-gold-600 text-white transition-colors"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
