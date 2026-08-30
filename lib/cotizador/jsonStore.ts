// Persistent JSON storage that survives Vercel's ephemeral filesystem.
//
// - On Vercel (BLOB_READ_WRITE_TOKEN present): each logical file is stored as a
//   blob under `data/<key>-<random>.json`. Reads pick the newest version and
//   delete stale ones on write. The random suffix keeps the URL unguessable
//   (matters for cotizador-users.json, which holds password hashes) and sidesteps
//   CDN caching.
// - Locally (no token): plain reads/writes against /data/<file>, seeded from the
//   committed JSON so `npm run dev` works with no setup.
//
// First read on Vercel falls back to the committed file and seeds the blob, so
// existing data migrates automatically.

import fs from "node:fs/promises";
import path from "node:path";
import { list, put, del } from "@vercel/blob";
import { BLOB_TOKEN, hasBlob } from "./blobStore";

const CACHE_TTL_MS = 10_000;

type CacheEntry = { at: number; data: unknown };
const cache = new Map<string, CacheEntry>();

function localPath(file: string): string {
  return path.join(process.cwd(), "data", file);
}

async function readLocal<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(localPath(file), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function newestBlobUrl(key: string): Promise<string | null> {
  const { blobs } = await list({ prefix: `data/${key}`, token: BLOB_TOKEN });
  if (blobs.length === 0) return null;
  blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  return blobs[0].url;
}

async function pruneOld(key: string): Promise<void> {
  try {
    const { blobs } = await list({ prefix: `data/${key}`, token: BLOB_TOKEN });
    if (blobs.length <= 1) return;
    blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
    await del(
      blobs.slice(1).map((b) => b.url),
      { token: BLOB_TOKEN }
    );
  } catch {
    // Pruning is best-effort.
  }
}

export async function writeJson(key: string, file: string, data: unknown): Promise<void> {
  cache.set(key, { at: Date.now(), data });

  if (hasBlob()) {
    await put(`data/${key}.json`, JSON.stringify(data, null, 2), {
      access: "public",
      token: BLOB_TOKEN,
      contentType: "application/json",
      addRandomSuffix: true,
    });
    await pruneOld(key);
    return;
  }

  await fs.mkdir(path.dirname(localPath(file)), { recursive: true });
  await fs.writeFile(localPath(file), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function readJson<T>(key: string, file: string, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data as T;

  let data: T;

  if (hasBlob()) {
    const url = await newestBlobUrl(key);
    if (url) {
      const res = await fetch(url, { cache: "no-store" });
      data = (await res.json()) as T;
    } else {
      // Seed the blob from the committed file the first time.
      data = await readLocal(file, fallback);
      await writeJson(key, file, data);
    }
  } else {
    data = await readLocal(file, fallback);
  }

  cache.set(key, { at: Date.now(), data });
  return data;
}
