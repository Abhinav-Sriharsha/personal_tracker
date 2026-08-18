import type { DailyRecord } from "../types/DailyRecord";

export const DAILY_XP_TARGET = 315;

export const XP_VALUES = {
  tailoredApplications: 10,
  quickApplications: 4,
  linkedinOutreach: 1,
  emails: 2,
  leetcodeDone: 20,
  leetcodeReviews: 5,
  pythonDone: 15,
  systemDesignDone: 15,
  githubContributionDone: 10,
  prayerDone: 10,
} as const;

export function calculateXp(record: Pick<
  DailyRecord,
  | "tailoredApplications"
  | "quickApplications"
  | "linkedinOutreach"
  | "emails"
  | "leetcodeDone"
  | "leetcodeReviews"
  | "pythonDone"
  | "systemDesignDone"
  | "githubContributionDone"
  | "prayerDone"
  | "customTasks"
>): number {
  const customTaskXp = record.customTasks.reduce(
    (total, task) => total + (task.done ? task.xp : 0),
    0,
  );

  return (
    record.tailoredApplications * XP_VALUES.tailoredApplications +
    record.quickApplications * XP_VALUES.quickApplications +
    record.linkedinOutreach * XP_VALUES.linkedinOutreach +
    record.emails * XP_VALUES.emails +
    (record.leetcodeDone ? XP_VALUES.leetcodeDone : 0) +
    record.leetcodeReviews * XP_VALUES.leetcodeReviews +
    (record.pythonDone ? XP_VALUES.pythonDone : 0) +
    (record.systemDesignDone ? XP_VALUES.systemDesignDone : 0) +
    (record.githubContributionDone ? XP_VALUES.githubContributionDone : 0) +
    (record.prayerDone ? XP_VALUES.prayerDone : 0) +
    customTaskXp
  );
}

export function xpBucket(xp: number): number {
  if (xp <= 0) return 0;
  const progress = xp / DAILY_XP_TARGET;
  if (progress < 0.25) return 1;
  if (progress < 0.5) return 2;
  if (progress < 0.75) return 3;
  if (progress < 1) return 4;
  return 5;
}

export function progressStatus(progress: number): string {
  if (progress <= 0) return "Ready when you are";
  if (progress < 0.25) return "A start is logged";
  if (progress < 0.6) return "Building steadily";
  if (progress < 1) return "Strong pace";
  return "Target reached";
}
