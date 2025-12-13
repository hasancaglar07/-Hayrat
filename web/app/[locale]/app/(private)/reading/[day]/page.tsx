import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getSectionsForWeekday } from "@/lib/content/readingSections";
import { buildLogWithPoints, getReadingLogsForUser, insertReadingLog } from "@/lib/data/logs";
import { getUserSettings, defaultReadingSettings } from "@/lib/data/settings";
import { getDateForWeekdayInCurrentWeek, getWeekdayFromDate, isSameWeek, parseUtcDateString, daysBetween } from "@/lib/core/date";
import { calculateStreak, isStreakMilestone } from "@/lib/core/streak";
import type { ReadingMode, Weekday } from "@/lib/core/types";
import { BASE_POINTS_MAKEUP, BASE_POINTS_TODAY, STREAK_MILESTONE_BONUS, WEEKLY_BONUS_POINTS } from "@/lib/core/points";
import { getCurrentUser } from "@/lib/auth/server";
import { getOrCreateProfile } from "@/lib/data/profile";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { AutoScroll } from "@/components/reading/AutoScroll";
import { ScrollProgressBar } from "@/components/reading/ScrollProgressBar";
import { BookmarkSync } from "@/components/reading/BookmarkSync";
import { userTodayDateString } from "@/lib/core/userTime";
const validDays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const validModes: ReadingMode[] = ["today", "makeup"];

export async function generateMetadata({ params }: { params: { locale: Locale; day: string } }): Promise<Metadata> {
  const t = getMobileT(params.locale);
  const title = `${t("app.name")} | ${validDays.includes(params.day as Weekday) ? t(`weekday.${params.day}`) : params.day}`;
  return createPageMetadata({
    locale: params.locale,
    path: `/app/reading/${params.day}`,
    title,
    description: t("screen.reading.mode.today"),
    noindex: true,
  });
}

