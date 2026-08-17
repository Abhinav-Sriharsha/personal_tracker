import { useLayoutEffect, useRef, useState } from "react";
import type { DailyRecord } from "../types/DailyRecord";
import { formatCompactDate, getForwardHeatmapDays, toDateKey, todayKey } from "../utils/dates";
import { xpBucket } from "../utils/xp";

interface XPHeatmapProps {
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

const MAX_WEEKS = 53;
const MIN_WEEKS = 1;
const SIDE_RAIL_CELL_SIZE = 16;
const SIDE_RAIL_CELL_GAP = 5;
const BOTTOM_BREATHING_ROOM = 28;

export function XPHeatmap({ records, selectedDate, onSelectDate }: XPHeatmapProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(12);
  const days = getForwardHeatmapDays(todayKey(), visibleWeeks);
  const weeks: Date[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  useLayoutEffect(() => {
    const updateVisibleWeeks = () => {
      const shell = shellRef.current;
      const mainColumn = document.querySelector<HTMLElement>(".mainColumn");
      if (!shell || !mainColumn) return;

      const shellTop = shell.getBoundingClientRect().top;
      const mainBottom = mainColumn.getBoundingClientRect().bottom;
      const viewportBottom = window.innerHeight - BOTTOM_BREATHING_ROOM;
      const bottomLimit = Math.min(mainBottom, viewportBottom);
      const availableHeight = bottomLimit - shellTop;
      const rowHeight = SIDE_RAIL_CELL_SIZE + SIDE_RAIL_CELL_GAP;
      const nextWeeks = Math.max(
        MIN_WEEKS,
        Math.min(MAX_WEEKS, Math.floor((availableHeight + SIDE_RAIL_CELL_GAP) / rowHeight)),
      );

      setVisibleWeeks(nextWeeks);
    };

    updateVisibleWeeks();
    window.addEventListener("resize", updateVisibleWeeks);

    const observer = new ResizeObserver(updateVisibleWeeks);
    const mainColumn = document.querySelector<HTMLElement>(".mainColumn");
    if (mainColumn) observer.observe(mainColumn);
    if (shellRef.current) observer.observe(shellRef.current);

    return () => {
      window.removeEventListener("resize", updateVisibleWeeks);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="sectionBlock" aria-labelledby="heatmap-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionKicker">Contributions</p>
          <h2 id="heatmap-title">XP heatmap</h2>
        </div>
        <div className="heatLegend" aria-label="XP intensity legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4, 5].map((bucket) => (
            <i key={bucket} className={`heatCell heatCell--${bucket}`} aria-hidden="true" />
          ))}
          <span>More</span>
        </div>
      </div>

      <div ref={shellRef} className="heatmapShell" role="grid" aria-label="Upcoming XP starting today">
        <div className="heatmap heatmap--vertical">
          {weeks.map((week, weekIndex) => (
            <div className="heatWeek" key={weekIndex}>
              {week.map((date) => {
                const key = toDateKey(date);
                const xp = records[key]?.xp ?? 0;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`heatCell heatCell--${xpBucket(xp)} ${key === selectedDate ? "heatCell--selected" : ""}`}
                    onClick={() => onSelectDate(key)}
                    aria-label={`${formatCompactDate(key)}, ${xp} XP`}
                    title={`${formatCompactDate(key)}\n${xp} XP`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
