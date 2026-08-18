import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  details: string;
}

const LOG_PATH = path.join(process.cwd(), "data", "cotizador-audit-log.json");
const MAX_ENTRIES = 500;

interface LogFile {
  entries: AuditLogEntry[];
}

async function readLogFile(): Promise<LogFile> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { entries: [] };
  }
}

async function writeLogFile(data: LogFile): Promise<void> {
  await fs.writeFile(LOG_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function appendAuditLog(entry: {
  username: string;
  action: string;
  details: string;
}): Promise<void> {
  const data = await readLogFile();
  data.entries.unshift({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  });
  data.entries = data.entries.slice(0, MAX_ENTRIES);
  await writeLogFile(data);
}

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  const data = await readLogFile();
  return data.entries;
}
