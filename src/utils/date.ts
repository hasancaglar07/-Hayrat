import type { Weekday } from "../data/types";

const weekdayOrder: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const parseDateParts = (date: string) => {
  const [y, m, d] = date.split("-").map((value) => Number(value));
  return { y, m, d };
};

// Parses YYYY-MM-DD as a local calendar date at 00:00 local time.
export const parseDateString = (date: string): Date => {
  const { y, m, d } = parseDateParts(date);
  return new Date(y, m - 1, d);
};

// Formats a Date into YYYY-MM-DD using local calendar fields.
export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const todayDateString = (): string => formatDate(new Date());

export const getWeekdayFromDate = (date: string): Weekday => {
  const jsDate = parseDateString(date);
  const dayIndex = jsDate.getDay(); // 0 (Sun) - 6 (Sat)
  const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return weekdayOrder[mappedIndex];
};

const startOfWeek = (date: Date): Date => {
  const cloned = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = cloned.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  cloned.setDate(cloned.getDate() + diff);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
};

export const isSameWeek = (dateA: Date, dateB: Date): boolean => {
  const startA = startOfWeek(dateA);
  const startB = startOfWeek(dateB);
  return startA.getTime() === startB.getTime();
};

export const isSameMonth = (dateA: Date, dateB: Date): boolean => {
  return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth();
};

export const daysBetween = (dateA: string, dateB: string): number => {
  const a = parseDateParts(dateA);
  const b = parseDateParts(dateB);
  const aUtc = Date.UTC(a.y, a.m - 1, a.d);
  const bUtc = Date.UTC(b.y, b.m - 1, b.d);
  const diffMs = bUtc - aUtc;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getDateForWeekdayInCurrentWeek = (weekday: Weekday, referenceDate: Date): string => {
  const start = startOfWeek(referenceDate);
  const target = addDays(start, weekdayOrder.indexOf(weekday));
  return formatDate(target);
};
