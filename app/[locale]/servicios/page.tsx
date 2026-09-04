import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, Sun, Shield, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/lib/data/services";
import { pageMetadata, type Locale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("services_page");
  return pageMetadata({
    locale,
    path: "/servicios",
    title: `${t("title")} ${t("title_highlight")}`,
    description: t("description"),
  });
}

const IconMap = { Sun, Shield, Cpu } as Record<string, React.ComponentType<{ className?: string }>>;

const accentMap = {
  gold: { icon: "bg-gold-500/10 text-gold-500", border: "border-gold-500/20", text: "text-gold-600" },
  electric: { icon: "bg-electric-500/10 text-electric-500", border: "border-electric-500/20", text: "text-electric-600" },
  green: { icon: "bg-eco-500/10 text-eco-500", border: "border-eco-500/20", text: "text-eco-600" },
};

export default async function ServiciosPage() {
  const t = await getTranslations("services_page");
  const ts = await getTranslations("services_data");

  const translatedServices = [
    { ...SERVICES[0], title: ts("solar.title"), description: ts("solar.fullDescription"), features: [ts("solar.f1"), ts("solar.f2"), ts("solar.f3"), ts("solar.f4"), ts("solar.f5"), ts("solar.f6")] },
    { ...SERVICES[1], title: ts("security.title"), description: ts("security.fullDescription"), features: [ts("security.f1"), ts("security.f2"), ts("security.f3"), ts("security.f4"), ts("security.f5"), ts("security.f6")] },
    { ...SERVICES[2], title: ts("tech.title"), description: ts("tech.fullDescription"), features: [ts("tech.f1"), ts("tech.f2"), ts("tech.f3"), ts("tech.f4"), ts("tech.f5"), ts("tech.f6")] },
  ];

  const process = [
    { step: "01", title: t("step1_title"), desc: t("step1_desc") },
    { step: "02", title: t("step2_title"), desc: t("step2_desc") },
    { step: "03", title: t("step3_title"), desc: t("step3_desc") },
    { step: "04", title: t("step4_title"), desc: t("step4_desc") },
  ];

  return (
    <>
      <MouseGradientSection className="relative pt-32 pb-14 bg-navy-800 overflow-hidden" color="white">
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">{t("eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              {t("title")} <span className="gradient-text-gold">{t("title_highlight")}</span>
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl leading-relaxed">{t("description")}</p>
          </FadeIn>
        </div>
      </MouseGradientSection>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-tight">
          <StaggerContainer className="space-y-16">
            {translatedServices.map((service, i) => {
              const Icon = IconMap[service.icon];
              const accent = accentMap[service.accentColor];
              const isEven = i % 2 === 0;
              return (
                <StaggerItem key={service.id}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}>
                    <div className={!isEven ? "lg:order-2" : ""}>
                      <div className={`inline-flex p-4 rounded-2xl mb-5 ${accent.icon}`}>
                        {Icon && <Icon className="h-8 w-8" />}
                      </div>
                      <h2 className="text-3xl font-bold text-navy-900 mb-4">{service.title}</h2>
                      <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle2 className="h-5 w-5 text-eco-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/servicios/${service.slug}`}
                        className={`inline-flex items-center gap-2 text-sm font-semibold ${accent.text} hover:gap-4 transition-all duration-200`}
                      >
                        {t("see_more_prefix")} {service.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className={!isEven ? "lg:order-1" : ""}>
                      <div className={`rounded-3xl p-10 border-2 ${accent.border} bg-gradient-to-br from-slate-50 to-white h-64 flex items-center justify-center`}>
                        <div className="text-center">
                          <div className={`inline-flex p-6 rounded-3xl mb-4 ${accent.icon}`}>
                            {Icon && <Icon className="h-14 w-14" />}
                          </div>
                          <div className="text-lg font-bold text-navy-900">{service.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < translatedServices.length - 1 && <div className="border-b border-slate-100 mt-16" />}
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-tight">
          <SectionHeader
            eyebrow={t("process_eyebrow")}
            title={t("process_title")}
            description={t("process_description")}
            className="mb-14"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="card-base p-7 h-full">
                  <div className="text-4xl font-extrabold text-gold-500/30 mb-4 leading-none">{step.step}</div>
                  <h3 className="font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
