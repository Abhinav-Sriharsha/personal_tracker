import type { DailyRecordBooleanField } from "../types/DailyRecord";

interface BinaryTaskProps {
  field: DailyRecordBooleanField;
  title: string;
  detail?: string;
  xp: number;
  checked: boolean;
  onChange: (field: DailyRecordBooleanField, checked: boolean) => void;
}

export function BinaryTask({ field, title, detail, xp, checked, onChange }: BinaryTaskProps) {
  return (
    <label className={`binaryTask ${checked ? "binaryTask--checked" : ""}`}>
      <span className="checkboxWrap">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(field, event.target.checked)}
        />
        <span className="checkboxGlyph" aria-hidden="true" />
      </span>
      <span className="binaryTask__text">
        <span>{title} <span className="xpTag">(+{xp})</span></span>
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}
