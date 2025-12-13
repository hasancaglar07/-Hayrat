import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { format, getMessages } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getMobileT } from "@/i18n/mobile";
import type { Weekday } from "@/lib/core/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGuestReadingProgress } from "@/lib/guest/readingProgress";

const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  const mobileT = getMobileT(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/read",
    title: `${t.brand} | ${mobileT("screen.reading.title", { defaultValue: "Read" })}`,
    description: t.landing.heroDescription,
    type: "website",
  });
}

export default function ReadIndexPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { marked?: string };
}) {
  const t = getMobileT(params.locale);
  const messages = getMessages(params.locale);
  const title = t("screen.reading.title", { defaultValue: "Read" });
  const progress = getGuestReadingProgress();
  const completedCount = weekdays.reduce((acc, day) => acc + (progress.completed[day] ? 1 : 0), 0);
  const progressLabel = format(messages.weekly.progressLabel, { done: completedCount, total: weekdays.length });

  const markedDay = (typeof searchParams?.marked === "string" ? searchParams.marked : "") as Weekday | "";
  const showMarked = weekdays.includes(markedDay as Weekday);
  const markedMessage =
    params.locale === "tr"
      ? "Misafir okuman kaydedildi."
      : params.locale === "ar"
        ? "تم حفظ القراءة (ضيف)."
        : "Saved (guest).";
  const guestIntro =
    params.locale === "tr"
      ? "Misafir modunda okuyabilirsin. Takip (puan/streak/eksik günler) ve senkron için giriş gerekir."
      : params.locale === "ar"
        ? "يمكنك القراءة كضيف. للمتابعة (النقاط/السلسلة/الأيام الفائتة) والمزامنة يلزم تسجيل الدخول."
        : "You can read as a guest. To track (points/streak/missed days) and sync, you need to sign in.";

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-primary/15 bg-primary/5">
        <CardContent className="p-5 sm:p-8">
          <h1 className="page-title text-primary">{title}</h1>
          <p className="mt-3 text-base text-text-medium">{guestIntro}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{progressLabel}</Badge>
            {showMarked ? <Badge variant="secondary">{markedMessage}</Badge> : null}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-auto rounded-2xl px-7 py-4 shadow-soft hover:bg-primary-dark">
              <Link href={`/${params.locale}/read/settings`}>{messages.settings.reading.title}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-2xl border-primary/25 px-7 py-4 text-primary shadow-soft hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
            >
              <Link href={`/${params.locale}/auth?next=/${params.locale}/app`}>{messages.nav.signIn}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weekdays.map((day) => (
          <Link
            key={day}
            href={`/${params.locale}/read/${day}`}
            className="panel group rounded-2xl border border-border p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-medium">{t(`weekday.${day}`)}</p>
                <p className="mt-1 text-base font-bold text-text-dark">{title}</p>
                <div className="mt-2">
                  {progress.completed[day] ? (
                    <Badge>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {messages.weekly.status.completed}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{messages.weekly.status.upcoming}</Badge>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-[22px] text-primary transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
