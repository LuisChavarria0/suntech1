import { redirect } from "next/navigation";
import { getSession } from "@/lib/cotizador/auth";
import { readProjectRecords, MAX_PROJECTS } from "@/lib/data/projectsStore";
import { ProjectsAdmin } from "@/components/cotizador/ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const projects = await readProjectRecords();

  return <ProjectsAdmin initialProjects={projects} max={MAX_PROJECTS} session={session} />;
}
