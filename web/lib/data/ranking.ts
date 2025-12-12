import { createSupabaseAdminClient, createSupabaseServerClient } from "../supabase/server";
import type { DayReadingLog, ReadingMode, Weekday } from "../core/types";
import { computeUserStats } from "./logs";

const validModes: ReadingMode[] = ["today", "makeup"];

type ProfileRow = {
  id: string;
  nickname?: string | null;
  country_code?: string | null;
  show_in_global_ranking?: boolean | null;
};

type LogRow = {
  user_id: string;
  date: string;
  weekday: string;
  mode: string;
  completed: boolean;
  points_earned?: number | null;
  completed_at?: string | null;
  section_ids?: string[] | null;
};

const mapLog = (row: LogRow): DayReadingLog => ({
  date: row.date,
  weekday: row.weekday as Weekday,
  mode: validModes.includes(row.mode as ReadingMode) ? (row.mode as ReadingMode) : "today",
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

export type LeaderboardEntry = {
  id: string;
  name: string;
  country?: string;
  points: number;
  streak: number;
  weeklyPoints: number;
  monthlyPoints: number;
};

export const getGlobalLeaderboard = async (limit = 20): Promise<LeaderboardEntry[]> => {
  const client = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!client) return [];

  const maxProfiles = Math.max(limit * 5, 100);
  const { data: profiles, error: profileError } = await client
    .from("profiles")
    .select("id,nickname,country_code,show_in_global_ranking")
    .eq("show_in_global_ranking", true)
    .limit(maxProfiles);

  if (profileError) {
    if (!isMissingTableError(profileError) && !isAbortError(profileError)) {
      console.error("getGlobalLeaderboard profiles error", profileError);
    }
    return [];
  }

  const profileRows = (profiles ?? []) as ProfileRow[];
  const userIds = profileRows.map((p) => p.id).filter(Boolean);
  if (!userIds.length) return [];

  const { data: logs, error: logsError } = await client
    .from("reading_logs")
    .select("user_id,date,weekday,mode,completed,points_earned,completed_at,section_ids")
    .in("user_id", userIds);

  if (logsError && !isMissingTableError(logsError) && !isAbortError(logsError)) {
    console.error("getGlobalLeaderboard logs error", logsError);
  }

  const logsByUser = new Map<string, DayReadingLog[]>();
  ((logs ?? []) as LogRow[]).forEach((row) => {
    const mapped = mapLog(row);
    const existing = logsByUser.get(row.user_id) ?? [];
    existing.push(mapped);
    logsByUser.set(row.user_id, existing);
  });

  const entries: LeaderboardEntry[] = profileRows.map((profile) => {
    const userLogs = logsByUser.get(profile.id) ?? [];
    const stats = computeUserStats(userLogs);
    return {
      id: profile.id,
      name: profile.nickname ?? "Reader",
      country: profile.country_code ?? undefined,
      points: stats.totalPoints,
      streak: stats.currentStreakDays,
      weeklyPoints: stats.weeklyPoints ?? 0,
      monthlyPoints: stats.monthlyPoints ?? 0,
    };
  });

  return entries.sort((a, b) => b.points - a.points).slice(0, limit);
};
