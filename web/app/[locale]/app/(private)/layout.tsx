import type { Metadata } from "next";
import { AppNav } from "../AppNav";
import { getMessages, type Locale } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";
import { AppGate } from "@/components/auth/AppGate";
import { Footer } from "@/components/layout/Footer";
import { computeUserStats, getMissedLogs, getReadingLogsForUser } from "@/lib/data/logs";
import { getCurrentUser } from "@/lib/auth/server";
import { getUserSettings, defaultAppSettings } from "@/lib/data/settings";
import { getOrCreateProfile } from "@/lib/data/profile";
import { NotificationScheduler } from "@/components/notifications/NotificationScheduler";
import { PageTransition } from "@/components/transitions/PageTransition";
import { TimezoneInit } from "@/components/feedback/TimezoneInit";
import { userTodayDateString } from "@/lib/core/userTime";
import { getSchemaStatus } from "@/lib/data/schemaStatus";
import { SupabaseSchemaNotice } from "@/components/feedback/SupabaseSchemaNotice";
import { ThemePreferenceSync } from "@/components/theme/ThemePreferenceSync";

type Props = { children: React.ReactNode; params: { locale: Locale } };

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Delailül Takip | Web",
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children, params }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    return <AppGate locale={params.locale} />;
  }
  const t = getMobileT(params.locale);
  const webT = getMessages(params.locale);
  const userId = user.id;
  const logs = await getReadingLogsForUser(userId);
  const today = userTodayDateString();
  const stats = computeUserStats(logs, { today });
  const { appSettings } = await getUserSettings(userId);
  const profile = await getOrCreateProfile(userId);
  const schemaStatus = await getSchemaStatus();
  const userStartDate = profile.createdAt?.split("T")[0] || undefined;
  const targetDays = Math.max(1, Math.min(7, profile.targetReadingDaysPerWeek ?? 7));
  const missedLast30 = getMissedLogs(logs, 30, targetDays, { startDate: userStartDate, today });
  const notificationTime = appSettings.notificationTime ?? defaultAppSettings.notificationTime ?? "21:00";

	  const navItems = [
	    { href: `/${params.locale}/app`, label: t("screen.home.tabLabel"), icon: "calendar_month" },
	    { href: `/${params.locale}/app/missed`, label: t("screen.missed.title"), icon: "history" },
	    { href: `/${params.locale}/app/ranking`, label: t("screen.ranking.tabLabel"), icon: "stadia_controller" },
	    { href: `/${params.locale}/app/settings`, label: t("screen.settings.title"), icon: "settings" },
	  ];

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <ThemePreferenceSync preference={appSettings.themePreference ?? "system"} />
      <TimezoneInit />
      <AppNav
        brand={t("app.name")}
        items={navItems}
        locale={params.locale}
        streakDays={stats.currentStreakDays}
        userEmail={user.email ?? undefined}
        profileHref={`/${params.locale}/app/profile`}
        profileLabel={webT.nav.profile}
        signOutLabel={webT.nav.signOut}
        donateHref={`/${params.locale}/app/donate`}
        donateLabel={t("screen.donate.title")}
      />
      <NotificationScheduler
        locale={params.locale}
        enabled={appSettings.notificationsEnabled}
        remindMissedDays={appSettings.remindMissedDays}
        notificationTime={notificationTime}
        missedCount={missedLast30.length}
      />
      <main className="mx-auto w-full max-w-6xl px-0 py-8 sm:px-6 lg:px-8">
        <div className="panel rounded-none p-4 ring-1 ring-border-light/70 backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:p-8">
          <div className="mb-6">
            <SupabaseSchemaNotice status={schemaStatus} locale={params.locale} />
          </div>
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <Footer locale={params.locale} />
    </div>
  );
}
