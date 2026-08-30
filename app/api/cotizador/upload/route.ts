import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put, del } from "@vercel/blob";
import { getSession } from "@/lib/cotizador/auth";
import { BLOB_TOKEN, hasBlob } from "@/lib/cotizador/blobStore";

export const runtime = "nodejs";

// Images are compressed to WebP in the browser before upload, so they arrive
// small (well under Vercel's 4.5 MB server-upload limit). This route only stores
// the already-processed file.
const MAX_BYTES = 8 * 1024 * 1024;
const LOCAL_DIR = path.join(process.cwd(), "public", "uploads", "proyectos");
const LOCAL_PREFIX = "/uploads/proyectos";

function randomName() {
  return `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.webp`;
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const target = new URL(request.url).searchParams.get("path") ?? "";

  try {
    if (/^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//.test(target)) {
      if (hasBlob()) await del(target, { token: BLOB_TOKEN });
    } else if (/^\/uploads\/proyectos\/[a-z0-9-]+\.webp$/.test(target)) {
      await fs.unlink(path.join(process.cwd(), "public", target)).catch(() => {});
    } else {
      return NextResponse.json({ error: "Ruta no permitida" }, { status: 400 });
    }
  } catch (err) {
    console.error("Failed to delete image", err);
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ninguna imagen." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen es demasiado grande." }, { status: 400 });
  }

  try {
    const name = randomName();

    if (hasBlob()) {
      const blob = await put(`proyectos/${name}`, file, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "image/webp",
      });
      return NextResponse.json({ path: blob.url, bytes: file.size });
    }

    // Local dev fallback: write into public/.
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ path: `${LOCAL_PREFIX}/${name}`, bytes: file.size });
  } catch (err) {
    console.error("Image upload failed", err);
    return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
  }
}
