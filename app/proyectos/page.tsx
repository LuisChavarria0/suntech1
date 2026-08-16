import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { ProjectsGrid } from "@/components/sections/proyectos/ProjectsGrid";

export default function ProyectosPage() {
  return (
    <>
      {/* Hero */}
      <MouseGradientSection
        className="relative pt-32 pb-20 bg-navy-900 hero-gradient overflow-hidden"
        color="gold"
      >
        <div className="container-tight relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Portafolio
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
              Proyectos que demuestran{" "}
              <span className="gradient-text-gold">nuestra experiencia</span>
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl leading-relaxed">
              Más de 109 proyectos completados en todo El Salvador. Energía
              solar, seguridad electrónica y tecnología al servicio de
              comunidades y empresas.
            </p>
          </FadeIn>
        </div>
      </MouseGradientSection>

      {/* Projects grid with filters (Client Component) */}
      <ProjectsGrid />

      <CTABanner />
    </>
  );
}
