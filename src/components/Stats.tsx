import type { DailyRecord } from "../types/DailyRecord";
import { getStats } from "../utils/stats";

interface StatsProps {
  records: DailyRecord[];
  selectedDate: string;
}

export function Stats({ records, selectedDate }: StatsProps) {
  const stats = getStats(records, selectedDate);
  const items = [
    ["XP this week", stats.weekXp],
    ["XP this month", stats.monthXp],
    ["Tailored apps", stats.tailoredWeek],
    ["Total apps", stats.totalApplicationsWeek],
    ["Outreach", stats.outreachWeek],
    ["Emails", stats.emailsWeek],
    ["LeetCode", stats.leetcodeWeek],
  ] as const;

  return (
    <section className="sectionBlock statsBlock" aria-labelledby="stats-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionKicker">This week</p>
          <h2 id="stats-title">Small stats</h2>
        </div>
      </div>
      <dl className="statsGrid">
        {items.map(([label, value]) => (
          <div className="statItem" key={label}>
            <dt>{label}</dt>
            <dd>{value.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
