export interface CustomTask {
  id: string;
  title: string;
  xp: number;
  done: boolean;
}

export interface DailyRecord {
  date: string;
  tailoredApplications: number;
  quickApplications: number;
  linkedinOutreach: number;
  emails: number;
  leetcodeDone: boolean;
  leetcodeReviews: number;
  pythonDone: boolean;
  systemDesignDone: boolean;
  githubContributionDone: boolean;
  prayerDone: boolean;
  customTasks: CustomTask[];
  xp: number;
  updatedAt: string;
}

export type DailyRecordInput = Omit<DailyRecord, "xp" | "updatedAt">;

export type DailyRecordNumberField =
  | "tailoredApplications"
  | "quickApplications"
  | "linkedinOutreach"
  | "emails"
  | "leetcodeReviews";

export type DailyRecordBooleanField =
  | "leetcodeDone"
  | "pythonDone"
  | "systemDesignDone"
  | "githubContributionDone"
  | "prayerDone";
