import { getTranslations } from "next-intl/server";
import { ArrowRight, Sun, Shield, Cpu, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/lib/data/services";

const IconMap = { Sun, Shield, Cpu } as Record<string, React.ComponentType<{ className?: string }>>;

const accentClasses = {
  gold: { icon: "bg-gold-500/10 text-gold-500", border: "border-gold-500/20", hover: "hover:border-gold-500/40", arrow: "text-gold-500" },
  electric: { icon: "bg-electric-500/10 text-electric-500", border: "border-electric-500/20", hover: "hover:border-electric-500/40", arrow: "text-electric-500" },
  green: { icon: "bg-eco-500/10 text-eco-500", border: "border-eco-500/20", hover: "hover:border-eco-500/40", arrow: "text-eco-500" },
};

const slugToKey: Record<string, "solar" | "security" | "tech"> = {
  "energia-solar": "solar",
  "seguridad-electronica": "security",
  "tecnologia": "tech",
};

export async function Services() {
  const t = await getTranslations("services_section");
  const ts = await getTranslations("services_data");

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-tight">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={<>{t("title")} <span className="gradient-text-gold">{t("title_highlight")}</span></>}
          description={t("description")}
          className="mb-14"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service) => {
            const Icon = IconMap[service.icon];
            const accent = accentClasses[service.accentColor];
            const key = slugToKey[service.slug] ?? "solar";
            const title = ts(`${key}.title`);
            const description = ts(`${key}.description`);
            const features = [ts(`${key}.f1`), ts(`${key}.f2`), ts(`${key}.f3`)];

            return (
              <StaggerItem key={service.id}>
                <div className={`card-base card-hover p-8 flex flex-col h-full border-2 ${accent.border} ${accent.hover}`}>
                  <div className={`inline-flex p-4 rounded-2xl mb-6 self-start ${accent.icon}`}>
                    {Icon && <Icon className="h-7 w-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{description}</p>
                  <ul className="space-y-2 mb-8">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-eco-500 shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/servicios/${service.slug}`}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent.arrow} hover:gap-3 transition-all duration-200 mt-auto`}
                  >
                    {t("see_more")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
