import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/sections/contacto/ContactForm";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { CONTACT, WHATSAPP_URL } from "@/lib/data/company";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Contacto" };
}

export default async function ContactoPage() {
  const t = await getTranslations("contact_page");

  const contactMethods = [
    { icon: MessageCircle, label: t("whatsapp_label"), value: CONTACT.whatsapp, href: WHATSAPP_URL, desc: t("whatsapp_desc"), external: true, color: "eco" },
    { icon: Phone, label: t("phone_label"), value: CONTACT.phone, href: `tel:${CONTACT.phone}`, desc: t("phone_desc"), external: false, color: "electric" },
    { icon: Mail, label: t("email_label"), value: CONTACT.email, href: `mailto:${CONTACT.email}`, desc: t("email_desc"), external: false, color: "gold" },
    { icon: MapPin, label: t("office_label"), value: CONTACT.address, href: "#", desc: t("office_desc"), external: false, color: "navy" },
  ];

  const colorMap: Record<string, string> = {
    eco: "bg-eco-500/10 text-eco-500",
    electric: "bg-electric-500/10 text-electric-500",
    gold: "bg-gold-500/10 text-gold-500",
    navy: "bg-navy-800 text-navy-300",
  };

  return (
    <>
      <MouseGradientSection className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden" color="gold">
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

      <section className="section-padding bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <FadeIn direction="left">
              <h2 className="text-2xl font-bold text-navy-900 mb-8">{t("contact_methods")}</h2>
              <div className="space-y-4 mb-10">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 group">
                      <div className={`p-3 rounded-xl shrink-0 ${colorMap[method.color]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{method.label}</div>
                        <div className="font-semibold text-navy-900 text-sm break-words group-hover:text-gold-600 transition-colors">{method.value}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{method.desc}</div>
                      </div>
                    </div>
                  );
                  if (method.href === "#") return <div key={method.label}>{content}</div>;
                  return (
                    <a key={method.label} href={method.href} target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined}>
                      {content}
                    </a>
                  );
                })}
              </div>

              <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gold-500/10"><Clock className="h-5 w-5 text-gold-400" /></div>
                  <h3 className="font-semibold text-white">{t("hours_title")}</h3>
                </div>
                <ul className="space-y-2 text-sm text-navy-400">
                  <li className="flex justify-between"><span>{t("hours_weekdays")}</span><span className="text-white">{t("hours_weekdays_time")}</span></li>
                  <li className="flex justify-between"><span>{t("hours_saturday")}</span><span className="text-white">{t("hours_saturday_time")}</span></li>
                  <li className="flex justify-between"><span>{t("hours_weekend")}</span><span>{t("hours_weekend_time")}</span></li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="card-base p-8 md:p-10">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">{t("form_title")}</h2>
                <p className="text-slate-500 text-sm mb-8">{t("form_subtitle")}</p>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container-tight">
          <FadeIn>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">{t("map_title")}</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-80">
              <iframe
                title={t("map_iframe_title")}
                src={CONTACT.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={CONTACT.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 hover:text-gold-600 transition-colors w-fit"
            >
              <MapPin className="h-3.5 w-3.5 text-gold-500" />
              {CONTACT.address}
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
