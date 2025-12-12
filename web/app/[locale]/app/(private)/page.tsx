import Link from "next/link";
import type { Metadata } from "next";
import clsx from "clsx";
import type { Locale } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";
import { createPageMetadata } from "@/lib/seo/metadata";
import { computeUserStats, getMissedLogs, getReadingLogsForUser } from "@/lib/data/logs";
import { formatDisplayDate, getDateForWeekdayInCurrentWeek, getWeekdayFromDate, parseUtcDateString } from "@/lib/core/date";
import type { Weekday } from "@/lib/core/types";
import { getCurrentUser } from "@/lib/auth/server";
import { getSectionsForWeekday } from "@/lib/content/readingSections";
import { getOrCreateProfile } from "@/lib/data/profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashNotice } from "@/components/feedback/FlashNotice";
import { RefreshOnce } from "@/components/feedback/RefreshOnce";
import { userTodayDateString } from "@/lib/core/userTime";
const weekDayOrder: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMobileT(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app",
    title: `${t("app.name")} | ${t("screen.home.title")}`,
    description: t("screen.home.subtitle"),
    noindex: true,
  });
}

export default async function WeeklyOverview({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = getMobileT(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const logs = await getReadingLogsForUser(userId);
  const profile = await getOrCreateProfile(userId);
  const userStartDate = profile.createdAt?.split("T")[0] || undefined;
  const today = userTodayDateString();
  const stats = computeUserStats(logs, { today });
  const todayDisplay = formatDisplayDate(today, params.locale);
  const todayWeekday = getWeekdayFromDate(today);
  const todayRef = parseUtcDateString(today);

  const weekCards = weekDayOrder.map((day, idx) => {
    const date = getDateForWeekdayInCurrentWeek(day, todayRef);
    const log = logs.find((l) => l.date === date);
    const sections = getSectionsForWeekday(day, params.locale);
    const hizbTitle = sections[0]?.title ?? `${idx + 1}. Hizb`;
    let state: "completed" | "missed" | "today" | "upcoming" = "upcoming";
    if (log?.completed) state = "completed";
    else if (day === todayWeekday) state = "today";
    else if (userStartDate && date < userStartDate) state = "upcoming";
    else if (date < today) state = "missed";

    return { day, date, log, state, hizbTitle };
  });

  const completedCount = weekCards.filter((c) => c.state === "completed").length;
  const todayCard = weekCards.find((c) => c.state === "today");
  const targetDays = Math.max(1, Math.min(7, profile.targetReadingDaysPerWeek ?? 7));
  const missedDays = getMissedLogs(logs, 7, targetDays, { startDate: userStartDate, today });
  const remainingDays = Math.max(0, targetDays - completedCount);
  const targetMet = remainingDays === 0;
  const progress = Math.min(100, Math.round((completedCount / targetDays) * 100));
  const displayCards = todayCard ? [todayCard, ...weekCards.filter((c) => c.day !== todayCard.day)] : weekCards;
  const remainingLabel = targetMet ? t("screen.home.targetMetLabel") : t("screen.home.remainingLabel", { remaining: remainingDays });

  const flash = typeof searchParams?.flash === "string" ? searchParams.flash : undefined;
  const basePoints = Number(typeof searchParams?.base === "string" ? searchParams.base : NaN);
  const weeklyBonus = Number(typeof searchParams?.weekly === "string" ? searchParams.weekly : NaN);
  const streakBonus = Number(typeof searchParams?.streak === "string" ? searchParams.streak : NaN);
  const mode = typeof searchParams?.mode === "string" ? searchParams.mode : undefined;
  const hasFlash = flash === "reading_completed";
  const alreadyCompleted = flash === "already_completed";
  const syncError = flash === "sync_error";
  const errorReason = typeof searchParams?.reason === "string" ? searchParams.reason : undefined;
  const errorCode = typeof searchParams?.code === "string" ? searchParams.code : undefined;
  const completedDate = typeof searchParams?.date === "string" ? searchParams.date : undefined;
  const syncErrorDefault =
    errorReason === "missing_schema"
      ? "Supabase tabloları yok (schema kurulmamış). `web/supabase/schema.sql` dosyasını Supabase SQL Editor’da çalıştır."
      : errorReason === "future_date"
        ? "Saat dilimi nedeniyle 'bugün' uyuşmadı (gelecek tarih). Sayfayı yenileyip tekrar dene."
        : errorReason === "too_old"
          ? "Çok eski tarih (365+ gün) kaydedilmez."
          : errorCode
            ? `Supabase hata kodu: ${errorCode}`
            : "Okuma kaydedilemedi. Supabase bağlantısı/tabloları kontrol edin.";
  const flashItems = hasFlash
    ? [
        ...(Number.isFinite(basePoints) && basePoints > 0
          ? [
              mode === "makeup"
                ? t("screen.reading.points.makeup", { points: basePoints })
                : t("screen.reading.points.today", { points: basePoints }),
            ]
          : []),
        ...(Number.isFinite(weeklyBonus) && weeklyBonus > 0 ? [t("screen.reading.points.weeklyBonus", { points: weeklyBonus })] : []),
        ...(Number.isFinite(streakBonus) && streakBonus > 0 ? [t("screen.reading.points.streakBonus", { points: streakBonus })] : []),
      ]
    : [];

  const stateMeta = {
    completed: {
      label: t("component.dayCard.status.completed"),
      icon: "check_circle",
      iconClass: "bg-emerald-50 text-emerald-600",
      tagClass: "bg-emerald-100 text-emerald-900",
      containerClass: "border-emerald-100",
    },
    missed: {
      label: t("component.dayCard.status.missed"),
      icon: "close",
      iconClass: "bg-red-50 text-red-600",
      tagClass: "bg-red-100 text-red-900",
      containerClass: "border-red-200 bg-red-50/50",
    },
    today: {
      label: t("component.dayCard.status.today"),
      icon: "menu_book",
      iconClass: "bg-primary/10 text-primary",
      tagClass: "bg-primary text-white",
      containerClass: "border-primary/40 bg-primary-light/30 ring-1 ring-primary/10",
    },
    upcoming: {
      label: t("component.dayCard.status.upcoming"),
      icon: "lock",
      iconClass: "bg-secondary/70 text-muted-foreground",
      tagClass: "bg-secondary text-secondary-foreground",
      containerClass: "border-dashed bg-secondary/25 opacity-90 dark:bg-secondary/10",
    },
  } as const;

  return (
    <div className="space-y-10">
      {flash ? (
        <RefreshOnce
          id={`app:${flash}:${String(searchParams?.date ?? "")}:${String(searchParams?.mode ?? "")}:${String(searchParams?.base ?? "")}:${String(searchParams?.weekly ?? "")}:${String(searchParams?.streak ?? "")}:${String(searchParams?.reason ?? "")}:${String(searchParams?.code ?? "")}:${String(searchParams?.ts ?? "")}`}
        />
      ) : null}
      {hasFlash ? (
        <FlashNotice
          title={t("screen.reading.completeSuccessTitle")}
          body={t("screen.reading.completeSuccessBody")}
          items={flashItems}
          clearKeys={["flash", "base", "weekly", "streak", "mode", "date", "ts"]}
        />
      ) : alreadyCompleted ? (
        <FlashNotice
          title={t("screen.reading.completeSuccessTitle", { defaultValue: "Zaten tamamlandı" })}
          body={
            completedDate
              ? t("screen.reading.completeSuccessBody", { defaultValue: `Bu tarih zaten tamamlanmış: ${completedDate}` })
              : t("screen.reading.completeSuccessBody", { defaultValue: "Bu tarih zaten tamamlanmış." })
          }
          variant="info"
          clearKeys={["flash", "date", "ts"]}
        />
      ) : syncError ? (
        <FlashNotice
          title={t("screen.reading.completeSuccessTitle", { defaultValue: "Kaydedilemedi" })}
          body={t("screen.reading.completeSuccessBody", { defaultValue: syncErrorDefault })}
          variant="warning"
          clearKeys={["flash", "reason", "code", "ts"]}
        />
      ) : null}
      <section className="panel relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,168,148,0.12),transparent_55%),radial-gradient(circle_at_100%_10%,rgba(16,185,129,0.08),transparent_45%)]" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-text-dark sm:text-xl">{t("screen.home.title")}</h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/15">
                  {completedCount}/{targetDays}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-text-medium">{t("screen.home.subtitle")}</p>
            </div>
            <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-medium ring-1 ring-border-light/70 backdrop-blur sm:mt-0 dark:bg-background-offwhite/20 dark:ring-white/10">
              <span className="material-symbols-outlined text-[16px] text-text-light">calendar_today</span>
              {todayDisplay}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">{progress}%</span>
              <span className="text-sm font-semibold text-text-medium">{t("screen.home.weeklyProgressLabel", { completed: completedCount, total: targetDays })}</span>
            </div>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-border-light/70 text-primary shadow-sm dark:bg-background-offwhite/30 dark:ring-white/10">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full bg-background-offwhite ring-1 ring-border-light/60 dark:bg-white/5 dark:ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="overflow-hidden rounded-2xl bg-background/70 shadow-sm ring-1 ring-border-light/70 backdrop-blur dark:bg-background-offwhite/10 dark:ring-white/10">
            <div className="grid grid-cols-3 divide-x divide-border-light/70 dark:divide-white/10">
              <div className="px-3 py-3 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-text-medium">{t("screen.home.stats.streakLabel")}</p>
                  <span className="material-symbols-outlined text-[16px] text-orange-500">local_fire_department</span>
                </div>
                <div className="mt-1 text-lg font-extrabold tracking-tight text-text-dark">{stats.currentStreakDays}</div>
              </div>
              <div className="px-3 py-3 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-text-medium">{t("screen.home.targetLabel", { target: targetDays })}</p>
                  <span className="material-symbols-outlined text-[16px] text-primary">track_changes</span>
                </div>
                <div className="mt-1 text-lg font-extrabold tracking-tight text-text-dark">{remainingDays}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-text-medium">{remainingLabel}</div>
              </div>
              <div className="px-3 py-3 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-text-medium">{t("screen.home.stats.pointsLabel")}</p>
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">emoji_events</span>
                </div>
                <div className="mt-1 text-lg font-extrabold tracking-tight text-text-dark">{stats.totalPoints}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-text-medium">{t("screen.home.stats.weeklyPoints", { points: stats.weeklyPoints })}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {todayCard ? (
              <Button asChild size="lg" className="h-auto rounded-2xl px-8 py-4 shadow-soft hover:bg-primary-dark">
                <Link href={`/${params.locale}/app/reading/${todayCard.day}`}>
                  <span className="material-symbols-outlined text-[22px]">play_arrow</span>
                {t("screen.home.ctaToday")}
              </Link>
            </Button>
          ) : null}
          {missedDays.length > 0 ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-2xl border-primary/25 px-8 py-4 text-primary shadow-soft hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
            >
              <Link href={`/${params.locale}/app/missed`}>
                <span className="material-symbols-outlined text-[22px]">history</span>
                {t("action.goToMissed")}
              </Link>
            </Button>
          ) : null}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-auto rounded-2xl border-border-light/80 px-8 py-4 shadow-soft hover:border-primary hover:text-primary dark:bg-background-offwhite"
          >
            <Link href={`/${params.locale}/app/history`}>
              <span className="material-symbols-outlined text-[22px]">timeline</span>
              {t("action.viewAll")}
            </Link>
          </Button>
        </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title-sm">{t("screen.home.weeklyTitle")}</h2>
            <p className="mt-1 text-base text-text-light">{t("screen.home.weeklySubtitle")}</p>
          </div>
          <Link className="text-base font-semibold text-primary transition-colors hover:text-primary-dark" href={`/${params.locale}/app/history`}>
            {t("action.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {displayCards.map((card) => {
            const title = `${t(`weekday.${card.day}`)}`;
            const cardDateDisplay = formatDisplayDate(card.date, params.locale, { day: "2-digit", month: "short" });
            const meta = stateMeta[card.state];

            const actionHref =
              card.state === "today"
                ? `/${params.locale}/app/reading/${card.day}`
                : card.state === "missed"
                  ? `/${params.locale}/app/reading/${card.day}?mode=makeup&date=${card.date}`
                  : null;

            const actionLabel =
              card.state === "today" ? t("screen.home.ctaToday") : card.state === "missed" ? t("screen.missed.action") : null;

            const actionClass =
              card.state === "today"
                ? "bg-primary text-white hover:bg-primary-dark"
                : "border border-red-200 bg-background text-red-700 hover:bg-red-50 dark:border-red-900/40 dark:bg-background dark:text-red-300 dark:hover:bg-red-900/30";

            return (
              <div
                key={card.day}
                className={clsx(
                  "panel flex flex-col gap-4 p-6 transition-shadow duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between",
                  meta.containerClass
                )}
              >
                <div className="flex items-start gap-4 sm:items-center">
                <div className={clsx("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl", meta.iconClass)}>
                  <span className="material-symbols-outlined text-[28px]">{meta.icon}</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-text-dark">{title}</h3>
                  <p className="mt-1 text-base text-text-medium">
                    {cardDateDisplay} · {card.hizbTitle}
                  </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Badge className={clsx("px-3 py-1 text-sm font-semibold", meta.tagClass)}>{meta.label}</Badge>
                  {actionHref && actionLabel ? (
                    <Button
                      asChild
                      size="lg"
                      className={clsx("h-auto rounded-xl px-6 py-3 shadow-sm transition-colors", actionClass)}
                      variant={card.state === "today" ? "default" : "outline"}
                    >
                      <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