export default async function ReadingPage({ params, searchParams }: { params: { locale: Locale; day: string }; searchParams: { mode?: ReadingMode; date?: string } }) {
  const day = params.day as Weekday;
  if (!validDays.includes(day)) return notFound();

  const t = getMobileT(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const rawMode = searchParams.mode;
  const mode = rawMode && validModes.includes(rawMode) ? rawMode : "today";
  const todayStr = userTodayDateString();
  const date =
    mode === "today" ? getDateForWeekdayInCurrentWeek(day, parseUtcDateString(todayStr)) : (searchParams.date ?? todayStr);
  const weekdayFromDate = getWeekdayFromDate(date);
  if (mode === "makeup" && weekdayFromDate !== day) {
    redirect(`/${params.locale}/app/reading/${weekdayFromDate}?mode=makeup&date=${date}`);
  }
  const sections = getSectionsForWeekday(day, params.locale);
  const { readingSettings } = await getUserSettings(userId);
  const settings = readingSettings ?? defaultReadingSettings;
  const contentLanguages = settings.contentLanguages ?? defaultReadingSettings.contentLanguages;
  const showArabic = contentLanguages.includes("arabic");
  const showTransliteration = contentLanguages.includes("transliteration");
  const showTranslation = contentLanguages.some((l) => l !== "arabic" && l !== "transliteration");
  const textStyle = { fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeightMultiplier };
  const arabicStyle = { fontSize: `${settings.fontSize + 10}px` };
  const themeClasses =
    settings.theme === "dark"
      ? "bg-background-dark text-white border-gray-700"
      : settings.theme === "sepia"
        ? "bg-[#fdf6e3] text-[#0f1a17] border-gray-200"
        : "bg-[#fdfaf3] text-[#0c1d1b] border-gray-200";

  const headerClasses =
    settings.theme === "dark"
      ? "border-gray-700 bg-black/60"
      : settings.theme === "sepia"
        ? "border-gray-200 bg-[#fdf6e3]/90"
        : "border-gray-100 bg-white/90";

  const headerLinkClasses =
    settings.theme === "dark"
      ? "flex items-center gap-2 rounded-full p-2 text-gray-200 transition-colors hover:bg-white/10"
      : "flex items-center gap-2 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100";

  const headerTitleClasses = settings.theme === "dark" ? "text-lg font-bold text-white" : "text-lg font-bold text-[#0c1d1b]";

  const completeReading = async (formData: FormData) => {
    "use server";
    const appHref = `/${params.locale}/app`;
    const rawSubmittedMode = formData.get("mode");
    const submittedMode =
      typeof rawSubmittedMode === "string" && validModes.includes(rawSubmittedMode as ReadingMode)
        ? (rawSubmittedMode as ReadingMode)
        : "today";
    const submittedDate = (formData.get("date") as string) ?? userTodayDateString();
    const todayStr = userTodayDateString();
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(submittedDate) && parseUtcDateString(submittedDate).toISOString().slice(0, 10) === submittedDate;
    if (!isValidDate) redirect(`${appHref}?flash=sync_error&reason=invalid_date&ts=${Date.now()}`);
    if (submittedDate > todayStr) redirect(`${appHref}?flash=sync_error&reason=future_date&ts=${Date.now()}`);
    if (daysBetween(submittedDate, todayStr) > 365) redirect(`${appHref}?flash=sync_error&reason=too_old&ts=${Date.now()}`);

    const submittedWeekday = getWeekdayFromDate(submittedDate);

    const user = await getCurrentUser();
    if (!user) return;
    const userId = user.id;
    const profile = await getOrCreateProfile(userId);
    const existingLogs = await getReadingLogsForUser(userId);
    const alreadyCompleted = existingLogs.some((l) => l.completed && l.date === submittedDate);
    if (alreadyCompleted) {
      revalidatePath(appHref);
      redirect(`${appHref}?flash=already_completed&date=${submittedDate}&ts=${Date.now()}`);
    }
    const completedThisWeek = existingLogs.filter((l) => l.completed && isSameWeek(parseUtcDateString(l.date), parseUtcDateString(todayStr)));
    const weeklyTarget = Math.max(1, Math.min(7, profile.targetReadingDaysPerWeek ?? 7));
    const completedDates = new Set(completedThisWeek.map((l) => l.date));
    completedDates.add(submittedDate);
    const allWeekComplete =
      submittedMode === "today" &&
      isSameWeek(parseUtcDateString(submittedDate), parseUtcDateString(todayStr)) &&
      completedDates.size >= weeklyTarget;

    const completedAt = new Date().toISOString();
    const prospectiveLog = {
      date: submittedDate,
      weekday: submittedWeekday,
      mode: submittedMode,
      completed: true,
      pointsEarned: 0,
      completedAt,
    };
    const logsWithoutCurrent = existingLogs.filter((l) => l.date !== submittedDate);
    const streakPreview = calculateStreak([...logsWithoutCurrent, prospectiveLog]);

    const log = buildLogWithPoints({
      mode: submittedMode,
      date: submittedDate,
      weekday: submittedWeekday,
      completedAt,
      allWeekComplete,
      currentStreak: streakPreview.currentStreakDays,
    });

    const result = await insertReadingLog(userId, log);
    if (!result.ok) {
      const code = (result.error as unknown as { code?: string } | null)?.code;
      const reason = code === "PGRST205" ? "missing_schema" : "write_failed";
      redirect(`${appHref}?flash=sync_error&reason=${reason}&code=${encodeURIComponent(code ?? "")}&ts=${Date.now()}`);
    }
    revalidatePath(appHref);
    revalidatePath(`/${params.locale}/app/ranking`);
    revalidatePath(`/${params.locale}/app/history`);
    revalidatePath(`/${params.locale}/app/missed`);
    const base = submittedMode === "makeup" ? BASE_POINTS_MAKEUP : BASE_POINTS_TODAY;
    const weekly = allWeekComplete ? WEEKLY_BONUS_POINTS : 0;
    const streak = isStreakMilestone(streakPreview.currentStreakDays) ? STREAK_MILESTONE_BONUS : 0;
    redirect(`${appHref}?flash=reading_completed&mode=${submittedMode}&base=${base}&weekly=${weekly}&streak=${streak}&date=${submittedDate}&ts=${Date.now()}`);
  };

  return (
    <div className="flex flex-col items-center px-0 py-6 sm:px-4 md:py-8">
      <AutoScroll enabled={settings.autoScroll} speed={settings.autoScrollSpeed} />
      <BookmarkSync dayId={day} date={date} />
        <div className={`w-full max-w-4xl overflow-hidden rounded-none border shadow-sm sm:rounded-2xl ${themeClasses}`}>
        <div className={`flex min-h-16 items-center justify-between border-b px-4 py-2 backdrop-blur-md ${headerClasses}`}>
          <a className={headerLinkClasses} href={`/${params.locale}/app`}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-semibold">{t("action.back")}</span>
          </a>
          <h1 className={headerTitleClasses}>
            {t(`weekday.${day}`)} · {mode === "makeup" ? t("screen.reading.mode.makeup") : t("screen.reading.mode.today")}
          </h1>
          <a className={headerLinkClasses} href={`/${params.locale}/app/settings`}>
            <span className="material-symbols-outlined">settings</span>
          </a>
        </div>

        <ScrollProgressBar />

        <div className="space-y-12 p-4 sm:p-6 md:p-10 lg:p-12">
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-micro font-bold uppercase tracking-wide text-primary">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
              {mode === "makeup" ? t("screen.reading.mode.makeup") : t("screen.reading.mode.today")}
            </div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {sections.map((section) => {
              const translationKey = params.locale as keyof typeof section.translations;
              const translation = section.translations[translationKey] ?? section.translations.tr;
              return (
                <div key={section.id} className="group flex flex-col gap-4">
                  {showArabic && section.arabicText ? (
                    <p className="arabic-text text-right text-3xl leading-[2] text-current" dir="rtl" style={arabicStyle}>
                      {section.arabicText}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-col gap-2 border-l-0 border-primary/20 pl-0 sm:border-l-2 sm:pl-4">
                    {showTransliteration && section.transliteration ? (
                      <p className="text-base font-medium text-current opacity-90" style={textStyle}>
                        {section.transliteration}
                      </p>
                    ) : null}
                    {showTranslation && translation ? (
                      <p className="text-sm font-light leading-relaxed text-current opacity-70" style={textStyle}>
                        {translation}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-8">
            <form action={completeReading} className="space-y-3">
              <input type="hidden" name="mode" value={mode} />
              <input type="hidden" name="date" value={date} />
              <SubmitButton label={t("screen.reading.completeButton")} loadingLabel={t("action.saving")} />
            </form>
            <a
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary px-6 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
              href={`/${params.locale}/app/settings`}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              {t("screen.reading.settingsButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
