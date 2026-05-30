import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sun, Shield, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { SERVICES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Energía solar fotovoltaica, seguridad electrónica y tecnología empresarial. Soluciones integrales a la medida para empresas y hogares en El Salvador.",
};

const IconMap = { Sun, Shield, Cpu } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;

const accentMap = {
  gold: {
    icon: "bg-gold-500/10 text-gold-500",
    border: "border-gold-500/20",
    text: "text-gold-600",
  },
  electric: {
    icon: "bg-electric-500/10 text-electric-500",
    border: "border-electric-500/20",
    text: "text-electric-600",
  },
  green: {
    icon: "bg-eco-500/10 text-eco-500",
    border: "border-eco-500/20",
    text: "text-eco-600",
  },
};

const process = [
  {
    step: "01",
    title: "Diagnóstico",
    description:
      "Visitamos tu sitio, analizamos tus necesidades y evaluamos la viabilidad técnica sin ningún compromiso.",
  },
  {
    step: "02",
    title: "Propuesta",
    description:
      "Diseñamos una solución personalizada con especificaciones técnicas, cronograma y presupuesto detallado.",
  },
  {
    step: "03",
    title: "Instalación",
    description:
      "Nuestros técnicos certificados ejecutan el proyecto con los más altos estándares de calidad.",
  },
  {
    step: "04",
    title: "Soporte",
    description:
      "Brindamos soporte post-venta continuo, mantenimiento preventivo y monitoreo del sistema.",
  },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden">
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Lo que hacemos
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              Servicios diseñados{" "}
              <span className="gradient-text-gold">para tu realidad</span>
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl leading-relaxed">
              Tres líneas estratégicas — energía, seguridad y tecnología — que
              trabajamos de forma integrada para ofrecerte la solución más
              completa y eficiente.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services detail */}
      <section className="section-padding bg-white">
        <div className="container-tight">
          <StaggerContainer className="space-y-16">
            {SERVICES.map((service, i) => {
              const Icon = IconMap[service.icon];
              const accent = accentMap[service.accentColor];
              const isEven = i % 2 === 0;

              return (
                <StaggerItem key={service.id}>
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                      !isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Text */}
                    <div className={!isEven ? "lg:order-2" : ""}>
                      <div
                        className={`inline-flex p-4 rounded-2xl mb-5 ${accent.icon}`}
                      >
                        {Icon && <Icon className="h-8 w-8" />}
                      </div>
                      <h2 className="text-3xl font-bold text-navy-900 mb-4">
                        {service.title}
                      </h2>
                      <p className="text-slate-500 leading-relaxed mb-6">
                        {service.fullDescription}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <CheckCircle2 className="h-5 w-5 text-eco-500 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/servicios/${service.slug}`}
                        className={`inline-flex items-center gap-2 text-sm font-semibold ${accent.text} hover:gap-4 transition-all duration-200`}
                      >
                        Ver más sobre {service.shortTitle}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Visual card */}
                    <div className={!isEven ? "lg:order-1" : ""}>
                      <div
                        className={`rounded-3xl p-10 border-2 ${accent.border} bg-gradient-to-br from-slate-50 to-white h-64 flex items-center justify-center`}
                      >
                        <div className="text-center">
                          <div className={`inline-flex p-6 rounded-3xl mb-4 ${accent.icon}`}>
                            {Icon && <Icon className="h-14 w-14" />}
                          </div>
                          <div className="text-lg font-bold text-navy-900">
                            {service.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {i < SERVICES.length - 1 && (
                    <div className="border-b border-slate-100 mt-16" />
                  )}
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-slate-50">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Nuestro proceso"
            title="De la idea al resultado en 4 pasos"
            description="Un proceso claro y transparente que garantiza resultados desde el primer día."
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="card-base p-7 h-full">
                  <div className="text-4xl font-extrabold text-gold-500/30 mb-4 leading-none">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
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
