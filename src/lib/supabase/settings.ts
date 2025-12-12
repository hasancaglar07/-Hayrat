import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import type { AppLanguage, AppSettings, ContentLanguage, ReadingSettings } from "../../data/types";
import { getDefaultAppLanguage } from "../../utils/deviceLanguage";

type AppSettingsRow = {
  user_id: string;
  language?: string | null;
  notifications_enabled?: boolean | null;
  notification_time?: string | null;
  remind_missed_days?: boolean | null;
  theme_preference?: string | null;
  missed_reminder_day?: number | null;
  missed_reminder_hour?: number | null;
  missed_reminder_minute?: number | null;
};

type ReadingSettingsRow = {
  user_id: string;
  font_size?: number | null;
  line_height?: number | null;
  theme?: string | null;
  content_languages?: string[] | null;
  show_arabic?: boolean | null;
  show_transliteration?: boolean | null;
  show_translation?: boolean | null;
  auto_scroll?: boolean | null;
  auto_scroll_speed?: number | null;
  screen_lock?: boolean | null;
  haptics_enabled?: boolean | null;
};

const isMissingTableError = (error: PostgrestError | null) => error?.code === "PGRST205";

const defaultAppSettings: AppSettings = {
  language: getDefaultAppLanguage(),
  notificationsEnabled: false,
  remindMissedDays: false,
  notificationTime: "21:00",
  missedReminderDay: 1,
  missedReminderHour: 20,
  missedReminderMinute: 0,
  themePreference: "system",
};

const defaultReadingSettings: ReadingSettings = {
  fontSize: 18,
  lineHeightMultiplier: 1.4,
  theme: "light",
  contentLanguages: ["arabic", "transliteration", getDefaultAppLanguage()],
  autoScroll: false,
  autoScrollSpeed: 40,
  screenLock: false,
  hapticsEnabled: true,
};

const normalizeContentLanguages = (langs: ContentLanguage[] | undefined, appLanguage: AppLanguage): ContentLanguage[] => {
  const base: ContentLanguage[] = ["arabic", "transliteration"];
  const unique = Array.from(new Set([...(langs || []), ...base].filter(Boolean))) as ContentLanguage[];
  if (unique.length > 0) return unique;
  return [...base, appLanguage];
};

const deriveContentLanguagesFromRow = (row: any, appLanguage: AppLanguage): ContentLanguage[] => {
  if (Array.isArray(row?.content_languages) && row.content_languages.length) {
    return normalizeContentLanguages(row.content_languages as ContentLanguage[], appLanguage);
  }
  const list: ContentLanguage[] = [];
  const showArabic = row?.show_arabic ?? true;
  const showTransliteration = row?.show_transliteration ?? true;
  const showTranslation = row?.show_translation ?? true;
  if (showArabic) list.push("arabic");
  if (showTransliteration) list.push("transliteration");
  if (showTranslation) list.push(appLanguage);
  return normalizeContentLanguages(list, appLanguage);
};

