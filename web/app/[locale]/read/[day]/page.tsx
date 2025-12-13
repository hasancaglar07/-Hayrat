import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getMobileT } from "@/i18n/mobile";
import { getSectionsForWeekday } from "@/lib/content/readingSections";
import type { Weekday } from "@/lib/core/types";
import { Button } from "@/components/ui/button";
import { getGuestReadingSettings } from "@/lib/guest/readingSettings";
import { AutoScroll } from "@/components/reading/AutoScroll";
import { ScrollProgressBar } from "@/components/reading/ScrollProgressBar";
import { getGuestReadingProgress, markGuestReadingCompleted } from "@/lib/guest/readingProgress";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { redirect } from "next/navigation";

const validDays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale; day: string } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  const mobileT = getMobileT(params.locale);
  const titleDay = validDays.includes(params.day as Weekday) ? mobileT(`weekday.${params.day}`) : params.day;
  return createPageMetadata({
    locale: params.locale,
    path: `/read/${params.day}`,
    title: `${t.brand} | ${titleDay}`,
    description: t.landing.heroDescription,
    noindex: false,
  });
}

export default function ReadDayPage({
  params,
}: {
  params: { locale: Locale; day: string };
}) {
  const day = params.day as Weekday;
  if (!validDays.includes(day)) return notFound();

  const t = getMobileT(params.locale);
  const messages = getMessages(params.locale);
  const sections = getSectionsForWeekday(day, params.locale);
  const settings = getGuestReadingSettings(params.locale);
  const progress = getGuestReadingProgress();
  const isCompleted = Boolean(progress.completed[day]);
  const contentLanguages = settings.contentLanguages;
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

  const nextTrackPath = `/${params.locale}/app/reading/${day}`;
  const signInHref = `/${params.locale}/auth?next=${encodeURIComponent(nextTrackPath)}`;
  const bannerText =
    params.locale === "tr"
      ? "Bu okumanı puan/streak olarak işaretlemek için giriş yap."
      : params.locale === "ar"
        ? "لتسجيل هذه القراءة ضمن النقاط/السلسلة، سجّل الدخول."
        : "Sign in to track this reading (points/streak).";

  const markLabel =
    params.locale === "tr"
      ? "Okudum (misafir)"
      : params.locale === "ar"
        ? "تمت القراءة (ضيف)"
        : "Mark as read (guest)";
  const markedMessage =
    params.locale === "tr"
      ? "Bu hafta için misafir okuma kaydedildi."
      : params.locale === "ar"
        ? "تم حفظ القراءة لهذا الأسبوع (ضيف)."
        : "Saved for this week (guest).";

  const markCompleted = async () => {
    "use server";
    markGuestReadingCompleted(day);
    redirect(`/${params.locale}/read?marked=${day}`);
  };

  return (
    <div className="flex flex-col items-center">
      <AutoScroll enabled={settings.autoScroll} speed={settings.autoScrollSpeed} />

      <div className={`w-full max-w-4xl overflow-hidden rounded-none border shadow-sm sm:rounded-2xl ${themeClasses}`}>
        <div className={`flex min-h-16 items-center justify-between border-b px-4 py-2 backdrop-blur-md ${headerClasses}`}>
          <Link className={headerLinkClasses} href={`/${params.locale}/read`}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-semibold">{t("action.back")}</span>
          </Link>
          <h1 className={headerTitleClasses}>
            {t(`weekday.${day}`)} · {t("screen.reading.title")}
          </h1>
          <Link className={headerLinkClasses} href={`/${params.locale}/read/settings`} aria-label={messages.settings.reading.title}>
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>

        <ScrollProgressBar />

        <div className="space-y-8 p-4 sm:p-6 md:p-10 lg:p-12">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">{isCompleted ? markedMessage : bannerText}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="rounded-xl hover:bg-primary-dark">
                <Link href={signInHref}>{messages.nav.signIn}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href={`/${params.locale}/read/settings`}>{messages.settings.reading.title}</Link>
              </Button>
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

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            {isCompleted ? (
              <button
                type="button"
                disabled
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-6 py-3.5 text-base font-semibold text-primary opacity-70"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {markedMessage}
              </button>
            ) : (
              <form action={markCompleted}>
                <SubmitButton label={markLabel} loadingLabel={t("action.saving")} className="hover:bg-primary-dark" />
              </form>
            )}
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/${params.locale}/read/settings`}>{messages.reading.openSettings}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
