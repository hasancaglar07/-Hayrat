import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import type { DayReadingLog, ReadingMode, Weekday } from "../../data/types";

type ReadingLogRow = {
  user_id: string;
  date: string;
  weekday: string;
  mode: string;
  completed: boolean;
  points_earned?: number | null;
  completed_at?: string | null;
  section_ids?: string[] | null;
};

const validModes: ReadingMode[] = ["today", "makeup"];

const isMissingTableError = (error: PostgrestError | null) => error?.code === "PGRST205";

const mapLog = (row: ReadingLogRow): DayReadingLog => ({
  date: row.date,
  weekday: row.weekday as Weekday,
  mode: validModes.includes(row.mode as ReadingMode) ? (row.mode as ReadingMode) : "today",
  completed: Boolean(row.completed),
  pointsEarned: Number(row.points_earned ?? 0),
  completedAt: row.completed_at ?? undefined,
  sectionIds: row.section_ids ?? [],
});

export const fetchLogs = async (userId: string): Promise<DayReadingLog[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reading_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) {
    if (!isMissingTableError(error)) {
      console.warn("fetchLogs error", error.message);
    }
    return [];
  }
  return ((data ?? []) as ReadingLogRow[]).map(mapLog);
};

export const upsertLog = async (userId: string, log: DayReadingLog) => {
  if (!supabase) return;
  const payload = {
    user_id: userId,
    date: log.date,
    weekday: log.weekday,
    mode: log.mode,
    completed: log.completed,
    points_earned: log.pointsEarned,
    completed_at: log.completedAt,
    section_ids: log.sectionIds ?? [],
  };
  const { error } = await supabase.from("reading_logs").upsert(payload, { onConflict: "user_id,date" });
  if (error && !isMissingTableError(error)) {
    console.warn("upsertLog error", error.message);
  }
};

export const upsertLogs = async (userId: string, logs: DayReadingLog[]) => {
  if (!supabase || logs.length === 0) return;
  const payloads = logs.map((log) => ({
    user_id: userId,
    date: log.date,
    weekday: log.weekday,
    mode: log.mode,
    completed: log.completed,
    points_earned: log.pointsEarned,
    completed_at: log.completedAt,
    section_ids: log.sectionIds ?? [],
  }));
  const { error } = await supabase.from("reading_logs").upsert(payloads, { onConflict: "user_id,date" });
  if (error && !isMissingTableError(error)) {
    console.warn("upsertLogs error", error.message);
  }
};

