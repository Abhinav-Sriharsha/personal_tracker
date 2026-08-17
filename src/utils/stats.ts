import type { DailyRecord } from "../types/DailyRecord";
import { addDays, fromDateKey, startOfMonth, startOfWeek, toDateKey, todayKey } from "./dates";

export function recordsInRange(records: DailyRecord[], startKey: string, endKey: string): DailyRecord[] {
  return records.filter((record) => record.date >= startKey && record.date <= endKey);
}

export function getStats(records: DailyRecord[], anchorKey: string) {
  const anchorDate = fromDateKey(anchorKey);
  const weekStartKey = toDateKey(startOfWeek(anchorDate));
  const weekEndKey = toDateKey(addDays(startOfWeek(anchorDate), 6));
  const monthStartKey = toDateKey(startOfMonth(anchorDate));
  const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
  const monthEndKey = toDateKey(monthEnd);
  const week = recordsInRange(records, weekStartKey, weekEndKey);
  const month = recordsInRange(records, monthStartKey, monthEndKey);

  return {
    weekXp: sum(week, "xp"),
    monthXp: sum(month, "xp"),
    tailoredWeek: sum(week, "tailoredApplications"),
    totalApplicationsWeek:
      sum(week, "tailoredApplications") + sum(week, "quickApplications"),
    outreachWeek: sum(week, "linkedinOutreach"),
    emailsWeek: sum(week, "emails"),
    leetcodeWeek: week.filter((record) => record.leetcodeDone).length,
  };
}

export function getStreaks(recordsByDate: Record<string, DailyRecord>) {
  const today = todayKey();
  let current = 0;
  let cursor = fromDateKey(today);

  while (true) {
    const key = toDateKey(cursor);
    if ((recordsByDate[key]?.xp ?? 0) <= 0) break;
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const activeDates = Object.values(recordsByDate)
    .filter((record) => record.xp > 0)
    .map((record) => record.date)
    .sort();

  let longest = 0;
  let run = 0;
  let previous: string | null = null;

  for (const key of activeDates) {
    if (!previous) {
      run = 1;
    } else {
      const expected = toDateKey(addDays(fromDateKey(previous), 1));
      run = key === expected ? run + 1 : 1;
    }
    longest = Math.max(longest, run);
    previous = key;
  }

  return { current, longest };
}

function sum(records: DailyRecord[], key: keyof DailyRecord): number {
  return records.reduce((total, record) => {
    const value = record[key];
    return total + (typeof value === "number" ? value : 0);
  }, 0);
}
