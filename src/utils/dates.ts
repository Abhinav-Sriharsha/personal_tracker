const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const compactFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfWeek(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  next.setDate(next.getDate() - day);
  return next;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function formatHeaderDate(dateKey: string): string {
  return dayFormatter.format(fromDateKey(dateKey));
}

export function formatCompactDate(dateKey: string): string {
  return compactFormatter.format(fromDateKey(dateKey));
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date);
}

export function getMonthGrid(monthDate: Date): Date[] {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const gridStart = addDays(start, -start.getDay());
  const gridEnd = addDays(end, 6 - end.getDay());
  const dates: Date[] = [];

  for (let day = new Date(gridStart); day <= gridEnd; day = addDays(day, 1)) {
    dates.push(day);
  }

  return dates;
}

export function getHeatmapDays(endDateKey: string, weeks = 53): Date[] {
  const end = fromDateKey(endDateKey);
  const daysToSunday = 6 - end.getDay();
  const gridEnd = addDays(end, daysToSunday);
  const gridStart = addDays(gridEnd, -(weeks * 7 - 1));
  const days: Date[] = [];

  for (let day = gridStart; day <= gridEnd; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
}

export function getForwardHeatmapDays(startDateKey: string, weeks = 53): Date[] {
  const start = fromDateKey(startDateKey);
  const days: Date[] = [];

  for (let index = 0; index < weeks * 7; index += 1) {
    days.push(addDays(start, index));
  }

  return days;
}
