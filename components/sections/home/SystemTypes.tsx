import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";

const SYSTEMS = [
  { key: "grid", icons: ["fotovoltaico1", "fotovoltaico2"], showPlus: false },
  { key: "isolated", icons: ["fotovoltaico1", "fotovoltaico4"], showPlus: true },
  { key: "hybrid", icons: ["fotovoltaico1", "fotovoltaico4", "fotovoltaico2"], showPlus: true },
] as const;

export async function SystemTypes() {
  const t = await getTranslations("system_types");

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
            {SYSTEMS.map((system, i) => (
              <StaggerItem key={system.key}>
                <div className="rounded-2xl bg-slate-100 border border-slate-200/60 shadow-lg shadow-slate-300/40 p-6 flex flex-col items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
