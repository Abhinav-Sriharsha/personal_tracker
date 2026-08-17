import { useCallback, useEffect, useMemo, useState } from "react";
import { db, emptyRecord, normalizeRecord } from "../db/trackerDb";
import type { DailyRecord } from "../types/DailyRecord";
import { calculateXp } from "../utils/xp";

export function useDailyRecords(selectedDate: string) {
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [ready, setReady] = useState(false);

  const loadRecords = useCallback(async () => {
    const rows = await db.dailyRecords.toArray();
    const byDate = Object.fromEntries(rows.map((row) => [row.date, normalizeRecord(row)]));
    setRecords(byDate);
    setReady(true);
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const selectedRecord = useMemo(
    () => records[selectedDate] ?? emptyRecord(selectedDate),
    [records, selectedDate],
  );

  const saveRecord = useCallback(async (nextRecord: DailyRecord) => {
    const normalized = normalizeRecord({
      ...nextRecord,
      xp: calculateXp(nextRecord),
      updatedAt: new Date().toISOString(),
    });

    setRecords((current) => ({
      ...current,
      [normalized.date]: normalized,
    }));

    await db.dailyRecords.put(normalized);
  }, []);

  const updateSelectedRecord = useCallback(
    async (patch: Partial<DailyRecord>) => {
      const current = records[selectedDate] ?? emptyRecord(selectedDate);
      await saveRecord({
        ...current,
        ...patch,
        date: selectedDate,
      });
    },
    [records, saveRecord, selectedDate],
  );

  const replaceAll = useCallback(async (nextRecords: DailyRecord[]) => {
    const normalized = nextRecords.map(normalizeRecord);
    await db.transaction("rw", db.dailyRecords, async () => {
      await db.dailyRecords.clear();
      await db.dailyRecords.bulkPut(normalized);
    });
    setRecords(Object.fromEntries(normalized.map((record) => [record.date, record])));
  }, []);

  const resetAll = useCallback(async () => {
    await db.dailyRecords.clear();
    setRecords({});
  }, []);

  return {
    ready,
    records,
    allRecords: Object.values(records).sort((a, b) => a.date.localeCompare(b.date)),
    selectedRecord,
    updateSelectedRecord,
    replaceAll,
    resetAll,
  };
}
