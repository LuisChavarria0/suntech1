import type { Metadata } from "next";
import { CheckCircle2, Target, Eye, Users, Zap, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { AnimatedTimeline } from "@/components/sections/nosotros/AnimatedTimeline";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { COMPANY_INFO, VALUES } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, misión y valores de Grupo Suntech — líderes en energía solar y tecnología en El Salvador con más de 10 años de experiencia.",
};

const IconMap = { Users, Zap, TrendingUp, Target, Eye } as Record<
  string,
  React.ComponentType<{ className?: string }>
>;


export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <MouseGradientSection className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden" color="gold">
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Quiénes somos
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              Más de una década{" "}
              <span className="gradient-text-gold">transformando</span> El
              Salvador
            </h1>
            <p className="text-navy-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              {COMPANY_INFO.description}
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
                <h2 className="text-2xl font-bold text-navy-900 mb-4">
                  Misión
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  {COMPANY_INFO.mission}
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="card-base p-10 h-full border-l-4 border-l-electric-500">
                <div className="inline-flex p-3 rounded-xl bg-electric-500/10 mb-5">
                  <Eye className="h-7 w-7 text-electric-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">
                  Visión
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  {COMPANY_INFO.vision}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-slate-50">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Nuestra historia"
            title="Una trayectoria de crecimiento constante"
            className="mb-14"
          />

          <AnimatedTimeline />
        </div>
      </section>

      {/* Values */}
      <MouseGradientSection className="section-padding bg-navy-900" color="mixed">
        <div className="container-tight">
          <SectionHeader
            eyebrow="Nuestros valores"
            title={
              <>
                Los principios que{" "}
                <span className="gradient-text-gold">nos guían</span>
              </>
            }
            theme="dark"
            className="mb-14"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => {
              const Icon = IconMap[value.icon];
              return (
                <StaggerItem key={value.title}>
                  <div className="p-8 rounded-2xl border border-white/8 bg-white/3 h-full">
                    <div className="inline-flex p-4 rounded-2xl bg-gold-500/10 mb-5">
                      {Icon && <Icon className="h-6 w-6 text-gold-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-navy-300 text-sm leading-relaxed">
                      {value.description}
                    </p>
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
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
                ¿Por qué elegirnos?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-5">
                Soluciones que se adaptan,{" "}
                <span className="gradient-text-gold">resultados que duran</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                No somos solo proveedores de equipos. Somos socios estratégicos
                que acompañamos cada fase: desde el diseño hasta el soporte
                post-instalación.
              </p>

              <ul className="space-y-4">
                {[
                  "Diseño personalizado para cada cliente",
                  "Tecnología de primera línea garantizada",
                  "Instalación por técnicos certificados",
                  "Soporte post-venta continuo",
                  "Garantía en todos nuestros proyectos",
                  "Cobertura en todo El Salvador",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="h-5 w-5 text-eco-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "10+", label: "Años de experiencia", color: "gold" },
                  { value: "109+", label: "Proyectos entregados", color: "electric" },
                  { value: "3", label: "Líneas de servicio", color: "eco" },
                  { value: "100%", label: "Compromiso con calidad", color: "gold" },
                ].map(({ value, label, color }) => (
                  <div
                    key={label}
                    className="card-base p-6 text-center"
                  >
                    <div
                      className={`text-3xl font-extrabold mb-1 ${
                        color === "gold"
                          ? "text-gold-500"
                          : color === "electric"
                          ? "text-electric-500"
                          : "text-eco-500"
                      }`}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-slate-500 font-medium leading-tight">
                      {label}
                    </div>
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
