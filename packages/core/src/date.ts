import type { Weekday } from "./types";

const weekdayOrder: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const parseDate = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const parseUtcDateString = (date: string): Date => parseDate(date);

export const formatDate = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const d = `${date.getUTCDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const todayDateString = (): string => formatDate(new Date());

export const getWeekdayFromDate = (date: string): Weekday => {
  const jsDate = parseDate(date);
  const dayIndex = jsDate.getUTCDay(); // 0 (Sun) - 6 (Sat)
  const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return weekdayOrder[mappedIndex];
};

const startOfWeek = (date: Date): Date => {
  const cloned = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = cloned.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  cloned.setUTCDate(cloned.getUTCDate() + diff);
  return cloned;
};

export const isSameWeek = (dateA: Date, dateB: Date): boolean => {
  const startA = startOfWeek(dateA);
  const startB = startOfWeek(dateB);
  return startA.getTime() === startB.getTime();
};

export const isSameMonth = (dateA: Date, dateB: Date): boolean => {
  return dateA.getUTCFullYear() === dateB.getUTCFullYear() && dateA.getUTCMonth() === dateB.getUTCMonth();
};

export const daysBetween = (dateA: string, dateB: string): number => {
  const a = parseDate(dateA);
  const b = parseDate(dateB);
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const getDateForWeekdayInCurrentWeek = (weekday: Weekday, referenceDate: Date): string => {
  const start = startOfWeek(referenceDate);
  const target = addDays(start, weekdayOrder.indexOf(weekday));
  return formatDate(target);
};

