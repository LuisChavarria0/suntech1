import crypto from "node:crypto";
import { readJson, writeJson } from "./jsonStore";

export interface QuoteLogEntry {
  id: string;
  timestamp: string;
  systemType: string;
  kw: number | null;
  name: string;
  address: string;
  phone: string;
}

interface QuotesFile {
  entries: QuoteLogEntry[];
}

interface QuotesIndex {
  /** "YYYY-MM" of every month that has a file, newest first. */
  months: string[];
}

const INDEX_KEY = "cotizador-quotes-index";
const INDEX_FILE = "cotizador-quotes-index.json";

// One file per month, grouped under a year folder — e.g.
// data/cotizador-quotes/2026/09.json — so each file stays small (a month's
// worth of quotes) no matter how long the site has been running, and the
// admin UI can filter straight to a given year/month without ever reading
// files it doesn't need. A small index file tracks which months exist.

function splitYearMonth(yearMonth: string): { year: string; month: string } {
  const [year, month] = yearMonth.split("-");
  return { year, month };
}

function monthOf(date: Date): string {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function keyFor(yearMonth: string): string {
  return `cotizador-quotes/${yearMonth}`;
}

function fileFor(yearMonth: string): string {
  const { year, month } = splitYearMonth(yearMonth);
  return `cotizador-quotes/${year}/${month}.json`;
}

async function readMonthFile(yearMonth: string): Promise<QuotesFile> {
  return readJson<QuotesFile>(keyFor(yearMonth), fileFor(yearMonth), { entries: [] });
}

async function writeMonthFile(yearMonth: string, data: QuotesFile): Promise<void> {
  await writeJson(keyFor(yearMonth), fileFor(yearMonth), data);
}

async function readIndex(): Promise<QuotesIndex> {
  return readJson<QuotesIndex>(INDEX_KEY, INDEX_FILE, { months: [] });
}

async function writeIndex(data: QuotesIndex): Promise<void> {
  await writeJson(INDEX_KEY, INDEX_FILE, data);
}

export async function listAvailableMonths(): Promise<string[]> {
  return (await readIndex()).months;
}

export async function appendQuoteLog(entry: {
  systemType: string;
  kw: number | null;
  name: string;
  address: string;
  phone: string;
}): Promise<void> {
  const now = new Date();
  const yearMonth = monthOf(now);

  const data = await readMonthFile(yearMonth);
  data.entries.unshift({
    id: crypto.randomUUID(),
    timestamp: now.toISOString(),
    ...entry,
  });
  await writeMonthFile(yearMonth, data);

  const idx = await readIndex();
  if (!idx.months.includes(yearMonth)) {
    idx.months = [...idx.months, yearMonth].sort().reverse();
    await writeIndex(idx);
  }
}

/**
 * Reads the quotes log, filtered by year and/or month ("YYYY", "MM").
 * With no filter, defaults to the most recent month that has data (or the
 * current month if the log is empty).
 */
export async function listQuoteLog(filter?: {
  year?: string;
  month?: string;
}): Promise<{ entries: QuoteLogEntry[]; availableMonths: string[] }> {
  const availableMonths = await listAvailableMonths();

  let months: string[];
  if (filter?.year && filter?.month) {
    months = [`${filter.year}-${filter.month}`];
  } else if (filter?.year) {
    months = availableMonths.filter((m) => m.startsWith(`${filter.year}-`));
  } else {
    months = availableMonths.length > 0 ? [availableMonths[0]] : [monthOf(new Date())];
  }

  const files = await Promise.all(months.map(readMonthFile));
  const entries = files
    .flatMap((f) => f.entries)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return { entries, availableMonths };
}
