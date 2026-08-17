import type { DailyRecordNumberField } from "../types/DailyRecord";
import { ProgressBar } from "./ProgressBar";

interface CountTrackerProps {
  field: DailyRecordNumberField;
  title: string;
  value: number;
  target: number;
  xpEach: number;
  quickAdds: number[];
  onChange: (field: DailyRecordNumberField, value: number) => void;
}

export function CountTracker({
  field,
  title,
  value,
  target,
  xpEach,
  quickAdds,
  onChange,
}: CountTrackerProps) {
  const setValue = (nextValue: number) => {
    onChange(field, Math.max(0, Math.floor(nextValue || 0)));
  };

  return (
    <section className="task task--count" aria-labelledby={`${field}-label`}>
      <div className="task__topline">
        <h3 id={`${field}-label`}>
          {title} <span className="xpTag">(+{xpEach})</span>
        </h3>
        <span className="task__ratio">{value.toLocaleString()} / {target.toLocaleString()}</span>
      </div>

      <ProgressBar value={value} max={target} compact label={`${title} progress`} />

      <div className="countControls" aria-label={`${title} controls`}>
        <button className="stepButton" type="button" onClick={() => setValue(value - 1)} aria-label={`Decrease ${title}`}>
          -
        </button>
        <input
          className="countInput"
          aria-label={`${title} count`}
          type="number"
          min="0"
          inputMode="numeric"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          onFocus={(event) => event.currentTarget.select()}
        />
        <button className="stepButton" type="button" onClick={() => setValue(value + 1)} aria-label={`Increase ${title}`}>
          +
        </button>
        <div className="quickAdds">
          {quickAdds.map((amount) => (
            <button key={amount} className="quickButton" type="button" onClick={() => setValue(value + amount)}>
              +{amount}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
