import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/sections/contacto/ContactForm";
import { CONTACT, WHATSAPP_URL } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para cotizar tu proyecto de energía solar, seguridad electrónica o tecnología. Estamos en El Salvador — respuesta en menos de 24 horas.",
};

const contactMethods = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT.whatsapp,
    href: WHATSAPP_URL,
    description: "Respuesta inmediata",
    external: true,
    color: "eco",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone}`,
    description: "Lunes a viernes, 8am – 5pm",
    external: false,
    color: "electric",
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    description: "Respuesta en menos de 24 horas",
    external: false,
    color: "gold",
  },
  {
    icon: MapPin,
    label: "Oficina",
    value: CONTACT.address,
    href: "#",
    description: "Visítanos en persona",
    external: false,
    color: "navy",
  },
];

const colorMap = {
  eco: "bg-eco-500/10 text-eco-500",
  electric: "bg-electric-500/10 text-electric-500",
  gold: "bg-gold-500/10 text-gold-500",
  navy: "bg-navy-800 text-navy-300",
};

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden">
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Estamos aquí
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              Hablemos sobre{" "}
              <span className="gradient-text-gold">tu proyecto</span>
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl leading-relaxed">
              ¿Tienes un proyecto en mente? Cuéntanos tu idea y nuestro equipo
              te dará una propuesta personalizada sin costo.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact section */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact info */}
            <FadeIn direction="left">
              <h2 className="text-2xl font-bold text-navy-900 mb-8">
                Medios de contacto
              </h2>

              <div className="space-y-4 mb-10">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const colorClass =
                    colorMap[method.color as keyof typeof colorMap];
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 group">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                          {method.label}
                        </div>
                        <div className="font-semibold text-navy-900 text-sm break-words group-hover:text-gold-600 transition-colors">
                          {method.value}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  );

                  if (method.href === "#") return <div key={method.label}>{content}</div>;

                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      target={method.external ? "_blank" : undefined}
                      rel={method.external ? "noopener noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  );
                })}
              </div>

              {/* Hours */}
              <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gold-500/10">
                    <Clock className="h-5 w-5 text-gold-400" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Horario de atención
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-navy-400">
                  <li className="flex justify-between">
                    <span>Lunes – Viernes</span>
                    <span className="text-white">8:00 AM – 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábado</span>
                    <span className="text-white">8:00 AM – 12:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Domingo</span>
                    <span>Cerrado</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            {/* WhatsApp form */}
            <FadeIn direction="right">
              <div className="card-base p-8 md:p-10">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">
                  Envíanos un mensaje
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                  Completa el formulario y te contactaremos a la brevedad.
                </p>

                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-slate-50 py-16">
        <div className="container-tight">
          <FadeIn>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">
              Dónde encontrarnos
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-80">
              <iframe
                title="Ubicación Grupo Suntech — Periplaza Apopa"
                src="https://maps.google.com/maps?q=Periplaza+Apopa+San+Salvador+El+Salvador&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold-500" />
              {CONTACT.address}
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
