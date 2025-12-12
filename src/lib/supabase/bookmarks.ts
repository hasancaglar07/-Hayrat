import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import type { Weekday } from "../../data/types";

type BookmarkRow = {
  user_id: string;
  date: string;
  day_id: string;
  offset: number;
};

const isMissingTableError = (error: PostgrestError | null) => error?.code === "PGRST205";

export const fetchBookmark = async (
  userId: string
): Promise<{ date: string; offset: number; dayId: Weekday } | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from("bookmarks").select("*").eq("user_id", userId).maybeSingle();
  if (error) {
    if (!isMissingTableError(error)) {
      console.warn("fetchBookmark error", error.message);
    }
    return null;
  }
  if (!data) return null;
  const row = data as BookmarkRow;
  return { date: row.date, offset: row.offset ?? 0, dayId: row.day_id as Weekday };
};

export const upsertBookmark = async (
  userId: string,
  payload: { date: string; offset: number; dayId: Weekday }
) => {
  if (!supabase) return;
  const { error } = await supabase
    .from("bookmarks")
    .upsert({ user_id: userId, date: payload.date, day_id: payload.dayId, offset: payload.offset }, { onConflict: "user_id" });
  if (error && !isMissingTableError(error)) {
    console.warn("upsertBookmark error", error.message);
  }
};

