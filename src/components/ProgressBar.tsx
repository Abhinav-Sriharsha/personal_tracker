interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  compact?: boolean;
}

export function ProgressBar({ value, max, label, compact = false }: ProgressBarProps) {
  const progress = max > 0 ? Math.max(0, value / max) : 0;
  const clamped = Math.min(progress, 1);
  const state =
    progress >= 1 ? "complete" : progress >= 0.7 ? "strong" : progress >= 0.25 ? "building" : "low";

  return (
    <div className={`progress ${compact ? "progress--compact" : ""}`} aria-label={label}>
      <div className="progress__track">
        <div
          className={`progress__fill progress__fill--${state}`}
          style={{ transform: `scaleX(${clamped})` }}
        />
      </div>
    </div>
  );
}
