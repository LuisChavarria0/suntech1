import fs from "node:fs/promises";
import path from "node:path";
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

const PROJECTS_PATH = path.join(process.cwd(), "data", "projects.json");

export async function readProjectRecords(): Promise<ProjectRecord[]> {
  const raw = await fs.readFile(PROJECTS_PATH, "utf-8");
  const data = JSON.parse(raw) as ProjectsFile;
  return (data.projects ?? []).map(normalizeProjectRecord);
}

export async function writeProjectRecords(projects: ProjectRecord[]): Promise<void> {
  await fs.writeFile(
    PROJECTS_PATH,
    JSON.stringify({ projects: projects.map(normalizeProjectRecord) }, null, 2) + "\n",
    "utf-8"
  );
}
