import type { DailyRecord } from "../types/DailyRecord";
import { normalizeRecord } from "../db/trackerDb";

const CSV_HEADERS = [
  "date",
  "tailoredApplications",
  "quickApplications",
  "linkedinOutreach",
  "emails",
  "leetcodeDone",
  "leetcodeReviews",
  "pythonDone",
  "systemDesignDone",
  "customTasks",
  "customTaskXp",
  "xp",
];

export function exportJson(records: DailyRecord[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    records: records.map(normalizeRecord),
  };

  downloadFile(
    `job-search-tracker-${dateStamp()}.json`,
    JSON.stringify(payload, null, 2),
    "application/json",
  );
}

export function exportCsv(records: DailyRecord[]): void {
  const rows = [
    CSV_HEADERS.join(","),
    ...records.map((record) => {
      const normalized = normalizeRecord(record);
      return CSV_HEADERS.map((key) =>
        csvCell(csvValue(normalized, key)),
      ).join(",");
    }),
  ];

  downloadFile(`job-search-tracker-${dateStamp()}.csv`, rows.join("\n"), "text/csv");
}

export async function parseJsonBackup(file: File): Promise<DailyRecord[]> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  const rows = Array.isArray(parsed)
    ? parsed
    : isBackupShape(parsed)
      ? parsed.records
      : null;

  if (!rows) {
    throw new Error("Backup JSON must be an array or an object with a records array.");
  }

  return rows.map((row) => normalizeRecord(row as Partial<DailyRecord> & { date: string }));
}

function isBackupShape(value: unknown): value is { records: unknown[] } {
  return Boolean(value && typeof value === "object" && Array.isArray((value as { records?: unknown }).records));
}

function csvValue(record: DailyRecord, key: string): unknown {
  if (key === "customTasks") {
    return record.customTasks
      .map((task) => `${task.done ? "[x]" : "[ ]"} ${task.title} (+${task.xp})`)
      .join("; ");
  }
  if (key === "customTaskXp") {
    return record.customTasks.reduce((total, task) => total + (task.done ? task.xp : 0), 0);
  }
  return record[key as keyof DailyRecord];
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}
