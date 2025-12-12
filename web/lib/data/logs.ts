import { createSupabaseAdminClient, createSupabaseServerClient } from "../supabase/server";
import { DayReadingLog, ReadingMode, UserStats, Weekday } from "../core/types";
import { calculateStreak, isStreakMilestone } from "../core/streak";
import { calculatePoints } from "../core/points";
import { addDays, daysBetween, formatDate, getWeekdayFromDate, isSameMonth, isSameWeek, parseUtcDateString, todayDateString } from "../core/date";
import type { PostgrestError } from "@supabase/supabase-js";

const validModes: ReadingMode[] = ["today", "makeup"];

type ReadingLogRow = {
  date: string;
  weekday: Weekday;
  mode: ReadingMode;
  completed: boolean;
  points_earned?: number | null;
  completed_at?: string | null;
  section_ids?: string[] | null;
};

const mapLog = (row: ReadingLogRow): DayReadingLog => ({
  date: row.date,
  weekday: row.weekday as Weekday,
  mode: validModes.includes(row.mode) ? row.mode : "today",
  completed: Boolean(row.completed),
  pointsEarned: Number(row.points_earned ?? 0),
  completedAt: row.completed_at ?? undefined,
  sectionIds: row.section_ids ?? [],
});

const isMissingTableError = (error: unknown) => (error as { code?: string } | null)?.code === "PGRST205";
const isAbortError = (error: unknown) => {
  const err = error as { name?: string; cause?: { name?: string }; message?: string; details?: string } | null;
  if (!err) return false;
  if (err.name === "AbortError" || err.cause?.name === "AbortError") return true;
  const message = String(err.message ?? "");
  const details = String(err.details ?? "");
  return message.includes("AbortError") || details.includes("AbortError") || message.toLowerCase().includes("aborted");
};

const fetchReadingLogsForUserWithClient = async (
  client: ReturnType<typeof createSupabaseServerClient> | ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
): Promise<DayReadingLog[]> => {
  if (!client) return [];

  const { data, error } = await client.from("reading_logs").select("*").eq("user_id", userId).order("date", { ascending: true });
  if (error) {
    if (!isMissingTableError(error) && !isAbortError(error)) {
      console.error("getReadingLogsForUser error", error);
    }
    return [];
  }

  return ((data ?? []) as ReadingLogRow[]).map(mapLog);
};

export const getReadingLogsForUser = async (userId: string) => {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    return fetchReadingLogsForUserWithClient(adminClient, userId);
  }

  const serverClient = createSupabaseServerClient();
  return fetchReadingLogsForUserWithClient(serverClient, userId);
};

export const insertReadingLog = async (userId: string, log: DayReadingLog) => {
  const client = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!client) return { ok: false as const, error: { message: "Supabase client is not configured" } as PostgrestError };

  const { error } = await client.from("reading_logs").upsert(
    {
      user_id: userId,
      date: log.date,
      weekday: log.weekday,
      mode: log.mode,
      completed: log.completed,
      points_earned: log.pointsEarned,
      completed_at: log.completedAt,
      section_ids: log.sectionIds ?? [],
    },
    { onConflict: "user_id,date" },
  );

  if (error && !isMissingTableError(error) && !isAbortError(error)) {
    console.error("insertReadingLog error", error);
  }
  return { ok: !error, error: error ?? undefined } as const;
};

