import type { Project } from "@/lib/types";

export type Locale = "es" | "en";

export const MAX_PROJECTS = 20;
export const PROJECT_CATEGORIES = ["solar", "seguridad", "tecnologia"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface LocalizedText {
  es: string;
  en: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  category: ProjectCategory;
  location: string;
  year: number;
  featured: boolean;
  image: string;
  gallery: string[];
  title: LocalizedText;
  description: LocalizedText;
}

export function normalizeProjectRecord(record: ProjectRecord): ProjectRecord {
  return {
    ...record,
    gallery: Array.isArray(record.gallery) ? record.gallery.filter(Boolean) : [],
    featured: Boolean(record.featured),
    year: Number(record.year) || new Date().getFullYear(),
    title: { es: record.title?.es ?? "", en: record.title?.en ?? "" },
    description: { es: record.description?.es ?? "", en: record.description?.en ?? "" },
  };
}

export function localizeProject(record: ProjectRecord, locale: Locale): Project {
  const pick = (t: LocalizedText) => t[locale] || t.es || t.en || "";
  return {
    id: record.id,
    slug: record.slug,
    title: pick(record.title),
    description: pick(record.description),
    category: record.category,
    location: record.location,
    image: record.image,
    gallery: record.gallery,
    featured: record.featured,
    year: record.year,
  };
}
