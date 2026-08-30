import type { Project } from "@/lib/types";
import { readProjectRecords, localizeProject, type Locale } from "./projectsStore";

export async function getProjects(locale: Locale): Promise<Project[]> {
  const records = await readProjectRecords();
  return records.map((r) => localizeProject(r, locale));
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  return (await getProjects(locale)).filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<Project | undefined> {
  return (await getProjects(locale)).find((p) => p.slug === slug);
}

export async function getProjectsByCategory(
  category: Project["category"],
  locale: Locale
): Promise<Project[]> {
  return (await getProjects(locale)).filter((p) => p.category === category);
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await readProjectRecords()).map((r) => r.slug);
}
