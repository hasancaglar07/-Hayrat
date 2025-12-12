import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getMissedLogs, getReadingLogsForUser } from "@/lib/data/logs";
import { getCurrentUser } from "@/lib/auth/server";
import { getSectionsForWeekday } from "@/lib/content/readingSections";
import { formatDisplayDate, getWeekdayFromDate } from "@/lib/core/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrCreateProfile } from "@/lib/data/profile";
import { userTodayDateString } from "@/lib/core/userTime";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMobileT(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/missed",
    title: `${t("app.name")} | ${t("screen.missed.title")}`,
    description: t("screen.missed.subtitle"),
    noindex: true,
  });
}

export default async function MissedPage({ params }: { params: { locale: Locale } }) {
  const t = getMobileT(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const logs = await getReadingLogsForUser(userId);
  const profile = await getOrCreateProfile(userId);
  const userStartDate = profile.createdAt?.split("T")[0] || undefined;
  const today = userTodayDateString();
  const targetDays = Math.max(1, Math.min(7, profile.targetReadingDaysPerWeek ?? 7));
  const missed = getMissedLogs(logs, 30, targetDays, { startDate: userStartDate, today });
  const completed = logs.filter((l) => l.completed).length;
  const todayWeekday = getWeekdayFromDate(today);

  return (
    <div className="space-y-10">
      <header className="liquid-section-header">
        <h1 className="page-title mb-3">{t("screen.missed.title")}</h1>
        <p className="max-w-2xl text-base font-normal leading-relaxed text-text-medium">{t("screen.missed.subtitle")}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="panel flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-medium">{t("screen.missed.totalMissed")}</p>
            <p className="text-xl font-bold text-text-dark">{missed.length}</p>
          </div>
        </div>
        <div className="panel flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-medium">{t("screen.missed.totalCompleted")}</p>
            <p className="text-xl font-bold text-text-dark">{completed}</p>
          </div>
        </div>
      </div>

      {missed.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-text-dark">
            {t("screen.missed.latestLabel")}:{" "}
            {formatDisplayDate(missed[0].date, params.locale)} ·{" "}
            {t(`weekday.${missed[0].weekday}`)}
          </div>
          <Button asChild size="sm" className="rounded-xl px-5 py-2.5 hover:bg-primary-dark">
            <Link href={`/${params.locale}/app/reading/${missed[0].weekday}?mode=makeup&date=${missed[0].date}`}>
              {t("screen.missed.latestCta")}
            </Link>
          </Button>
        </div>
      ) : null}

      {missed.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-primary/10 bg-[#f0fdfc] px-6 py-16 text-center dark:bg-background-offwhite">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative rounded-full bg-white p-6 shadow-sm dark:bg-background-dark">
              <span className="material-symbols-outlined text-5xl text-primary">volunteer_activism</span>
            </div>
          </div>
          <h2 className="mb-2 section-title">{t("screen.missed.emptyTitle")}</h2>
          <p className="mb-8 text-text-medium">{t("screen.missed.emptySubtitle")}</p>
          <Button asChild variant="outline" size="lg" className="h-auto rounded-xl px-7 py-3.5">
            <Link href={`/${params.locale}/app/reading/${todayWeekday}`}>{t("screen.missed.goToday")}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {missed.map((item) => {
            const sections = getSectionsForWeekday(item.weekday, params.locale);
            const hizbTitle = sections[0]?.title ?? "Hizb";
            return (
            <div
              key={item.date}
              className="panel group flex flex-col gap-4 p-5 transition-shadow duration-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4 sm:items-center">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-text-dark">
                    {formatDisplayDate(item.date, params.locale)},{" "}
                    {t(`weekday.${item.weekday}`)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">{t("component.dayCard.status.missed")}</Badge>
                    <span className="text-micro text-text-medium">• {hizbTitle}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-shrink-0">
                <Button asChild size="lg" className="h-auto w-full rounded-xl px-7 py-3.5 shadow-sm hover:bg-primary-dark sm:w-auto">
                  <Link href={`/${params.locale}/app/reading/${item.weekday}?mode=makeup&date=${item.date}`}>
                    <span className="material-symbols-outlined text-[20px]">book_2</span>
                    {t("screen.missed.action")}
                  </Link>
                </Button>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}
