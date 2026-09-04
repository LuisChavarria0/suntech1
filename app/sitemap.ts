import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/data/services";
import { getProjectSlugs } from "@/lib/data/projects";
import { SITE_URL } from "@/lib/seo";

const BASE = SITE_URL;
const locales = ["es", "en"];

function localeRoutes(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[0]["changeFrequency"]): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`]));
  return locales.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
    alternates: { languages: { ...languages, "x-default": languages.es } },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await getProjectSlugs();
  return [
    ...localeRoutes("", 1, "weekly"),
    ...localeRoutes("/nosotros", 0.8, "monthly"),
    ...localeRoutes("/servicios", 0.9, "monthly"),
    ...localeRoutes("/proyectos", 0.9, "weekly"),
    ...localeRoutes("/contacto", 0.7, "yearly"),
    ...SERVICES.flatMap((s) => localeRoutes(`/servicios/${s.slug}`, 0.8, "monthly")),
    ...projectSlugs.flatMap((slug) => localeRoutes(`/proyectos/${slug}`, 0.6, "monthly")),
  ];
}
