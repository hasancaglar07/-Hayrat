import type { Metadata } from "next";
import Link from "next/link";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { computeUserStats, getReadingLogsForUser } from "@/lib/data/logs";
import { getGlobalLeaderboard, type LeaderboardEntry } from "@/lib/data/ranking";
import { getCurrentUser } from "@/lib/auth/server";
import { getOrCreateProfile } from "@/lib/data/profile";
import clsx from "clsx";
import { AuthWidget } from "@/components/auth/AuthWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { userTodayDateString } from "@/lib/core/userTime";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/ranking",
    title: `${t.brand} | ${t.nav.ranking}`,
    description: t.ranking.subtitle,
    noindex: true,
  });
}

export default async function RankingPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { period?: "total" | "weekly" | "monthly" };
}) {
  const t = getMessages(params.locale);
  const user = await getCurrentUser();
  if (!user) return null;
  const userId = user.id;
  const logs = await getReadingLogsForUser(userId);
  const stats = computeUserStats(logs, { today: userTodayDateString() });
  const profile = await getOrCreateProfile(userId);
  const globalLeaderboard = await getGlobalLeaderboard(20);
  const period = searchParams.period ?? "total";

  const meEntry: LeaderboardEntry = {
    id: userId,
    name: t.ranking.you,
    country: profile.countryCode ?? "TR",
    points: stats.totalPoints,
    streak: stats.currentStreakDays,
    weeklyPoints: stats.weeklyPoints ?? 0,
    monthlyPoints: stats.monthlyPoints ?? 0,
  };

  const leaderboardUnsorted =
    globalLeaderboard.length > 0
      ? globalLeaderboard.some((row) => row.id === userId)
        ? globalLeaderboard
        : [...globalLeaderboard, meEntry]
      : [meEntry];

  const getPointsForPeriod = (row: LeaderboardEntry) =>
    period === "weekly" ? row.weeklyPoints : period === "monthly" ? row.monthlyPoints : row.points;

  const leaderboard = leaderboardUnsorted.sort((a, b) => getPointsForPeriod(b) - getPointsForPeriod(a));
  const myPoints = getPointsForPeriod(meEntry);
  const myRank = Math.max(1, leaderboard.findIndex((row) => row.id === userId) + 1);

  return (
    <div className="space-y-8">
      <div className="panel flex justify-end p-4">
        <AuthWidget locale={params.locale} redirectTo={`/${params.locale}/app/ranking`} />
      </div>
      <div className="panel p-6">
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-primary">{t.ranking.statsTitle}</p>
          <h1 className="page-title">{t.ranking.title}</h1>
          <p className="text-text-medium">{t.ranking.subtitle}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-primary/5 p-5">
            <p className="text-sm font-medium text-text-medium">
              {t.ranking.labels.points} · {t.ranking.periods[period]}
            </p>
            <p className="text-2xl font-bold text-primary">{myPoints}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-text-medium">{t.ranking.leaderboardTitle}</p>
            <p className="text-2xl font-bold text-text-dark">
              #{myRank} <span className="text-base font-semibold text-text-medium">/ {leaderboard.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-text-medium">{t.ranking.labels.currentStreak}</p>
            <p className="text-2xl font-bold text-text-dark">{stats.currentStreakDays}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-text-medium">{t.ranking.labels.longestStreak}</p>
            <p className="text-2xl font-bold text-text-dark">{stats.longestStreakDays}</p>
          </div>
        </div>
      </div>

      {!profile.showInGlobalRanking ? (
        <div className="panel border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base text-foreground">{t.profile.showRanking}</span>
            <Button asChild size="sm" className="hover:bg-primary-dark">
              <Link href={`/${params.locale}/app/profile`}>{t.profile.title}</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="panel p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title-sm">{t.ranking.leaderboardTitle}</h2>
          <div className="flex items-center gap-2">
            {(["total", "weekly", "monthly"] as const).map((p) => (
              <Button
                key={p}
                asChild
                size="sm"
                variant={period === p ? "default" : "outline"}
                className={clsx("rounded-full", period !== p && "text-text-medium hover:text-primary")}
              >
                <Link href={`/${params.locale}/app/ranking?period=${p}`} aria-current={period === p ? "page" : undefined}>
                  {t.ranking.periods[p]}
                </Link>
              </Button>
            ))}
            <Badge className="bg-primary/10 text-primary">{t.ranking.betaLabel}</Badge>
          </div>
        </div>
        <div className="divide-y divide-border/70">
          {leaderboard.map((row, index) => {
            const displayPoints = getPointsForPeriod(row);
            return (
            <div
              key={row.id}
              className={clsx(
                "flex items-center justify-between py-3",
                row.id === userId && "rounded-xl bg-primary/5 px-2",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">{index + 1}</div>
                <div>
                  <p className="text-sm font-semibold text-text-dark">{row.name}</p>
                  <p className="text-micro text-text-medium">{row.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-sm font-semibold text-text-dark">{displayPoints}</p>
                  <p className="text-micro text-text-medium">{t.ranking.labels.points}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  {row.streak}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}
