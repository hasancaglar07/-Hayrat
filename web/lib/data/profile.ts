import { createSupabaseAdminClient, createSupabaseServerClient } from "../supabase/server";
import { UserProfile } from "../core/types";
import { defaultLocale, locales } from "@/i18n/config";

const DEFAULT_DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const fallbackProfile: UserProfile = {
  id: DEFAULT_DEMO_USER_ID,
  nickname: "Reader",
  appLanguage: "tr",
  targetReadingDaysPerWeek: 7,
  khatmDurationDays: 7,
  showInGlobalRanking: false,
  countryCode: "TR",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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

const mapProfile = (row: ProfileRow): UserProfile => {
  const rawLanguage = row.app_language ?? defaultLocale;
  const appLanguage = (locales as readonly string[]).includes(rawLanguage)
    ? (rawLanguage as UserProfile["appLanguage"])
    : defaultLocale;

  return {
    id: row.id,
    nickname: row.nickname ?? "Reader",
    appLanguage,
    targetReadingDaysPerWeek: row.target_reading_days_per_week ?? 7,
    khatmDurationDays: row.khatm_duration_days ?? 7,
    showInGlobalRanking: Boolean(row.show_in_global_ranking),
    countryCode: row.country_code ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
    onboardingCompleted: Boolean(row.onboarding_completed ?? false),
  };
};

const isMissingTableError = (error: unknown) => (error as { code?: string } | null)?.code === "PGRST205";
const isAbortError = (error: unknown) => {
  const err = error as { name?: string; cause?: { name?: string }; message?: string; details?: string } | null;
  if (!err) return false;
  if (err.name === "AbortError" || err.cause?.name === "AbortError") return true;
  const message = String(err.message ?? "");
  const details = String(err.details ?? "");
  return message.includes("AbortError") || details.includes("AbortError") || message.toLowerCase().includes("aborted");
};

export const getOrCreateProfile = async (userId: string): Promise<UserProfile> => {
  const client = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!client) return fallbackProfile;

  const { data, error } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    if (isMissingTableError(error) || isAbortError(error)) return fallbackProfile;
    console.error("getOrCreateProfile error", error);
  }
  if (data) return mapProfile(data as ProfileRow);

  const now = new Date().toISOString();
  const profile: UserProfile = {
    id: userId,
    nickname: fallbackProfile.nickname,
    appLanguage: fallbackProfile.appLanguage,
    targetReadingDaysPerWeek: fallbackProfile.targetReadingDaysPerWeek,
    khatmDurationDays: fallbackProfile.khatmDurationDays,
    showInGlobalRanking: fallbackProfile.showInGlobalRanking,
    createdAt: now,
    updatedAt: now,
  };
  await client.from("profiles").insert({
    id: profile.id,
    nickname: profile.nickname,
    app_language: profile.appLanguage,
    target_reading_days_per_week: profile.targetReadingDaysPerWeek,
    khatm_duration_days: profile.khatmDurationDays,
    show_in_global_ranking: profile.showInGlobalRanking,
    country_code: profile.countryCode,
    onboarding_completed: profile.onboardingCompleted ?? false,
  });

  return profile;
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const client = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!client) return;
  await client
    .from("profiles")
    .upsert({
      id: userId,
      nickname: updates.nickname,
      app_language: updates.appLanguage,
      target_reading_days_per_week: updates.targetReadingDaysPerWeek,
      khatm_duration_days: updates.khatmDurationDays,
      show_in_global_ranking: updates.showInGlobalRanking,
      country_code: updates.countryCode,
      onboarding_completed: updates.onboardingCompleted,
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();
};
