import { NextResponse } from "next/server";
import { getSession } from "@/lib/cotizador/auth";
import {
  readTestimonialVideos,
  writeTestimonialVideos,
  MAX_TESTIMONIAL_VIDEOS,
  type TestimonialVideo,
} from "@/lib/data/testimonialVideos";
import { appendAuditLog } from "@/lib/cotizador/auditLog";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const videos = await readTestimonialVideos();
  return NextResponse.json({ videos, max: MAX_TESTIMONIAL_VIDEOS });
}

function isLocalizedText(v: unknown): boolean {
  if (v === undefined) return true;
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return (t.es === undefined || typeof t.es === "string") && (t.en === undefined || typeof t.en === "string");
}

function validate(videos: unknown): videos is TestimonialVideo[] {
  if (!Array.isArray(videos)) return false;
  const ids = new Set<string>();
  for (const v of videos) {
    if (!v || typeof v !== "object") return false;
    const r = v as Record<string, unknown>;
    if (typeof r.id !== "string" || !r.id) return false;
    if (ids.has(r.id)) return false;
    ids.add(r.id);
    if (r.provider !== "youtube" && r.provider !== "vimeo") return false;
    if (typeof r.embedId !== "string" || !r.embedId) return false;
    if (typeof r.url !== "string" || !r.url) return false;
    if (r.isVertical !== undefined && typeof r.isVertical !== "boolean") return false;
    if (!isLocalizedText(r.title)) return false;
    if (!isLocalizedText(r.description)) return false;
    if (typeof r.addedAt !== "string" || !r.addedAt) return false;
  }
  return true;
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const videos = body?.videos;

  if (!validate(videos)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (videos.length > MAX_TESTIMONIAL_VIDEOS) {
    return NextResponse.json(
      { error: `Máximo ${MAX_TESTIMONIAL_VIDEOS} videos.` },
      { status: 400 }
    );
  }

  try {
    const previous = await readTestimonialVideos();
    await writeTestimonialVideos(videos);

    await appendAuditLog({
      username: session.username,
      action: "update_testimonial_videos",
      details: `Actualizó videos de testimonios (${previous.length} → ${videos.length})`,
    });
  } catch (err) {
    console.error("Failed to persist testimonial videos", err);
    return NextResponse.json({ error: "No se pudo guardar en el servidor." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
