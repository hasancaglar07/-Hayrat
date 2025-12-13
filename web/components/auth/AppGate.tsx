import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogoMark } from "@/components/media/LogoMark";
import { AuthAutoRedirect } from "@/components/auth/AuthAutoRedirect";

const isSafeInternalPath = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  if (value.includes("://")) return false;
  return true;
};

export function AppGate({ locale, nextPath }: { locale: Locale; nextPath?: string }) {
  const t = getMessages(locale);
  const next = isSafeInternalPath(nextPath) ? nextPath : `/${locale}/app`;

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <header className="sticky top-0 z-40 w-full">
          <div className="liquid-nav relative z-10 w-full overflow-visible">
          <div className="nav-section grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:h-[84px] sm:gap-x-4">
            <Link href={`/${locale}`} className="flex items-center shrink-0 gap-3">
              <LogoMark alt={t.brand} className="h-16 w-16 rounded-2xl ring-1 ring-primary/20 shadow-glow sm:h-20 sm:w-20" />
              <span className="sr-only">{t.brand}</span>
              <span className="hidden max-w-[12rem] truncate sm:block logo-text">
                <span className="logo-accent">{t.brand}</span>
              </span>
            </Link>

            <div className="col-start-3 flex items-center justify-end gap-2">
              <Button asChild variant="outline" size="sm" className="border-primary/25 text-primary hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40">
                <Link href={`/${locale}/read`}>Misafir oku</Link>
              </Button>
              <Button asChild size="sm" className="hover:bg-primary-dark">
                <Link href={`/${locale}/auth?next=${encodeURIComponent(next)}`}>{t.nav.signIn}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-0 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <AuthAutoRedirect locale={locale} nextPath={next} />
          <Card className="rounded-3xl border-primary/15 bg-primary/5">
            <CardContent className="p-5 sm:p-8">
              <h1 className="page-title text-primary">{t.footer.sections.app.links.app}</h1>
              <p className="mt-3 text-base text-text-medium">
                Takip etmek (streak/puan/eksik günler) için giriş yapman gerekir. Okumaya hemen başlamak istersen misafir modunu kullanabilirsin.
              </p>
              <p className="mt-3 text-sm text-text-light">{t.auth.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-auto rounded-2xl px-7 py-4 shadow-soft hover:bg-primary-dark">
                  <Link href={`/${locale}/auth?next=${encodeURIComponent(next)}`}>{t.nav.signIn}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-auto rounded-2xl border-primary/25 px-7 py-4 text-primary shadow-soft hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
                >
                  <Link href={`/${locale}/read`}>Misafir oku</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[26px]">history</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark">{t.footer.sections.app.links.missed}</p>
                <p className="mt-1 text-sm text-text-medium">{t.weekly.missedBannerDesc}</p>
              </div>
            </div>
            <div className="panel flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[26px]">local_fire_department</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark">{t.footer.sections.app.links.ranking}</p>
                <p className="mt-1 text-sm text-text-medium">{t.ranking.subtitle}</p>
              </div>
            </div>
            <div className="panel flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[26px]">tune</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark">{t.nav.settings}</p>
                <p className="mt-1 text-sm text-text-medium">{t.settings.app.title} · {t.settings.reading.title}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
