import Dexie, { type Table } from "dexie";
import type { CustomTask, DailyRecord } from "../types/DailyRecord";
import { calculateXp } from "../utils/xp";

export class TrackerDb extends Dexie {
  dailyRecords!: Table<DailyRecord, string>;

  constructor() {
    super("personalProductivityTracker");
    this.version(1).stores({
      dailyRecords: "date, updatedAt",
    });
  }
}

export const db = new TrackerDb();

export function emptyRecord(date: string): DailyRecord {
  const base = {
    date,
    tailoredApplications: 0,
    quickApplications: 0,
    linkedinOutreach: 0,
    emails: 0,
    leetcodeDone: false,
    leetcodeReviews: 0,
    pythonDone: false,
    systemDesignDone: false,
    customTasks: [],
  };

  return {
    ...base,
    xp: calculateXp(base),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeRecord(record: Partial<DailyRecord> & { date: string }): DailyRecord {
  const base = {
    ...emptyRecord(record.date),
    ...record,
  };
  const normalizedFields = {
    tailoredApplications: Math.max(0, Math.floor(Number(base.tailoredApplications) || 0)),
    quickApplications: Math.max(0, Math.floor(Number(base.quickApplications) || 0)),
    linkedinOutreach: Math.max(0, Math.floor(Number(base.linkedinOutreach) || 0)),
    emails: Math.max(0, Math.floor(Number(base.emails) || 0)),
    leetcodeReviews: Math.max(0, Math.floor(Number(base.leetcodeReviews) || 0)),
    leetcodeDone: Boolean(base.leetcodeDone),
    pythonDone: Boolean(base.pythonDone),
    systemDesignDone: Boolean(base.systemDesignDone),
    customTasks: normalizeCustomTasks(base.customTasks),
  };

  return {
    ...base,
    ...normalizedFields,
    xp: calculateXp(normalizedFields),
    updatedAt: base.updatedAt || new Date().toISOString(),
  };
}

function normalizeCustomTasks(tasks: unknown): CustomTask[] {
  if (!Array.isArray(tasks)) return [];

  return tasks
    .map((task) => {
      if (!task || typeof task !== "object") return null;
      const candidate = task as Partial<CustomTask>;
      const title = String(candidate.title ?? "").trim();
      if (!title) return null;

      return {
        id: String(candidate.id || crypto.randomUUID()),
        title,
        xp: Math.max(0, Math.floor(Number(candidate.xp) || 0)),
        done: Boolean(candidate.done),
      };
    })
    .filter((task): task is CustomTask => Boolean(task));
}
