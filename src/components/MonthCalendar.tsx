import type { DailyRecord } from "../types/DailyRecord";
import { formatMonth, getMonthGrid, isSameDay, toDateKey, todayKey } from "../utils/dates";

interface MonthCalendarProps {
  monthDate: Date;
  selectedDate: string;
  records: Record<string, DailyRecord>;
  onMonthChange: (date: Date) => void;
  onSelectDate: (dateKey: string) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function MonthCalendar({
  monthDate,
  selectedDate,
  records,
  onMonthChange,
  onSelectDate,
}: MonthCalendarProps) {
  const today = todayKey();
  const days = getMonthGrid(monthDate);

  const shiftMonth = (amount: number) => {
    onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() + amount, 1));
  };

  return (
    <section className="sectionBlock" aria-labelledby="calendar-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionKicker">Activity</p>
          <h2 id="calendar-title">Show-up calendar</h2>
        </div>
        <div className="monthNav" aria-label="Month navigation">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
          <span>{formatMonth(monthDate)}</span>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
        </div>
      </div>

      <div className="monthCalendar">
        {WEEKDAYS.map((day, index) => (
          <span className="weekday" key={`${day}-${index}`}>{day}</span>
        ))}
        {days.map((date) => {
          const key = toDateKey(date);
          const record = records[key];
          const inMonth = date.getMonth() === monthDate.getMonth();
          const showedUp = (record?.xp ?? 0) > 0;

          return (
            <button
              key={key}
              className={[
                "calendarDay",
                inMonth ? "" : "calendarDay--muted",
                showedUp ? "calendarDay--active" : "",
                key === selectedDate ? "calendarDay--selected" : "",
                key === today ? "calendarDay--today" : "",
              ].join(" ")}
              type="button"
              onClick={() => onSelectDate(key)}
              aria-label={`${key}${showedUp ? `, ${record?.xp} XP` : ""}`}
              aria-current={isSameDay(date, new Date()) ? "date" : undefined}
            >
              <span>{date.getDate()}</span>
              <i aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
