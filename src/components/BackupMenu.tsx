import { useRef, useState } from "react";
import type { DailyRecord } from "../types/DailyRecord";
import { exportCsv, exportJson, parseJsonBackup } from "../utils/backup";

interface BackupMenuProps {
  records: DailyRecord[];
  onImport: (records: DailyRecord[]) => Promise<void>;
  onReset: () => Promise<void>;
}

export function BackupMenu({ records, onImport, onReset }: BackupMenuProps) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    const imported = await parseJsonBackup(file);
    await onImport(imported);
    setOpen(false);
  };

  const reset = async () => {
    const confirmed = window.confirm("Reset all tracker data stored in this browser?");
    if (!confirmed) return;
    await onReset();
    setOpen(false);
  };

  return (
    <div className="backupMenu">
      <button
        className="iconButton"
        type="button"
        aria-label="Open data menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">•••</span>
      </button>

      {open && (
        <div className="menuPanel" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              exportCsv(records);
              setOpen(false);
            }}
          >
            Export CSV
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              exportJson(records);
              setOpen(false);
            }}
          >
            Export JSON backup
          </button>
          <button type="button" role="menuitem" onClick={() => fileRef.current?.click()}>Import JSON backup</button>
          <button type="button" role="menuitem" className="dangerItem" onClick={reset}>Reset all data</button>
        </div>
      )}

      <input
        ref={fileRef}
        className="visuallyHidden"
        type="file"
        accept="application/json,.json"
        onChange={(event) => {
          void importBackup(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
