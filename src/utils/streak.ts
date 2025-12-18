import type { DayReadingLog } from "../data/types";
import { daysBetween, formatDate } from "./date";
import { STREAK_MILESTONE_INTERVAL } from "./points";

const getEffectiveDate = (log: DayReadingLog): string => {
  if (log.completedAt) return formatDate(new Date(log.completedAt));
  return log.date;
};

export const calculateStreak = (logs: DayReadingLog[]) => {
  const completed = logs.filter((l) => l.completed);
  const uniqueDates = Array.from(new Set(completed.map(getEffectiveDate))).sort((a, b) => (a < b ? -1 : 1));
  let current = 0;
  let longest = 0;
  let lastDate: string | null = null;

  uniqueDates.forEach((date) => {
    if (!lastDate) {
      current = 1;
    } else {
      const diff = daysBetween(lastDate, date);
      current = diff === 1 ? current + 1 : 1;
    }
    longest = Math.max(longest, current);
    lastDate = date;
  });

  return { currentStreakDays: current, longestStreakDays: longest };
};

export const isStreakMilestone = (currentStreak: number): boolean => {
  return currentStreak > 0 && currentStreak % STREAK_MILESTONE_INTERVAL === 0;
};

