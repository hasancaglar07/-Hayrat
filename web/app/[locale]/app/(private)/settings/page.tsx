import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMessages, type Locale } from "@/i18n/config";
import { supportedMobileLocales } from "@/i18n/mobile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { defaultAppSettings, defaultReadingSettings, getUserSettings, updateUserSettings } from "@/lib/data/settings";
import type { AppSettings, ContentLanguage, ThemeMode } from "@/lib/core/types";
import { getCurrentUser } from "@/lib/auth/server";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/settings",
    title: `${t.brand} | ${t.nav.settings}`,
    description: t.settings.title,
    noindex: true,
  });
}

export default async function SettingsPage({ params, searchParams }: { params: { locale: Locale }; searchParams?: { next?: string } }) {
  const t = getMessages(params.locale);
  const anyT = t as unknown as {
    settings?: {
      app?: {
        missedReminderDay?: string;
        missedReminderTime?: string;
      };
      reading?: {
        autoScrollSpeed?: string;
        screenLock?: string;
        haptics?: string;
      };
    };
  };
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const { appSettings, readingSettings } = await getUserSettings(userId);
  const languageOptions = supportedMobileLocales as readonly string[];
  const selectedLanguage = languageOptions.includes(appSettings.language) ? appSettings.language : defaultAppSettings.language;
  const showArabicDefault = readingSettings.contentLanguages?.includes("arabic") ?? false;
  const showTransliterationDefault = readingSettings.contentLanguages?.includes("transliteration") ?? false;
  const showTranslationDefault =
    readingSettings.contentLanguages?.some((l) => l !== "arabic" && l !== "transliteration") ?? true;

  const saveSettings = async (formData: FormData) => {
    "use server";
    const rawLanguage = String(formData.get("language") ?? params.locale);
    const allowedLocales = supportedMobileLocales as readonly string[];
    const language = (allowedLocales.includes(rawLanguage) ? rawLanguage : defaultAppSettings.language) as Locale;
    const notificationsEnabled = formData.get("notificationsEnabled") === "on";
    const remindMissedDays = formData.get("remindMissedDays") === "on";
    const notificationTime = (formData.get("notificationTime") as string) || defaultAppSettings.notificationTime;
    const themePreference =
      (formData.get("themePreference") as AppSettings["themePreference"] | null) ?? defaultAppSettings.themePreference;
    const missedReminderDay = Number(formData.get("missedReminderDay") ?? defaultAppSettings.missedReminderDay ?? 1);
    const missedReminderTime = (formData.get("missedReminderTime") as string) || `${defaultAppSettings.missedReminderHour ?? 20}:${defaultAppSettings.missedReminderMinute ?? 0}`;
    const [missedHourRaw, missedMinuteRaw] = missedReminderTime.split(":");
    const missedReminderHour = Math.min(23, Math.max(0, Number(missedHourRaw) || (defaultAppSettings.missedReminderHour ?? 20)));
    const missedReminderMinute = Math.min(59, Math.max(0, Number(missedMinuteRaw) || (defaultAppSettings.missedReminderMinute ?? 0)));

    const fontSize = Number(formData.get("fontSize") ?? defaultReadingSettings.fontSize);
    const lineHeightMultiplier = Number(formData.get("lineHeightMultiplier") ?? defaultReadingSettings.lineHeightMultiplier);
    const showArabic = formData.get("showArabic") === "on";
    const showTransliteration = formData.get("showTransliteration") === "on";
    const showTranslation = formData.get("showTranslation") === "on";
    const autoScroll = formData.get("autoScroll") === "on";
    const autoScrollSpeed = Number(formData.get("autoScrollSpeed") ?? defaultReadingSettings.autoScrollSpeed ?? 40);
    const screenLock = formData.get("screenLock") === "on";
    const hapticsEnabled = formData.get("hapticsEnabled") === "on";
    const theme = (formData.get("readingTheme") as ThemeMode | null) ?? defaultReadingSettings.theme;
    const contentLanguages: ContentLanguage[] = [
      ...(showArabic ? (["arabic"] as ContentLanguage[]) : []),
      ...(showTransliteration ? (["transliteration"] as ContentLanguage[]) : []),
      ...(showTranslation ? ([language as ContentLanguage] as ContentLanguage[]) : []),
    ];

    const user = await getCurrentUser();
    if (!user) return;
    await updateUserSettings(user.id, {
      appSettings: { language, notificationsEnabled, remindMissedDays, notificationTime, themePreference, missedReminderDay, missedReminderHour, missedReminderMinute },
      readingSettings: { fontSize, lineHeightMultiplier, autoScroll, autoScrollSpeed, screenLock, hapticsEnabled, theme, contentLanguages },
    });

    cookies().set("theme-preference", themePreference ?? defaultAppSettings.themePreference ?? "light", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    const rawNext = formData.get("next");
    const nextBase = typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
    if (!nextBase) {
      redirect(`/${language}/app/settings`);
    }

    const parts = nextBase.split("/");
    const nextLocale = parts.length > 2 && allowedLocales.includes(parts[1]) ? parts[1] : null;
    const next = nextLocale ? `/${language}/${parts.slice(2).join("/")}` : nextBase;
    redirect(next);
  };

  return (
    <form action={saveSettings} className="space-y-8">
      <input type="hidden" name="next" value={searchParams?.next ?? ""} />
      <Card>
	        <CardContent className="p-6">
	        <div className="mb-4">
	          <p className="text-sm font-semibold text-primary">{t.settings.title}</p>
	          <h1 className="page-title">{t.settings.app.title}</h1>
	        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {t.settings.app.language}
            <select
              name="language"
              defaultValue={selectedLanguage}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            >
              {languageOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {t.settings.app.theme}
            <select
              name="themePreference"
              defaultValue={appSettings.themePreference}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            >
              <option value="system">{t.common.themeOptions.system}</option>
              <option value="light">{t.common.themeOptions.light}</option>
              <option value="dark">{t.common.themeOptions.dark}</option>
              <option value="sepia">{t.common.themeOptions.sepia}</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="notificationsEnabled" defaultChecked={appSettings.notificationsEnabled} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {t.settings.app.notifications}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="remindMissedDays" defaultChecked={appSettings.remindMissedDays} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {t.settings.app.remindMissed}
          </label>

          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {anyT.settings?.app?.missedReminderDay ?? "Missed reminder day"}
            <select
              name="missedReminderDay"
              defaultValue={appSettings.missedReminderDay ?? 1}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            >
              {t.days.map((label, idx) => (
                <option key={label} value={idx + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {anyT.settings?.app?.missedReminderTime ?? "Missed reminder time"}
            <input
              type="time"
              name="missedReminderTime"
              defaultValue={`${String(appSettings.missedReminderHour ?? 20).padStart(2, "0")}:${String(appSettings.missedReminderMinute ?? 0).padStart(2, "0")}`}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {t.settings.app.notificationTime}
            <input
              type="time"
              name="notificationTime"
              defaultValue={appSettings.notificationTime ?? defaultAppSettings.notificationTime ?? "21:00"}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            />
          </label>
        </div>
        </CardContent>
      </Card>

      <Card>
	        <CardContent className="p-6">
	        <div className="mb-4">
	          <p className="text-sm font-semibold text-primary">{t.settings.reading.title}</p>
	          <h2 className="section-title">{t.settings.reading.title}</h2>
	        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-text-dark">
            {t.settings.reading.fontSize}
            <input
              type="range"
              name="fontSize"
              min={16}
              max={28}
              defaultValue={readingSettings.fontSize}
              className="w-full accent-primary"
            />
            <span className="text-micro text-text-medium">{readingSettings.fontSize}px</span>
          </label>

          <label className="space-y-2 text-sm font-semibold text-text-dark">
            {t.settings.reading.lineHeight}
            <input
              type="range"
              name="lineHeightMultiplier"
              min={1.2}
              max={2}
              step={0.1}
              defaultValue={readingSettings.lineHeightMultiplier}
              className="w-full accent-primary"
            />
            <span className="text-micro text-text-medium">{readingSettings.lineHeightMultiplier}x</span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="showArabic" defaultChecked={showArabicDefault} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {t.settings.reading.showArabic}
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input
              type="checkbox"
              name="showTransliteration"
              defaultChecked={showTransliterationDefault}
              className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            {t.settings.reading.showTransliteration}
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input
              type="checkbox"
              name="showTranslation"
              defaultChecked={showTranslationDefault}
              className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            {t.settings.reading.showTranslation}
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="autoScroll" defaultChecked={readingSettings.autoScroll} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {t.settings.reading.autoScroll}
          </label>

          <label className="space-y-2 text-sm font-semibold text-text-dark">
            {anyT.settings?.reading?.autoScrollSpeed ?? "Scroll speed"}
            <input
              type="range"
              name="autoScrollSpeed"
              min={10}
              max={120}
              step={5}
              defaultValue={readingSettings.autoScrollSpeed ?? defaultReadingSettings.autoScrollSpeed ?? 40}
              className="w-full accent-primary"
            />
            <span className="text-micro text-text-medium">{readingSettings.autoScrollSpeed ?? 40}px/s</span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="screenLock" defaultChecked={readingSettings.screenLock} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {anyT.settings?.reading?.screenLock ?? "Keep screen awake (mobile only)"}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-semibold text-text-dark shadow-sm dark:bg-background-offwhite">
            <input type="checkbox" name="hapticsEnabled" defaultChecked={readingSettings.hapticsEnabled} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
            {anyT.settings?.reading?.haptics ?? "Haptics (mobile only)"}
          </label>

          <label className="space-y-1 text-sm font-semibold text-text-dark">
            {t.settings.reading.theme}
            <select
              name="readingTheme"
              defaultValue={readingSettings.theme}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-dark shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background dark:bg-background-dark"
            >
              <option value="light">{t.common.themeOptions.light}</option>
              <option value="dark">{t.common.themeOptions.dark}</option>
              <option value="sepia">{t.common.themeOptions.sepia}</option>
            </select>
          </label>
        </div>
        </CardContent>
      </Card>

      <SubmitButton label={t.settings.save} loadingLabel={t.common.saving} />
    </form>
  );
}
