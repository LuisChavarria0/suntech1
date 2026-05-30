import { getTranslations } from "next-intl/server";
import { Users, Zap, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";

const IconMap = { Users, Zap, TrendingUp } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;

export async function WhySuntech() {
  const t = await getTranslations("why_suntech");
  const tv = await getTranslations("values_data");

  const values = [
    { titleKey: "collab_title", descKey: "collab_desc", icon: "Users" },
    { titleKey: "efficiency_title", descKey: "efficiency_desc", icon: "Zap" },
    { titleKey: "development_title", descKey: "development_desc", icon: "TrendingUp" },
  ];

  return (
    <MouseGradientSection className="section-padding bg-navy-900" color="mixed">
      <div className="container-tight">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title")}{" "}
              <span className="gradient-text-gold">{t("title_highlight")}</span>
            </>
          }
          description={t("description")}
          theme="dark"
          className="mb-14"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map(({ titleKey, descKey, icon }) => {
            const Icon = IconMap[icon];
            return (
              <StaggerItem key={titleKey}>
                <div className="group p-8 rounded-2xl border border-white/8 hover:border-gold-500/30 bg-white/3 hover:bg-white/5 transition-all duration-300">
                  <div className="inline-flex p-4 rounded-2xl bg-gold-500/10 mb-6">
                    {Icon && <Icon className="h-7 w-7 text-gold-400" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {tv(titleKey as "collab_title" | "efficiency_title" | "development_title")}
                  </h3>
                  <p className="text-navy-300 text-sm leading-relaxed">
                    {tv(descKey as "collab_desc" | "efficiency_desc" | "development_desc")}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
          {[
            { label: t("guarantee_label"), value: t("guarantee") },
            { label: t("support_label"), value: t("support") },
            { label: t("coverage_label"), value: t("coverage") },
          ].map(({ label, value }) => (
            <div key={label} className="bg-navy-900 px-8 py-6 text-center">
              <div className="text-2xl font-extrabold text-gold-400">{value}</div>
              <div className="text-xs text-navy-400 mt-1 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </MouseGradientSection>
  );
}
