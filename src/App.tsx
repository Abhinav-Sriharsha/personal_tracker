import { useMemo, useState } from "react";
import { BackupMenu } from "./components/BackupMenu";
import { BinaryTask } from "./components/BinaryTask";
import { CountTracker } from "./components/CountTracker";
import { CustomTasks } from "./components/CustomTasks";
import { MonthCalendar } from "./components/MonthCalendar";
import { ProgressBar } from "./components/ProgressBar";
import { Stats } from "./components/Stats";
import { XPHeatmap } from "./components/XPHeatmap";
import { useDailyRecords } from "./hooks/useDailyRecords";
import type {
  DailyRecordBooleanField,
  DailyRecordNumberField,
} from "./types/DailyRecord";
import { formatHeaderDate, fromDateKey, todayKey } from "./utils/dates";
import { getStreaks } from "./utils/stats";
import { DAILY_XP_TARGET, progressStatus, XP_VALUES } from "./utils/xp";

const countTasks = [
  {
    field: "tailoredApplications",
    title: "Tailored Applications",
    target: 15,
    quickAdds: [1, 5],
  },
  {
    field: "quickApplications",
    title: "Quick / Good Applications",
    target: 15,
    quickAdds: [1, 5],
  },
  {
    field: "linkedinOutreach",
    title: "LinkedIn Outreach",
    target: 300,
    quickAdds: [1, 5, 10],
  },
  {
    field: "emails",
    title: "Emails",
    target: 75,
    quickAdds: [1, 5, 10],
  },
] as const;

export default function App() {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [visibleMonth, setVisibleMonth] = useState(fromDateKey(todayKey()));
  const {
    ready,
    records,
    allRecords,
    selectedRecord,
    updateSelectedRecord,
    replaceAll,
    resetAll,
  } = useDailyRecords(selectedDate);

  const streaks = useMemo(() => getStreaks(records), [records]);
  const progress = selectedRecord.xp / DAILY_XP_TARGET;
  const dateIsToday = selectedDate === todayKey();
  const headerLabel = dateIsToday ? "Today" : "Selected day";

  const updateNumber = (field: DailyRecordNumberField, value: number) => {
    void updateSelectedRecord({ [field]: value });
  };

  const updateBoolean = (field: DailyRecordBooleanField, checked: boolean) => {
    void updateSelectedRecord({ [field]: checked });
  };

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setVisibleMonth(fromDateKey(dateKey));
  };

  return (
    <main className="appShell">
      <div className="mainColumn">
        <header className="todayHeader">
          <div className="todayHeader__topline">
            <div>
              <p className="eyebrow">{headerLabel} — {formatHeaderDate(selectedDate)}</p>
              <h1>{selectedRecord.xp.toLocaleString()} XP</h1>
            </div>
            <div className="headerActions">
              {!dateIsToday && (
                <button type="button" className="todayButton" onClick={() => selectDate(todayKey())}>
                  Today
                </button>
              )}
              <BackupMenu records={allRecords} onImport={replaceAll} onReset={resetAll} />
            </div>
          </div>

          <div className="headlineGrid">
            <div>
              <div className="metricLine">
                <span>{selectedRecord.xp.toLocaleString()} / {DAILY_XP_TARGET.toLocaleString()} XP</span>
                <span>{Math.round(Math.min(progress, 1) * 100)}% of daily target</span>
              </div>
              <ProgressBar value={selectedRecord.xp} max={DAILY_XP_TARGET} label="Daily XP progress" />
              <p className="statusText">{progressStatus(progress)}</p>
            </div>
            <div className="streakPair" aria-label="Streaks">
              <div>
                <strong>{streaks.current.toLocaleString()}</strong>
                <span>current streak</span>
              </div>
              <div>
                <strong>{streaks.longest.toLocaleString()}</strong>
                <span>longest streak</span>
              </div>
            </div>
          </div>
        </header>

        <section className="sectionBlock taskPanel" aria-labelledby="tasks-title">
          <div className="sectionHeader">
            <div>
              <p className="sectionKicker">{dateIsToday ? "Today" : "Selected day"}</p>
              <h2 id="tasks-title">{dateIsToday ? "Daily routine" : formatHeaderDate(selectedDate)}</h2>
            </div>
            {!ready && <span className="loadingText">Loading local data</span>}
          </div>

          <div className="taskGrid">
            {countTasks.map((task) => (
              <CountTracker
                key={task.field}
                field={task.field}
                title={task.title}
              value={selectedRecord[task.field]}
              target={task.target}
              xpEach={XP_VALUES[task.field]}
              quickAdds={[...task.quickAdds]}
              onChange={updateNumber}
            />
            ))}
          </div>

          <div className="binaryGrid">
            <BinaryTask
              field="leetcodeDone"
              title="LeetCode Problem"
              xp={XP_VALUES.leetcodeDone}
              checked={selectedRecord.leetcodeDone}
              onChange={updateBoolean}
            />

            <div className="reviewCounter">
              <div>
                <span>Reviews <span className="xpTag">(+{XP_VALUES.leetcodeReviews} each)</span></span>
                <strong>{selectedRecord.leetcodeReviews.toLocaleString()}</strong>
              </div>
              <div className="miniStepper">
                <button type="button" onClick={() => updateNumber("leetcodeReviews", selectedRecord.leetcodeReviews - 1)} aria-label="Decrease LeetCode reviews">-</button>
                <button type="button" onClick={() => updateNumber("leetcodeReviews", selectedRecord.leetcodeReviews + 1)} aria-label="Increase LeetCode reviews">+</button>
              </div>
            </div>

            <BinaryTask
              field="pythonDone"
              title="Python Learning"
              detail="30 min"
              xp={XP_VALUES.pythonDone}
              checked={selectedRecord.pythonDone}
              onChange={updateBoolean}
            />
            <BinaryTask
              field="systemDesignDone"
              title="System Design"
              detail="30 min"
              xp={XP_VALUES.systemDesignDone}
              checked={selectedRecord.systemDesignDone}
              onChange={updateBoolean}
            />
          </div>

          <CustomTasks
            tasks={selectedRecord.customTasks}
            onChange={(customTasks) => void updateSelectedRecord({ customTasks })}
          />
        </section>

        <Stats records={allRecords} selectedDate={selectedDate} />
      </div>

      <aside className="sideRail" aria-label="Activity overview">
        <MonthCalendar
          monthDate={visibleMonth}
          selectedDate={selectedDate}
          records={records}
          onMonthChange={setVisibleMonth}
          onSelectDate={selectDate}
        />

        <XPHeatmap records={records} selectedDate={selectedDate} onSelectDate={selectDate} />
      </aside>
    </main>
  );
}
