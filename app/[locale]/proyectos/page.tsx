import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { ProjectsGridClientIntl } from "@/components/sections/projects/ProjectsGridClientIntl";
import { PROJECTS } from "@/lib/data/projects";

export default async function ProyectosPage() {
  const t = await getTranslations("projects_page");

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
          <ProjectsGridClientIntl projects={PROJECTS} />
        </div>
      </section>

      <CTABanner />
    </>
  );
}
