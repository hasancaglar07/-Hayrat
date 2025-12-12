import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getReadingLogsForUser } from "@/lib/data/logs";
import { getCurrentUser } from "@/lib/auth/server";
import { getSectionsForWeekday } from "@/lib/content/readingSections";
import type { Weekday } from "@/lib/core/types";
import { formatDisplayDate } from "@/lib/core/date";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const weekDayOrder: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/history",
    title: `${t.brand} | ${t.history.title}`,
    description: t.weekly.subtitle,
    noindex: true,
  });
}

export default async function HistoryPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { filter?: "all" | "today" | "makeup" };
}) {
  const t = getMessages(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const logs = await getReadingLogsForUser(userId);
  const completedLogs = logs.filter((l) => l.completed).sort((a, b) => b.date.localeCompare(a.date));
  const filter = searchParams.filter ?? "all";
  const filteredLogs =
    filter === "today" ? completedLogs.filter((l) => l.mode === "today") : filter === "makeup" ? completedLogs.filter((l) => l.mode === "makeup") : completedLogs;
  const totalCompleted = completedLogs.length;
  const totalPoints = completedLogs.reduce((sum, l) => sum + (l.pointsEarned ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="liquid-section-header space-y-2">
        <h1 className="page-title">{t.history.title}</h1>
        <p className="text-text-medium">{t.history.subtitle}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {(["all", "today", "makeup"] as const).map((key) => (
            <Button
              key={key}
              asChild
              size="sm"
              variant={filter === key ? "default" : "outline"}
              className={clsx("rounded-full", filter !== key && "text-text-medium hover:text-primary")}
            >
              <Link href={`/${params.locale}/app/history?filter=${key}`} aria-current={filter === key ? "page" : undefined}>
                {t.history.filters[key]}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="rounded-xl border border-border bg-background/85 px-4 py-2.5 font-semibold text-foreground shadow-sm backdrop-blur">
            {t.history.summary.completed}: <span className="text-primary">{totalCompleted}</span>
          </div>
          <div className="rounded-xl border border-border bg-background/85 px-4 py-2.5 font-semibold text-foreground shadow-sm backdrop-blur">
            {t.history.summary.points}: <span className="text-primary">{totalPoints}</span>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="panel p-6 text-center text-text-medium">{t.history.empty}</div>
      ) : (
        <div className="panel divide-y divide-border/70">
          {filteredLogs.map((log) => {
            const dayName = t.days[weekDayOrder.indexOf(log.weekday)];
            const sections = getSectionsForWeekday(log.weekday, params.locale);
            const hizbTitle = sections[0]?.title;
            const badge = log.mode === "makeup" ? t.history.badges.makeup : t.history.badges.today;
            return (
              <div key={log.date} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-text-dark">
                    {formatDisplayDate(log.date, params.locale)} · {dayName}
                    <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-[10px] font-bold">
                      {badge}
                    </Badge>
                  </div>
                  {hizbTitle ? <div className="text-micro text-text-medium">{hizbTitle}</div> : null}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-primary">{log.pointsEarned}</div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/${params.locale}/app/reading/${log.weekday}?mode=${log.mode}&date=${log.date}`}>
                      {t.history.actions.open}
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
