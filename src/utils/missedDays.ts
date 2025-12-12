import { DayReadingLog } from "../data/types";
import { addDays, formatDate } from "./date";

// Determine missed days in a rolling window (see docs/05-reading-experience.md and docs/04-navigation-and-screens.md)
// - Adapted to the user's weekly hedef (targetReadingDaysPerWeek).
// - Only as many "missed" entries as hedefteki eksik sayısı kadar döner; gereksiz uyarı vermez.
export const getMissedDays = (
  logs: DayReadingLog[],
  lookbackDays = 7,
  targetPerWeek = 7
): { date: string; weekday: string }[] => {
  const today = new Date();
  const completedInWindow = logs.filter((l) => {
    if (!l.completed) return false;
    const logDate = new Date(`${l.date}T00:00:00Z`);
    const diffDays = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 1 && diffDays <= lookbackDays;
  });
  const completedMap = new Set(completedInWindow.map((l) => l.date));

  const weeks = Math.max(1, Math.ceil(lookbackDays / 7));
  const weeklyTarget = Math.max(1, Math.min(7, targetPerWeek || 7));
  const expectedCompletions = weeks * weeklyTarget;
  const shortfall = Math.max(0, expectedCompletions - completedMap.size);

  if (shortfall === 0) return [];

  const missed: { date: string; weekday: string }[] = [];
  for (let i = 1; i <= lookbackDays && missed.length < shortfall; i += 1) {
    const date = formatDate(addDays(today, -i));
    if (!completedMap.has(date)) {
      const jsDate = addDays(today, -i);
      const weekday = jsDate.toLocaleDateString("en-US", { weekday: "long" });
      missed.push({ date, weekday });
    }
  }
  return missed;
};
