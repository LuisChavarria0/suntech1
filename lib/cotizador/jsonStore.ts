// Persistent JSON storage that survives Vercel's ephemeral filesystem.
//
// Source-of-truth rule the project wants:
//   - The committed /data/<file> is the base. While it is unchanged, admin edits
//     are stored in Blob and persist across deploys.
//   - The moment you change a committed /data/<file> and redeploy, that file wins
//     again and the Blob copy is reset from it (admin edits on that file are
//     dropped, on purpose).
//
// How: alongside the data blob we keep a tiny `seed/<key>` blob holding a hash of
// the committed file it was seeded from. On read, if the committed file's hash
// still matches the stored seed hash we serve the Blob copy (admin edits);
// otherwise we re-seed Blob from the committed file.
//
// Locally (no BLOB_READ_WRITE_TOKEN) everything is just plain fs on /data/<file>.

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { list, put, del } from "@vercel/blob";
import { BLOB_TOKEN, hasBlob } from "./blobStore";

const CACHE_TTL_MS = 10_000;

type CacheEntry = { at: number; data: unknown };
const cache = new Map<string, CacheEntry>();

function localPath(file: string): string {
  return path.join(process.cwd(), "data", file);
}

async function readLocalRaw(file: string): Promise<string | null> {
  try {
    return await fs.readFile(localPath(file), "utf-8");
  } catch {
    return null;
  }
}

const hashOf = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);

async function newestUrl(prefix: string): Promise<string | null> {
  const { blobs } = await list({ prefix, token: BLOB_TOKEN });
  if (blobs.length === 0) return null;
  blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  return blobs[0].url;
}

async function prune(prefix: string): Promise<void> {
  try {
    const { blobs } = await list({ prefix, token: BLOB_TOKEN });
    if (blobs.length <= 1) return;
    blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
    await del(
      blobs.slice(1).map((b) => b.url),
      { token: BLOB_TOKEN }
    );
  } catch {
    // best-effort
  }
}

async function putBlob(pathname: string, body: string, contentType: string): Promise<void> {
  await put(pathname, body, {
    access: "public",
    token: BLOB_TOKEN,
    contentType,
    addRandomSuffix: true,
  });
}

/** Persist a data file. Called by admin saves — does NOT touch the seed marker. */
export async function writeJson(key: string, file: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  cache.set(key, { at: Date.now(), data });

  if (hasBlob()) {
    await putBlob(`data/${key}.json`, body, "application/json");
    await prune(`data/${key}`);
    return;
  }

  await fs.mkdir(path.dirname(localPath(file)), { recursive: true });
  await fs.writeFile(localPath(file), body + "\n", "utf-8");
}

async function reseedFromFile<T>(key: string, raw: string | null, fallback: T): Promise<T> {
  const data = raw ? (JSON.parse(raw) as T) : fallback;
  const seedHash = raw ? hashOf(raw) : "empty";
  await putBlob(`data/${key}.json`, JSON.stringify(data, null, 2), "application/json");
  await putBlob(`seed/${key}.txt`, seedHash, "text/plain");
  await Promise.all([prune(`data/${key}`), prune(`seed/${key}`)]);
  return data;
}

export async function readJson<T>(key: string, file: string, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data as T;

  const raw = await readLocalRaw(file);
  let data: T;

  if (hasBlob()) {
    const seedHash = raw ? hashOf(raw) : "empty";
    const [dataUrl, seedUrl] = await Promise.all([
      newestUrl(`data/${key}`),
      newestUrl(`seed/${key}`),
    ]);

    let storedSeed: string | null = null;
    if (seedUrl) {
      storedSeed = (await (await fetch(seedUrl, { cache: "no-store" })).text()).trim();
    }

    if (dataUrl && storedSeed === seedHash) {
      // Committed file unchanged since seeding → serve the Blob copy (admin edits).
      data = (await (await fetch(dataUrl, { cache: "no-store" })).json()) as T;
    } else {
      // First run, or the committed file changed → reset Blob from the file.
      data = await reseedFromFile<T>(key, raw, fallback);
    }
  } else {
    data = raw ? (JSON.parse(raw) as T) : fallback;
  }

  cache.set(key, { at: Date.now(), data });
  return data;
}
