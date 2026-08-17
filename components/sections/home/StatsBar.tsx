import { getTranslations } from "next-intl/server";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";

export async function StatsBar() {
  const t = await getTranslations("stats");

  const stats = [
    { value: 10, suffix: "+", label: t("years") },
    { value: 109, suffix: "+", label: t("projects") },
    { value: 3, suffix: "", label: t("services") },
  ];

  return (
    <MouseGradientSection className="bg-navy-800 py-14 md:py-16" color="gold" blobSize={380}>
      <div className="container-tight">
        <div className="grid grid-cols-3 gap-8 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1800} />
              </div>
              <div className="mt-3 text-lg md:text-xl text-navy-400 font-medium tracking-wide">
                {stat.label}
              </div>
              <div className="mt-4 mx-auto w-12 h-1.5 bg-gold-500 rounded-full opacity-80 group-hover:opacity-100 group-hover:w-16 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </MouseGradientSection>
  );
}
