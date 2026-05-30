import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";
import { getFeaturedProjects } from "@/lib/data/projects";
import type { Project } from "@/lib/types";

const badgeVariant: Record<Project["category"], "gold" | "electric" | "eco"> = {
  solar: "gold", seguridad: "electric", tecnologia: "eco",
};

export async function FeaturedProjects() {
  const t = await getTranslations("projects_section");
  const tc = await getTranslations("category");
  const projects = getFeaturedProjects();

  return (
    <section className="section-padding bg-white">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={<>{t("title")} <span className="gradient-text-gold">{t("title_highlight")}</span></>}
            description={t("description")}
            align="left"
            className="mb-0 max-w-xl"
          />
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors whitespace-nowrap self-end md:self-auto"
          >
            {t("see_all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <Link href={`/proyectos/${project.slug}`} className="group block card-base card-hover overflow-hidden h-full">
                <div className="relative h-52 overflow-hidden bg-navy-800">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={badgeVariant[project.category]}>
                      {tc(project.category)}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy-900 text-base mb-1.5 group-hover:text-gold-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {project.location}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
