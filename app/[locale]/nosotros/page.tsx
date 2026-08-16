import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, Target, Eye, Users, Zap, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { AnimatedTimeline } from "@/components/sections/nosotros/AnimatedTimeline";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Nosotros" };
}

const IconMap = { Users, Zap, TrendingUp, Target, Eye } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;

export default async function NosotrosPage() {
  const t = await getTranslations("about");
  const tv = await getTranslations("values_data");

  const values = [
    { title: tv("collab_title"), desc: tv("collab_desc"), icon: "Users" },
    { title: tv("efficiency_title"), desc: tv("efficiency_desc"), icon: "Zap" },
    { title: tv("development_title"), desc: tv("development_desc"), icon: "TrendingUp" },
  ];

  const diffs = [
    t("diff1"), t("diff2"), t("diff3"),
    t("diff4"), t("diff5"), t("diff6"),
  ];

  const diffStats = [
    { value: "10+", label: t("stat1_label"), color: "gold" },
    { value: "109+", label: t("stat2_label"), color: "electric" },
    { value: "3", label: t("stat3_label"), color: "eco" },
    { value: "100%", label: t("stat4_label"), color: "gold" },
  ];

  return (
    <>
      <MouseGradientSection className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden" color="gold">
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">{t("eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              {t("title")}{" "}
              <span className="gradient-text-gold">{t("title_highlight")}</span>{" "}
              {t("title_end")}
            </h1>
            <p className="text-navy-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              {t("description")}
            </p>
          </FadeIn>
        </div>
      </MouseGradientSection>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="left">
              <div className="card-base p-10 h-full border-l-4 border-l-gold-500">
                <div className="inline-flex p-3 rounded-xl bg-gold-500/10 mb-5">
                  <Target className="h-7 w-7 text-gold-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">{t("mission_title")}</h2>
                <p className="text-slate-500 leading-relaxed">{t("mission")}</p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="card-base p-10 h-full border-l-4 border-l-electric-500">
                <div className="inline-flex p-3 rounded-xl bg-electric-500/10 mb-5">
                  <Eye className="h-7 w-7 text-electric-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">{t("vision_title")}</h2>
                <p className="text-slate-500 leading-relaxed">{t("vision")}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-slate-50">
        <div className="container-tight">
          <SectionHeader
            eyebrow={t("timeline_eyebrow")}
            title={t("timeline_title")}
            className="mb-14"
          />
          <AnimatedTimeline />
        </div>
      </section>

      {/* Values */}
      <MouseGradientSection className="section-padding bg-navy-900" color="mixed">
        <div className="container-tight">
          <SectionHeader
            eyebrow={t("values_eyebrow")}
            title={<>{t("values_title")} <span className="gradient-text-gold">{t("values_highlight")}</span></>}
            theme="dark"
            className="mb-14"
          />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = IconMap[v.icon];
              return (
                <StaggerItem key={v.title}>
                  <div className="p-8 rounded-2xl border border-white/8 bg-white/3 h-full">
                    <div className="inline-flex p-4 rounded-2xl bg-gold-500/10 mb-5">
                      {Icon && <Icon className="h-6 w-6 text-gold-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                    <p className="text-navy-300 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </MouseGradientSection>

      {/* Differentiators */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">{t("diff_eyebrow")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-5">
                {t("diff_title")}{" "}
                <span className="gradient-text-gold">{t("diff_highlight")}</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">{t("diff_description")}</p>
              <ul className="space-y-4">
                {diffs.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-eco-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn direction="right">
              <div className="grid grid-cols-2 gap-4">
                {diffStats.map(({ value, label, color }) => (
                  <div key={label} className="card-base p-6 text-center">
                    <div className={`text-3xl font-extrabold mb-1 ${
                      color === "gold" ? "text-gold-500" : color === "electric" ? "text-electric-500" : "text-eco-500"
                    }`}>{value}</div>
                    <div className="text-xs text-slate-500 font-medium leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
