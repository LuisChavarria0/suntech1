import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { getSession } from "@/lib/cotizador/auth";

export const runtime = "nodejs";

const MAX_BYTES = 30 * 1024 * 1024; // 30 MB raw upload
const MAX_WIDTH = 1600; // px — plenty for full-bleed project images
const WEBP_QUALITY = 78;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "proyectos");
const PUBLIC_PREFIX = "/uploads/proyectos";

const ACCEPTED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
  "image/heic",
  "image/heif",
]);

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const target = searchParams.get("path") ?? "";

  // Only allow removing files we produced under /uploads/proyectos.
  if (!/^\/uploads\/proyectos\/[a-z0-9-]+\.webp$/.test(target)) {
    return NextResponse.json({ error: "Ruta no permitida" }, { status: 400 });
  }

  try {
    await fs.unlink(path.join(process.cwd(), "public", target));
  } catch {
    // Already gone — treat as success.
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
    return NextResponse.json(
      { error: "La imagen supera los 30 MB." },
      { status: 400 }
    );
  }
  if (file.type && !ACCEPTED.has(file.type)) {
    return NextResponse.json(
      { error: "Formato no soportado. Usa JPG, PNG, WebP, AVIF o HEIC." },
      { status: 400 }
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const output = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.webp`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), output);

    return NextResponse.json({
      path: `${PUBLIC_PREFIX}/${name}`,
      bytes: output.length,
      originalBytes: file.size,
    });
  } catch (err) {
    console.error("Image upload failed", err);
    return NextResponse.json(
      { error: "No se pudo procesar la imagen." },
      { status: 500 }
    );
  }
}
