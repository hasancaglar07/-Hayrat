import { createSupabaseAdminClient, createSupabaseServerClient } from "../supabase/server";
import { AppSettings, ReadingSettings, ContentLanguage } from "../core/types";

const defaultReadingSettings: ReadingSettings = {
  fontSize: 18,
  lineHeightMultiplier: 1.4,
  theme: "light",
  autoScroll: false,
  autoScrollSpeed: 40,
  screenLock: false,
  hapticsEnabled: true,
  contentLanguages: ["arabic", "transliteration", "tr"],
};

const defaultAppSettings: AppSettings = {
  language: "tr",
  notificationsEnabled: false,
  notificationTime: "21:00",
  remindMissedDays: false,
  themePreference: "light",
  missedReminderDay: 1,
  missedReminderHour: 20,
  missedReminderMinute: 0,
};

const normalizeContentLanguages = (langs: ContentLanguage[] | undefined, appLanguage: AppSettings["language"]): ContentLanguage[] => {
  const base: ContentLanguage[] = ["arabic", "transliteration"];
  const unique = Array.from(new Set([...(langs || []), ...base].filter(Boolean))) as ContentLanguage[];
  if (unique.length > 0) return unique;
  return [...base, appLanguage];
};

type ReadingSettingsRowShape = {
  content_languages?: unknown;
  show_arabic?: unknown;
  show_transliteration?: unknown;
  show_translation?: unknown;
};

const deriveContentLanguagesFromRow = (row: ReadingSettingsRowShape | null | undefined, appLanguage: AppSettings["language"]): ContentLanguage[] => {
  if (Array.isArray(row?.content_languages) && row.content_languages.length) {
    return normalizeContentLanguages(row.content_languages as ContentLanguage[], appLanguage);
  }
  const list: ContentLanguage[] = [];
  const showArabic = typeof row?.show_arabic === "boolean" ? row.show_arabic : true;
  const showTransliteration = typeof row?.show_transliteration === "boolean" ? row.show_transliteration : true;
  const showTranslation = typeof row?.show_translation === "boolean" ? row.show_translation : true;
  if (showArabic) list.push("arabic");
  if (showTransliteration) list.push("transliteration");
  if (showTranslation) list.push(appLanguage);
  return normalizeContentLanguages(list, appLanguage);
};

const fetchUserSettingsWithClient = async (
  client: ReturnType<typeof createSupabaseServerClient> | ReturnType<typeof createSupabaseAdminClient>,
  userId: string,
): Promise<{ appSettings: AppSettings; readingSettings: ReadingSettings }> => {
  if (!client) return { appSettings: defaultAppSettings, readingSettings: defaultReadingSettings };

  const [appRes, readingRes] = await Promise.all([
    client.from("app_settings").select("*").eq("user_id", userId).maybeSingle(),
    client.from("reading_settings").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  const appSettings: AppSettings = appRes.data
    ? {
        language: appRes.data.language ?? defaultAppSettings.language,
        notificationsEnabled: Boolean(appRes.data.notifications_enabled),
        notificationTime: appRes.data.notification_time ?? undefined,
        remindMissedDays: Boolean(appRes.data.remind_missed_days),
        themePreference: (appRes.data.theme_preference as AppSettings["themePreference"]) ?? defaultAppSettings.themePreference,
        missedReminderDay: appRes.data.missed_reminder_day ?? defaultAppSettings.missedReminderDay,
        missedReminderHour: appRes.data.missed_reminder_hour ?? defaultAppSettings.missedReminderHour,
        missedReminderMinute: appRes.data.missed_reminder_minute ?? defaultAppSettings.missedReminderMinute,
      }
    : defaultAppSettings;

  const readingSettings: ReadingSettings = readingRes.data
    ? {
        fontSize: readingRes.data.font_size ?? defaultReadingSettings.fontSize,
        lineHeightMultiplier: Number(readingRes.data.line_height ?? defaultReadingSettings.lineHeightMultiplier),
        theme: (readingRes.data.theme as ReadingSettings["theme"]) ?? defaultReadingSettings.theme,
        autoScroll: Boolean(readingRes.data.auto_scroll ?? defaultReadingSettings.autoScroll),
        autoScrollSpeed: Number(readingRes.data.auto_scroll_speed ?? defaultReadingSettings.autoScrollSpeed),
        screenLock: Boolean(readingRes.data.screen_lock ?? defaultReadingSettings.screenLock),
        hapticsEnabled: Boolean(readingRes.data.haptics_enabled ?? defaultReadingSettings.hapticsEnabled),
        contentLanguages: deriveContentLanguagesFromRow(readingRes.data, appSettings.language),
      }
    : defaultReadingSettings;

  return { appSettings, readingSettings };
};

export const getUserSettings = async (userId: string) => {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    return fetchUserSettingsWithClient(adminClient, userId);
  }

  const serverClient = createSupabaseServerClient();
  return fetchUserSettingsWithClient(serverClient, userId);
};

export const updateUserSettings = async (userId: string, params: { appSettings?: Partial<AppSettings>; readingSettings?: Partial<ReadingSettings> }) => {
  const client = createSupabaseServerClient();
  const effectiveClient = createSupabaseAdminClient() ?? client;
  if (!effectiveClient) return;

  const promises: PromiseLike<unknown>[] = [];

  if (params.appSettings) {
    const app = params.appSettings;
    promises.push(
      effectiveClient.from("app_settings").upsert({
        user_id: userId,
        language: app.language,
        notifications_enabled: app.notificationsEnabled,
        notification_time: app.notificationTime,
        remind_missed_days: app.remindMissedDays,
        theme_preference: app.themePreference,
        missed_reminder_day: app.missedReminderDay,
        missed_reminder_hour: app.missedReminderHour,
        missed_reminder_minute: app.missedReminderMinute,
      }),
    );
  }

  if (params.readingSettings) {
    const reading = params.readingSettings;
    const appLanguage: AppSettings["language"] = params.appSettings?.language ?? defaultAppSettings.language;
    const langs = normalizeContentLanguages(reading.contentLanguages, appLanguage);
    const showArabic = langs.includes("arabic");
    const showTransliteration = langs.includes("transliteration");
    const showTranslation = langs.some((l) => l !== "arabic" && l !== "transliteration");
    promises.push(
      effectiveClient.from("reading_settings").upsert({
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
      }),
    );
  }

  await Promise.all(promises);
};

export { defaultAppSettings, defaultReadingSettings };
