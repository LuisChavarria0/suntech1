"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import type { Project } from "@/lib/types";

type Filter = "todos" | Project["category"];

const badgeVariant: Record<Project["category"], "gold" | "electric" | "eco"> = {
  solar: "gold",
  seguridad: "electric",
  tecnologia: "eco",
};

export function ProjectsGridClientIntl({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects_page");
  const tc = useTranslations("category");
  const [activeFilter, setActiveFilter] = useState<Filter>("todos");

  const filters: { key: Filter; label: string }[] = [
    { key: "todos", label: t("filter_all") },
    { key: "solar", label: t("filter_solar") },
    { key: "seguridad", label: t("filter_security") },
    { key: "tecnologia", label: t("filter_tech") },
  ];

  const filtered =
    activeFilter === "todos" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-12">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={[
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              activeFilter === f.key
                ? "bg-navy-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <StaggerItem key={project.id}>
            <Link
              href={`/proyectos/${project.slug}`}
              className="group block card-base card-hover overflow-hidden h-full"
            >
              <div className="relative h-56 overflow-hidden bg-navy-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant={badgeVariant[project.category]}>
                    {tc(project.category)}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-white/70 font-medium">{project.year}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-navy-900 mb-1.5 group-hover:text-gold-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {project.location}
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">{t("empty")}</div>
      )}
    </>
  );
}
