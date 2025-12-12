import type { DayReadingLog } from "./types";
import { daysBetween } from "./date";
import { STREAK_MILESTONE_INTERVAL } from "./points";

const getEffectiveDate = (log: DayReadingLog): string => log.date;

const getEffectiveTimestamp = (log: DayReadingLog): number => {
  return new Date(`${log.date}T00:00:00Z`).getTime();
};

export const calculateStreak = (logs: DayReadingLog[]) => {
  const completed = logs
    .filter((l) => l.completed)
    .sort((a, b) => getEffectiveTimestamp(a) - getEffectiveTimestamp(b));
  let current = 0;
  let longest = 0;
  let lastDate: string | null = null;

  completed.forEach((log) => {
    const effectiveDate = getEffectiveDate(log);
    if (!lastDate) {
      current = 1;
    } else {
      const diff = daysBetween(lastDate, effectiveDate);
      if (diff !== 0) current = diff === 1 ? current + 1 : 1;
    }
    longest = Math.max(longest, current);
    lastDate = effectiveDate;
  });

  return {
    currentStreakDays: current,
    longestStreakDays: longest,
  };
};

export const isStreakMilestone = (currentStreak: number): boolean => {
  return currentStreak > 0 && currentStreak % STREAK_MILESTONE_INTERVAL === 0;
};
