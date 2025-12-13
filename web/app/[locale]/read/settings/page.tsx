import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { ThemeMode } from "@/lib/core/types";
import { getGuestReadingSettings, guestReadingSettingsCookieName } from "@/lib/guest/readingSettings";
import { clearGuestReadingProgress, getGuestReadingProgress } from "@/lib/guest/readingProgress";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "@/i18n/config";
import type { Weekday } from "@/lib/core/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/read/settings",
    title: `${t.brand} | ${t.settings.reading.title}`,
    description: t.settings.reading.title,
    noindex: true,
  });
}

export default function ReadSettingsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { saved?: string; reset?: string };
}) {
  const t = getMessages(params.locale);
  const anyT = t as unknown as { settings?: { reading?: { autoScrollSpeed?: string } } };
  const readingSettings = getGuestReadingSettings(params.locale);
  const progress = getGuestReadingProgress();
  const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const completedCount = weekdays.reduce((acc, day) => acc + (progress.completed[day] ? 1 : 0), 0);
  const progressLabel = format(t.weekly.progressLabel, { done: completedCount, total: weekdays.length });
  const showArabicDefault = readingSettings.contentLanguages.includes("arabic");
  const showTransliterationDefault = readingSettings.contentLanguages.includes("transliteration");
  const showTranslationDefault = readingSettings.contentLanguages.some((l) => l !== "arabic" && l !== "transliteration");

  const saved = searchParams?.saved === "1";
  const reset = searchParams?.reset === "1";

  const infoText =
    params.locale === "tr"
      ? "Misafir modunda ayarların bu cihazda saklanır. Giriş yaparsan ayarların hesabına bağlanır ve senkron olur."
      : params.locale === "ar"
        ? "في وضع الضيف يتم حفظ الإعدادات على هذا الجهاز فقط. عند تسجيل الدخول ستُحفظ الإعدادات في حسابك وتتم مزامنتها."
        : "In guest mode, settings are stored on this device. If you sign in, settings sync with your account.";

  const saveSettings = async (formData: FormData) => {
    "use server";
    const current = getGuestReadingSettings(params.locale);
    const fontSizeRaw = Number(formData.get("fontSize") ?? current.fontSize);
    const lineHeightRaw = Number(formData.get("lineHeightMultiplier") ?? current.lineHeightMultiplier);
    const showArabic = formData.get("showArabic") === "on";
    const showTransliteration = formData.get("showTransliteration") === "on";
    const showTranslation = formData.get("showTranslation") === "on";
    const autoScroll = formData.get("autoScroll") === "on";
    const autoScrollSpeedRaw = Number(formData.get("autoScrollSpeed") ?? current.autoScrollSpeed ?? 40);
    const themeRaw = formData.get("readingTheme");
    const theme =
      themeRaw === "light" || themeRaw === "dark" || themeRaw === "sepia"
        ? (themeRaw as ThemeMode)
        : current.theme;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const payload = {
      v: 1 as const,
      fontSize: clamp(Math.round(fontSizeRaw || 18), 16, 28),
      lineHeightMultiplier: clamp(Number((lineHeightRaw || 1.4).toFixed(1)), 1.2, 2),
      theme,
      autoScroll,
      autoScrollSpeed: clamp(Math.round(autoScrollSpeedRaw || 40), 10, 120),
      showArabic,
      showTransliteration,
      showTranslation,
    };

    cookies().set(guestReadingSettingsCookieName, JSON.stringify(payload), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    redirect(`/${params.locale}/read/settings?saved=1`);
  };

  const resetProgress = async () => {
    "use server";
    clearGuestReadingProgress();
    redirect(`/${params.locale}/read/settings?reset=1`);
  };

  return (
    <form action={saveSettings} className="space-y-8">
      <Card className="rounded-3xl border-primary/15 bg-primary/5">
        <CardContent className="p-5 sm:p-8">
          <p className="text-sm font-semibold text-primary">{t.settings.reading.title}</p>
          <h1 className="page-title">{t.settings.reading.title}</h1>
          <p className="mt-2 text-sm text-text-medium">{infoText}</p>

          {saved ? (
            <div className="mt-4 rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 text-sm text-text-medium">
              {params.locale === "tr" ? "Ayarlar kaydedildi." : params.locale === "ar" ? "تم حفظ الإعدادات." : "Settings saved."}
            </div>
          ) : null}
          {reset ? (
            <div className="mt-4 rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 text-sm text-text-medium">
              {params.locale === "tr" ? "Misafir okuma ilerlemesi sıfırlandı." : params.locale === "ar" ? "تمت إعادة ضبط تقدم الضيف." : "Guest progress reset."}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="sm" variant="outline" className="border-primary/25 text-primary hover:bg-primary/5">
              <Link href={`/${params.locale}/auth?next=/${params.locale}/app`}>{t.nav.signIn}</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:text-primary">
              <Link href={`/${params.locale}/read`}>{t.reading.back}</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-text-dark">
                {params.locale === "tr" ? "Bu haftaki misafir ilerlemen" : params.locale === "ar" ? "تقدم الضيف لهذا الأسبوع" : "Your guest progress this week"}
              </p>
              <p className="text-sm text-text-medium">{progressLabel}</p>
            </div>
            <Button
              type="submit"
              formAction={resetProgress}
              variant="outline"
              className="w-full border-border text-foreground hover:text-primary"
            >
              {params.locale === "tr" ? "İlerlemeyi sıfırla" : params.locale === "ar" ? "إعادة ضبط التقدم" : "Reset progress"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-primary">{t.settings.title}</p>
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
              <input
                type="checkbox"
                name="showArabic"
                defaultChecked={showArabicDefault}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
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
              <input
                type="checkbox"
                name="autoScroll"
                defaultChecked={readingSettings.autoScroll}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
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
                defaultValue={readingSettings.autoScrollSpeed ?? 40}
                className="w-full accent-primary"
              />
              <span className="text-micro text-text-medium">{readingSettings.autoScrollSpeed ?? 40}px/s</span>
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
