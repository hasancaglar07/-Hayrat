import { DayReadingLog } from "../data/types";
import { addDays, daysBetween, formatDate, parseDateString } from "./date";

type MissedDaysOptions = {
  startDate?: string;
  includeStartDate?: boolean;
};

const isDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const toUtcDateString = (value: string): string | null => {
  if (!value) return null;
  if (isDateString(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return formatDate(parsed);
};

// Determine missed days in a rolling window (see docs/05-reading-experience.md and docs/04-navigation-and-screens.md)
// - Adapted to the user's weekly hedef (targetReadingDaysPerWeek).
// - Only as many "missed" entries as hedefteki eksik sayısı kadar döner; gereksiz uyarı vermez.
export const getMissedDays = (
  logs: DayReadingLog[],
  lookbackDays = 7,
  targetPerWeek = 7,
  options?: MissedDaysOptions
): { date: string; weekday: string }[] => {
  const safeLookbackDays = Math.max(0, Math.floor(lookbackDays || 0));
  if (safeLookbackDays === 0) return [];

  const today = new Date();
  const todayStr = formatDate(today);
  const lookbackStartStr = formatDate(addDays(today, -safeLookbackDays));
  const normalizedStart = options?.startDate ? toUtcDateString(options.startDate) : null;
  const includeStartDate = options?.includeStartDate === true;
  const effectiveStartStr = (() => {
    if (!normalizedStart) return lookbackStartStr;
    const adjusted = includeStartDate ? normalizedStart : formatDate(addDays(parseDateString(normalizedStart), 1));
    return adjusted > lookbackStartStr ? adjusted : lookbackStartStr;
  })();

  const effectiveWindowDays = Math.max(0, Math.min(safeLookbackDays, daysBetween(effectiveStartStr, todayStr)));

  if (effectiveWindowDays === 0) return [];

  const completedInWindow = logs.filter((l) => {
    if (!l.completed) return false;
    if (l.date >= todayStr) return false; // exclude today/future
    return l.date >= effectiveStartStr;
  });
  const completedMap = new Set(completedInWindow.map((l) => l.date));

  const weeklyTarget = Math.max(1, Math.min(7, targetPerWeek || 7));
  const expectedCompletions = Math.floor((effectiveWindowDays / 7) * weeklyTarget);
  const shortfall = Math.max(0, expectedCompletions - completedMap.size);

  if (shortfall === 0) return [];

  const missed: { date: string; weekday: string }[] = [];
  for (let i = 1; i <= safeLookbackDays && missed.length < shortfall; i += 1) {
    const date = formatDate(addDays(today, -i));
    if (date < effectiveStartStr) break;
    if (!completedMap.has(date)) {
      const jsDate = addDays(today, -i);
      const weekday = jsDate.toLocaleDateString("en-US", { weekday: "long" });
      missed.push({ date, weekday });
    }
  }
  return missed;
};