export const fetchSettings = async (
  userId: string,
): Promise<{ appSettings: AppSettings; readingSettings: Partial<ReadingSettings>; hasRemoteApp: boolean; hasRemoteReading: boolean } | null> => {
  if (!supabase) return null;
  const [appRes, readingRes] = await Promise.all([
    supabase.from("app_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("reading_settings").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  if (appRes.error && !isMissingTableError(appRes.error)) {
    console.warn("fetchSettings app error", appRes.error.message);
  }
  if (readingRes.error && !isMissingTableError(readingRes.error)) {
    console.warn("fetchSettings reading error", readingRes.error.message);
  }

  const hasRemoteApp = Boolean(appRes.data);
  const hasRemoteReading = Boolean(readingRes.data);

  const appSettings: AppSettings = hasRemoteApp
    ? {
        language: (appRes.data.language as AppSettings["language"]) ?? defaultAppSettings.language,
        notificationsEnabled: Boolean(appRes.data.notifications_enabled),
        notificationTime: appRes.data.notification_time ?? defaultAppSettings.notificationTime,
        remindMissedDays: Boolean(appRes.data.remind_missed_days),
        themePreference: (appRes.data.theme_preference as AppSettings["themePreference"]) ?? defaultAppSettings.themePreference,
        missedReminderDay: appRes.data.missed_reminder_day ?? defaultAppSettings.missedReminderDay,
        missedReminderHour: appRes.data.missed_reminder_hour ?? defaultAppSettings.missedReminderHour,
        missedReminderMinute: appRes.data.missed_reminder_minute ?? defaultAppSettings.missedReminderMinute,
      }
    : defaultAppSettings;

  const readingSettings: Partial<ReadingSettings> = hasRemoteReading
    ? {
        fontSize: readingRes.data.font_size ?? defaultReadingSettings.fontSize,
        lineHeightMultiplier: Number(readingRes.data.line_height ?? defaultReadingSettings.lineHeightMultiplier),
        theme: (readingRes.data.theme as ReadingSettings["theme"]) ?? defaultReadingSettings.theme,
        autoScroll: Boolean(readingRes.data.auto_scroll ?? defaultReadingSettings.autoScroll),
        autoScrollSpeed: Number(readingRes.data.auto_scroll_speed ?? defaultReadingSettings.autoScrollSpeed),
        screenLock: Boolean(readingRes.data.screen_lock ?? defaultReadingSettings.screenLock),
        hapticsEnabled: Boolean(readingRes.data.haptics_enabled ?? defaultReadingSettings.hapticsEnabled),
        contentLanguages: deriveContentLanguagesFromRow(readingRes.data, appSettings.language),
        showArabic: Boolean(readingRes.data.show_arabic ?? true),
        showTransliteration: Boolean(readingRes.data.show_transliteration ?? true),
        showTranslation: Boolean(readingRes.data.show_translation ?? true),
      } as any
    : {};

  return { appSettings, readingSettings, hasRemoteApp, hasRemoteReading };
};

export const upsertAppSettings = async (userId: string, app: Partial<AppSettings>) => {
  if (!supabase) return;
  const payload: AppSettingsRow = {
    user_id: userId,
    language: app.language,
    notifications_enabled: app.notificationsEnabled,
    notification_time: app.notificationTime,
    remind_missed_days: app.remindMissedDays,
    theme_preference: app.themePreference,
    missed_reminder_day: app.missedReminderDay,
    missed_reminder_hour: app.missedReminderHour,
    missed_reminder_minute: app.missedReminderMinute,
  };
  const { error } = await supabase.from("app_settings").upsert(payload);
  if (error && !isMissingTableError(error)) {
    console.warn("upsertAppSettings error", error.message);
  }
};

export const upsertReadingSettings = async (userId: string, reading: Partial<ReadingSettings>) => {
  if (!supabase) return;
  const langs = reading.contentLanguages;
  const showArabic =
    typeof (reading as any).showArabic === "boolean" ? (reading as any).showArabic : langs?.includes("arabic");
  const showTransliteration =
    typeof (reading as any).showTransliteration === "boolean"
      ? (reading as any).showTransliteration
      : langs?.includes("transliteration");
  const showTranslation =
    typeof (reading as any).showTranslation === "boolean"
      ? (reading as any).showTranslation
      : langs?.some((l) => l !== "arabic" && l !== "transliteration");
  const payload: ReadingSettingsRow = {
    user_id: userId,
    font_size: reading.fontSize,
    line_height: reading.lineHeightMultiplier,
    theme: reading.theme,
    auto_scroll: reading.autoScroll,
    auto_scroll_speed: reading.autoScrollSpeed,
    screen_lock: reading.screenLock,
    haptics_enabled: reading.hapticsEnabled,
    content_languages: langs,
    show_arabic: showArabic,
    show_transliteration: showTransliteration,
    show_translation: showTranslation,
  };
  const { error } = await supabase.from("reading_settings").upsert(payload);
  if (error && !isMissingTableError(error)) {
    console.warn("upsertReadingSettings error", error.message);
  }
};

export { defaultAppSettings, defaultReadingSettings };
