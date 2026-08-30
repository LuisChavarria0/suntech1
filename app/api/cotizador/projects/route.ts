import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import {
  readProjectRecords,
  writeProjectRecords,
  MAX_PROJECTS,
  PROJECT_CATEGORIES,
  type ProjectRecord,
} from "@/lib/data/projectsStore";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const projects = await readProjectRecords();
  return NextResponse.json({ projects, max: MAX_PROJECTS });
}

function validate(projects: unknown): projects is ProjectRecord[] {
  if (!Array.isArray(projects)) return false;
  const slugs = new Set<string>();
  for (const p of projects) {
    if (!p || typeof p !== "object") return false;
    const r = p as Record<string, unknown>;
    if (typeof r.id !== "string" || !r.id) return false;
    if (typeof r.slug !== "string" || !/^[a-z0-9-]+$/.test(r.slug)) return false;
    if (slugs.has(r.slug)) return false;
    slugs.add(r.slug);
    if (!PROJECT_CATEGORIES.includes(r.category as (typeof PROJECT_CATEGORIES)[number])) return false;
    if (typeof r.location !== "string") return false;
    if (typeof r.image !== "string" || !r.image) return false;
    if (r.gallery !== undefined && (!Array.isArray(r.gallery) || r.gallery.length > 3)) return false;
    const t = r.title as Record<string, unknown> | undefined;
    const d = r.description as Record<string, unknown> | undefined;
    if (!t || typeof t.es !== "string" || typeof t.en !== "string") return false;
    if (!d || typeof d.es !== "string" || typeof d.en !== "string") return false;
  }
  return true;
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const projects = body?.projects;

  if (!validate(projects)) {
    return NextResponse.json(
      { error: "Datos inválidos. Revisa los slugs (solo minúsculas, números y guiones) y que no se repitan." },
      { status: 400 }
    );
  }

  if (projects.length > MAX_PROJECTS) {
    return NextResponse.json(
      { error: `Máximo ${MAX_PROJECTS} proyectos.` },
      { status: 400 }
    );
  }

  try {
    const previous = await readProjectRecords();
    await writeProjectRecords(projects);

    await appendAuditLog({
      username: session.username,
      action: "update_projects",
      details: `Actualizó proyectos (${previous.length} → ${projects.length})`,
    });
  } catch (err) {
    console.error("Failed to persist projects", err);
    return NextResponse.json(
      { error: "No se pudo guardar en el servidor." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
