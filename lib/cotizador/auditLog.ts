import crypto from "node:crypto";
import { readJson, writeJson } from "./jsonStore";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  details: string;
}

const KEY = "cotizador-audit-log";
const FILE = "cotizador-audit-log.json";
const MAX_ENTRIES = 500;

interface LogFile {
  entries: AuditLogEntry[];
}

async function readLogFile(): Promise<LogFile> {
  return readJson<LogFile>(KEY, FILE, { entries: [] });
}

async function writeLogFile(data: LogFile): Promise<void> {
  await writeJson(KEY, FILE, data);
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
