import { readJson, writeJson } from "@/lib/cotizador/jsonStore";
import { normalizeProjectRecord, type ProjectRecord } from "./projectTypes";

export {
  MAX_PROJECTS,
  PROJECT_CATEGORIES,
  localizeProject,
} from "./projectTypes";
export type { Locale, LocalizedText, ProjectCategory, ProjectRecord } from "./projectTypes";

interface ProjectsFile {
  projects: ProjectRecord[];
}

const KEY = "projects";
const FILE = "projects.json";

export async function readProjectRecords(): Promise<ProjectRecord[]> {
  const data = await readJson<ProjectsFile>(KEY, FILE, { projects: [] });
  return (data.projects ?? []).map(normalizeProjectRecord);
}

export async function writeProjectRecords(projects: ProjectRecord[]): Promise<void> {
  await writeJson(KEY, FILE, { projects: projects.map(normalizeProjectRecord) });
}
