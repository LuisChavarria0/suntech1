"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { YouTubePlayer } from "@/components/ui/YouTubePlayer";

const SYSTEMS = [
  {
    key: "grid",
    icons: ["fotovoltaico1", "fotovoltaico2"],
    showPlus: false,
    videoId: "oQV1oI9ELnE",
  },
  {
    key: "isolated",
    icons: ["fotovoltaico1", "fotovoltaico4"],
    showPlus: true,
    videoId: null,
  },
  {
    key: "hybrid",
    icons: ["fotovoltaico1", "fotovoltaico4", "fotovoltaico2"],
    showPlus: true,
    videoId: "L5tT62qPMBI",
  },
] as const;

export function SystemTypes() {
  const t = useTranslations("system_types");
  const [openKey, setOpenKey] = useState<(typeof SYSTEMS)[number]["key"] | null>(null);

  useEffect(() => {
    if (!openKey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openKey]);

  const openSystem = SYSTEMS.find((s) => s.key === openKey) ?? null;

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container-tight">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-10 lg:gap-8 items-center">
          <FadeIn direction="right">
            <p className="italic text-2xl md:text-[26px] text-navy-800 leading-snug">
              {t("intro_prefix")}{" "}
              <span className="font-bold not-italic">{t("intro_highlight")}</span>
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SYSTEMS.map((system) => (
              <StaggerItem key={system.key}>
                <button
                  onClick={() => setOpenKey(system.key)}
                  className="w-full rounded-2xl bg-slate-100 border border-slate-200/60 shadow-lg shadow-slate-300/40 p-6 flex flex-col items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {system.icons.map((icon, idx) => (
                      <div key={icon + idx} className="flex items-center gap-3">
                        {idx > 0 && system.showPlus && (
                          <span className="text-navy-700 text-2xl font-bold">+</span>
                        )}
                        <Image
                          src={`/logos/${icon}.png`}
                          alt=""
                          width={72}
                          height={72}
                          className="h-14 w-14 md:h-16 md:w-16 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="italic text-center text-navy-800 font-medium leading-snug">
                    {t(`${system.key}_label`)}
                  </p>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* System info modal */}
      {openSystem && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4"
          onClick={() => setOpenKey(null)}
        >
          <div
            className={`relative w-full bg-white rounded-2xl shadow-2xl p-8 ${
              openSystem.videoId ? "max-w-2xl" : "max-w-lg"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenKey(null)}
              aria-label={t("close")}
              className="absolute top-3 right-3 flex items-center justify-center h-9 w-9 rounded-full bg-navy-900/5 hover:bg-navy-900/10 text-navy-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className={
                openSystem.videoId
                  ? "grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-6 items-start"
                  : ""
              }
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  {openSystem.icons.map((icon, idx) => (
                    <div key={icon + idx} className="flex items-center gap-3">
                      {idx > 0 && openSystem.showPlus && (
                        <span className="text-navy-700 text-xl font-bold">+</span>
                      )}
                      <Image
                        src={`/logos/${icon}.png`}
                        alt=""
                        width={56}
                        height={56}
                        className="h-11 w-11 object-contain"
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  {t(`${openSystem.key}_label`)}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(`${openSystem.key}_desc`)}
                </p>
              </div>

              {openSystem.videoId && (
                <div className="mt-1">
                  <YouTubePlayer videoId={openSystem.videoId} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
