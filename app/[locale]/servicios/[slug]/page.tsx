import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, CheckCircle2, Sun, Shield, Cpu } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import { WHATSAPP_URL } from "@/lib/data/company";

const IconMap = { Sun, Shield, Cpu } as Record<string, React.ComponentType<{ className?: string }>>;

const accentMap = {
  gold: { icon: "bg-gold-500/10 text-gold-500", badge: "bg-gold-500/10 text-gold-600 border border-gold-500/30", btn: "bg-gold-500 hover:bg-gold-400" },
  electric: { icon: "bg-electric-500/10 text-electric-500", badge: "bg-electric-500/10 text-electric-600 border border-electric-500/30", btn: "bg-electric-600 hover:bg-electric-500" },
  green: { icon: "bg-eco-500/10 text-eco-500", badge: "bg-eco-500/10 text-eco-600 border border-eco-500/30", btn: "bg-eco-600 hover:bg-eco-500" },
};

const slugToKey: Record<string, "solar" | "security" | "tech"> = {
  "energia-solar": "solar",
  "seguridad-electronica": "security",
  "tecnologia": "tech",
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/servicios/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title };
}

export default async function ServicePage(
  props: PageProps<"/[locale]/servicios/[slug]">
) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("services_page");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services_data");

  const key = slugToKey[slug] ?? "solar";
  const title = ts(`${key}.title`);
  const description = ts(`${key}.description`);
  const fullDescription = ts(`${key}.fullDescription`);
  const features = [ts(`${key}.f1`), ts(`${key}.f2`), ts(`${key}.f3`), ts(`${key}.f4`), ts(`${key}.f5`), ts(`${key}.f6`)];

  const Icon = IconMap[service.icon];
  const accent = accentMap[service.accentColor];

  return (
    <>
      <MouseGradientSection className="relative pt-32 pb-14 bg-navy-800 overflow-hidden" color="white">
        <div className="container-tight relative z-10">
          <FadeIn>
            <Link href="/servicios" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {tc("back_services")}
            </Link>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <div className={`inline-flex p-4 rounded-2xl ${accent.icon}`}>
                {Icon && <Icon className="h-10 w-10" />}
              </div>
              <div>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2 ${accent.badge}`}>
                  {tc("services_label")}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{title}</h1>
              </div>
            </div>
            <p className="text-navy-300 text-lg max-w-2xl leading-relaxed">{description}</p>
          </FadeIn>
        </div>
      </MouseGradientSection>

      <section className="py-10 md:py-14 bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <FadeIn>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">{t("service_description")}</h2>
                <p className="text-slate-600 leading-relaxed text-base">{fullDescription}</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-bold text-navy-900 mb-5">{t("what_includes")}</h2>
                <ul className="space-y-4">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="h-5 w-5 text-eco-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-navy-800">
                  <Image src={service.image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 70vw" />
                </div>
              </FadeIn>
            </div>

            <div className="space-y-6">
              <FadeIn direction="right">
                <div className="card-base p-7 sticky top-24">
                  <h3 className="font-bold text-navy-900 mb-2">{t("interested")}</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{t("interested_desc")}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine flex items-center justify-center gap-2 h-14 w-full rounded-xl text-lg font-bold text-white bg-navy-800 hover:bg-navy-700 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {tc("quote_whatsapp")}
                  </a>
                  <Link
                    href="/contacto"
                    className="btn-shine flex items-center justify-center h-11 w-full mt-3 rounded-xl text-sm font-semibold text-navy-700 border-2 border-slate-200 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all duration-200"
                  >
                    {tc("contact_form")}
                  </Link>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.1}>
                <div className="card-base p-7">
                  <h3 className="font-bold text-navy-900 mb-4 text-sm uppercase tracking-wide">{t("other_services")}</h3>
                  <ul className="space-y-2">
                    {SERVICES.filter((s) => s.slug !== service.slug).map((s) => {
                      const OIcon = IconMap[s.icon];
                      const oa = accentMap[s.accentColor];
                      return (
                        <li key={s.slug}>
                          <Link href={`/servicios/${s.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className={`p-2 rounded-lg ${oa.icon}`}>{OIcon && <OIcon className="h-4 w-4" />}</div>
                            <span className="text-sm font-medium text-navy-700 group-hover:text-navy-900">{s.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
