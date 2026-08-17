import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { CTABanner } from "@/components/sections/home/CTABanner";
import { MouseGradientSection } from "@/components/ui/MouseGradientSection";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { PROJECTS, getProjectBySlug } from "@/lib/data/projects";
import { WHATSAPP_URL } from "@/lib/data/company";
import type { Project } from "@/lib/types";

const badgeVariant: Record<Project["category"], "gold" | "electric" | "eco"> = {
  solar: "gold", seguridad: "electric", tecnologia: "eco",
};

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/proyectos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage(
  props: PageProps<"/[locale]/proyectos/[slug]">
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations("projects_page");
  const tc = await getTranslations("common");
  const tcat = await getTranslations("category");

  const related = PROJECTS.filter(
    (p) => p.category === project.category && p.slug !== project.slug
  ).slice(0, 3);

  return (
    <>
      <MouseGradientSection
        className="relative pt-32 pb-14 bg-navy-800 overflow-hidden"
        color="white"
      >
        <div className="container-tight relative z-10">
          <FadeIn>
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tc("back_projects")}
            </Link>
            <Badge variant={badgeVariant[project.category]} className="mb-4">
              {tcat(`${project.category}_full` as `${string}_full`)}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-navy-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-500" />
                {project.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold-500" />
                {project.year}
              </div>
            </div>
          </FadeIn>
        </div>
      </MouseGradientSection>

      <section className="py-10 md:py-14 bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <FadeIn>
                <ImageGallery
                  images={[project.image, ...(project.gallery ?? [])]}
                  title={project.title}
                />
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">{t("about_project")}</h2>
                <p className="text-slate-600 leading-relaxed text-base">{project.description}</p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: tc("category"), value: tcat(`${project.category}_full` as `${string}_full`) },
                    { label: tc("location"), value: project.location },
                    { label: tc("year"), value: String(project.year) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</div>
                      <div className="font-semibold text-navy-900">{value}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <div className="space-y-6">
              <FadeIn direction="right">
                <div className="card-base p-7 sticky top-24">
                  <h3 className="font-bold text-navy-900 mb-2">{t("similar_project")}</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{t("similar_desc")}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine flex items-center justify-center gap-2 h-14 w-full rounded-xl text-lg font-bold text-white bg-navy-800 hover:bg-navy-700 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {tc("quote_whatsapp")}
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-navy-900 mb-8">{t("related")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/proyectos/${p.slug}`}
                    className="group card-base card-hover overflow-hidden"
                  >
                    <div className="relative h-44 overflow-hidden bg-navy-800">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-navy-900 text-sm group-hover:text-gold-600 transition-colors mb-1">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="h-3 w-3" />
                        {p.location}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
