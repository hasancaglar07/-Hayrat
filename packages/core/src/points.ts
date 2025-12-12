import type { ReadingMode } from "./types";

export const BASE_POINTS_TODAY = 10;
export const BASE_POINTS_MAKEUP = 5;
export const WEEKLY_BONUS_POINTS = 20;
export const STREAK_MILESTONE_INTERVAL = 10;
export const STREAK_MILESTONE_BONUS = 5;

export const calculatePoints = (params: { mode: ReadingMode; allWeekComplete: boolean; isStreakMilestone: boolean }): number => {
  let points = params.mode === "today" ? BASE_POINTS_TODAY : BASE_POINTS_MAKEUP;
  if (params.allWeekComplete) points += WEEKLY_BONUS_POINTS;
  if (params.isStreakMilestone) points += STREAK_MILESTONE_BONUS;
  return points;
};

export const getBonusFlags = (params: { allWeekComplete: boolean; isStreakMilestone: boolean }) => ({
  weeklyBonus: params.allWeekComplete,
  streakBonus: params.isStreakMilestone,
});

