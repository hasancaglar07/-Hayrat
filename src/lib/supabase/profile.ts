import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import type { UserProfile } from "../../data/types";
import { getDefaultAppLanguage } from "../../utils/deviceLanguage";

type ProfileRow = {
  id: string;
  nickname?: string | null;
  app_language?: string | null;
  target_reading_days_per_week?: number | null;
  khatm_duration_days?: number | null;
  show_in_global_ranking?: boolean | null;
  country_code?: string | null;
  onboarding_completed?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const isMissingTableError = (error: PostgrestError | null) => error?.code === "PGRST205";

const mapProfile = (row: ProfileRow): UserProfile => {
  const language = (row.app_language as UserProfile["appLanguage"]) || getDefaultAppLanguage();
  return {
    id: row.id,
    nickname: row.nickname ?? "Reader",
    appLanguage: language,
    targetReadingDaysPerWeek: row.target_reading_days_per_week ?? 7,
    khatmDurationDays: row.khatm_duration_days ?? 7,
    showInGlobalRanking: Boolean(row.show_in_global_ranking),
    countryCode: row.country_code ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
    onboardingCompleted: Boolean(row.onboarding_completed ?? false),
  };
};

export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    if (!isMissingTableError(error)) {
      console.warn("fetchProfile error", error.message);
    }
    return null;
  }
  if (!data) return null;
  return mapProfile(data as ProfileRow);
};

export const upsertProfile = async (profile: UserProfile) => {
  if (!supabase) return;
  const payload = {
    id: profile.id,
    nickname: profile.nickname,
    app_language: profile.appLanguage,
    target_reading_days_per_week: profile.targetReadingDaysPerWeek,
    khatm_duration_days: profile.khatmDurationDays,
    show_in_global_ranking: profile.showInGlobalRanking,
    country_code: profile.countryCode,
    onboarding_completed: profile.onboardingCompleted ?? false,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("profiles").upsert(payload);
  if (error && !isMissingTableError(error)) {
    console.warn("upsertProfile error", error.message);
  }
};

export const ensureProfileExists = async (userId: string, fallback?: Partial<UserProfile>): Promise<UserProfile | null> => {
  const existing = await fetchProfile(userId);
  if (existing) return existing;
  const now = new Date().toISOString();
  const created: UserProfile = {
    id: userId,
    nickname: fallback?.nickname ?? "Reader",
    appLanguage: fallback?.appLanguage ?? getDefaultAppLanguage(),
    targetReadingDaysPerWeek: fallback?.targetReadingDaysPerWeek ?? 7,
    khatmDurationDays: fallback?.khatmDurationDays ?? 7,
    showInGlobalRanking: fallback?.showInGlobalRanking ?? false,
    countryCode: fallback?.countryCode,
    createdAt: now,
    updatedAt: now,
    onboardingCompleted: fallback?.onboardingCompleted,
  };
  await upsertProfile(created);
  return created;
};
