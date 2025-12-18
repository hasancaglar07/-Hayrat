import type { DayReadingLog, ReadingMode } from "../data/types";
import { BASE_POINTS_MAKEUP, BASE_POINTS_TODAY, WEEKLY_BONUS_POINTS, calculatePoints } from "./points";
import { calculateStreak, isStreakMilestone } from "./streak";
import { getWeekdayFromDate, isSameWeek, parseDateString, todayDateString } from "./date";

const clampWeeklyTarget = (target: number): number => {
  const normalized = Number.isFinite(target) ? Math.floor(target) : 7;
  return Math.max(1, Math.min(7, normalized || 7));
};

const logHasWeeklyBonus = (log: DayReadingLog): boolean => {
  const base = log.mode === "today" ? BASE_POINTS_TODAY : BASE_POINTS_MAKEUP;
  return log.pointsEarned - base >= WEEKLY_BONUS_POINTS;
};

export const resolveReadingMode = (params: { completionDate: string; mode?: ReadingMode }): ReadingMode => {
  if (params.mode) return params.mode;
  return params.completionDate === todayDateString() ? "today" : "makeup";
};

export const getReadingRewardPreview = (params: {
  logs: DayReadingLog[];
  completionDate: string; // YYYY-MM-DD
  mode?: ReadingMode;
  weeklyTarget: number;
  completedAt?: string;
}): { pointsEarned: number; weeklyBonusEarnedNow: boolean; streakBonusEarnedNow: boolean } => {
  const weeklyTarget = clampWeeklyTarget(params.weeklyTarget);
  const completedAt = params.completedAt || new Date().toISOString();
  const resolvedMode = resolveReadingMode({ completionDate: params.completionDate, mode: params.mode });

  const logsWithoutCurrent = params.logs.filter((l) => l.date !== params.completionDate);
  const completionDateObj = parseDateString(params.completionDate);
  const inCurrentWeek = isSameWeek(completionDateObj, new Date());
  const completedThisWeekBefore = new Set(
    logsWithoutCurrent
      .filter((l) => l.completed && isSameWeek(parseDateString(l.date), completionDateObj))
      .map((l) => l.date)
  );
  const completedThisWeekAfterCount = completedThisWeekBefore.size + 1;
  const weeklyBonusAlreadyAwarded =
    inCurrentWeek &&
    logsWithoutCurrent.some(
      (log) => log.completed && isSameWeek(parseDateString(log.date), completionDateObj) && logHasWeeklyBonus(log)
    );
  const weeklyBonusEarnedNow =
    inCurrentWeek &&
    !weeklyBonusAlreadyAwarded &&
    completedThisWeekBefore.size < weeklyTarget &&
    completedThisWeekAfterCount >= weeklyTarget;

  const prospectiveLog: DayReadingLog = {
    date: params.completionDate,
    weekday: getWeekdayFromDate(params.completionDate),
    mode: resolvedMode,
    completed: true,
    pointsEarned: 0,
    completedAt,
  };

  const streakBefore = calculateStreak(logsWithoutCurrent);
  const streakAfter = calculateStreak([...logsWithoutCurrent, prospectiveLog]);
  const streakBonusEarnedNow =
    isStreakMilestone(streakAfter.currentStreakDays) && !isStreakMilestone(streakBefore.currentStreakDays);

  const pointsEarned = calculatePoints({
    mode: resolvedMode,
    allWeekComplete: weeklyBonusEarnedNow,
    isStreakMilestone: streakBonusEarnedNow,
  });

  return { pointsEarned, weeklyBonusEarnedNow, streakBonusEarnedNow };
};