export const computeUserStats = (logs: DayReadingLog[], options?: { today?: string }): UserStats => {
  const completedLogs = logs
    .filter((l) => l.completed)
    .sort((a, b) => {
      const aTs = parseUtcDateString(a.date).getTime();
      const bTs = parseUtcDateString(b.date).getTime();
      return aTs - bTs;
    });

  const lastCompletedDate = completedLogs.length ? completedLogs[completedLogs.length - 1].date : undefined;
  const today = options?.today ?? todayDateString();
  const now = parseUtcDateString(today);
  const streak = calculateStreak(completedLogs);
  const currentStreakDays = lastCompletedDate && daysBetween(lastCompletedDate, today) > 1 ? 0 : streak.currentStreakDays;
  const longestStreakDays = streak.longestStreakDays;
  const totals = completedLogs.reduce(
    (acc, log) => {
      const dateObj = parseUtcDateString(log.date);
      acc.totalPoints += log.pointsEarned ?? 0;
      acc.totalReadings += 1;
      if (isSameWeek(dateObj, now)) acc.weeklyPoints += log.pointsEarned ?? 0;
      if (isSameMonth(dateObj, now)) acc.monthlyPoints += log.pointsEarned ?? 0;
      return acc;
    },
    { totalPoints: 0, totalReadings: 0, weeklyPoints: 0, monthlyPoints: 0 },
  );

  return {
    totalPoints: totals.totalPoints,
    currentStreakDays,
    longestStreakDays,
    totalReadings: totals.totalReadings,
    weeklyPoints: totals.weeklyPoints,
    monthlyPoints: totals.monthlyPoints,
    lastCompletedDate,
  };
};

export const getMissedLogs = (logs: DayReadingLog[], lookBackDays = 30, targetPerWeek = 7, options?: { startDate?: string; today?: string }) => {
  const today = options?.today ?? todayDateString();
  const startDate = options?.startDate && /^\d{4}-\d{2}-\d{2}$/.test(options.startDate) ? options.startDate : undefined;
  if (startDate && startDate > today) return [];

  const windowStart = formatDate(addDays(parseUtcDateString(today), -lookBackDays));
  const effectiveStart = startDate && startDate > windowStart ? startDate : windowStart;
  const elapsedDays = Math.max(0, daysBetween(effectiveStart, today));
  if (elapsedDays === 0) return [];

  const completedInWindow = logs.filter((l) => {
    if (!l.completed) return false;
    const diffDays = daysBetween(l.date, today);
    if (diffDays < 1 || diffDays > lookBackDays) return false;
    if (startDate && l.date < startDate) return false;
    return true;
  });
  const completedMap = new Set(completedInWindow.map((l) => l.date));

  const weeklyTarget = Math.max(1, Math.min(7, targetPerWeek || 7));
  const expectedCompletions = Math.ceil((elapsedDays / 7) * weeklyTarget);
  const shortfall = Math.max(0, expectedCompletions - completedMap.size);
  if (shortfall === 0) return [];

  const missed: { date: string; weekday: Weekday }[] = [];
  const base = parseUtcDateString(today);
  for (let i = 1; i <= lookBackDays && missed.length < shortfall; i += 1) {
    const dateStr = formatDate(addDays(base, -i));
    if (dateStr < effectiveStart) break;
    if (!completedMap.has(dateStr)) {
      missed.push({ date: dateStr, weekday: getWeekdayFromDate(dateStr) });
    }
  }
  return missed;
};

export const buildLogWithPoints = (params: {
  mode: ReadingMode;
  date: string;
  weekday: Weekday;
  completedAt?: string;
  allWeekComplete: boolean;
  currentStreak: number;
}) => {
  const points = calculatePoints({ mode: params.mode, allWeekComplete: params.allWeekComplete, isStreakMilestone: isStreakMilestone(params.currentStreak) });
  const completedAt = params.completedAt ?? new Date().toISOString();
  return {
    date: params.date,
    weekday: params.weekday,
    mode: params.mode,
    completed: true,
    pointsEarned: points,
    completedAt,
  } as DayReadingLog;
};

export const findConsecutiveDays = (logs: DayReadingLog[]) => {
  const lastCompleted = logs
    .filter((l) => l.completed)
    .map((l) => l.date)
    .sort()
    .pop();
  const diff = lastCompleted ? daysBetween(lastCompleted, todayDateString()) : null;
  return { lastCompleted, daysSinceLast: diff };
};
