"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/tr";
import { useEffect, useMemo, useState } from "react";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { LogoMark } from "@/components/media/LogoMark";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function ReadNav({
  locale,
  t,
  readLabel,
  settingsLabel,
  guestBadgeLabel,
}: {
  locale: Locale;
  t: Messages;
  readLabel: string;
  settingsLabel: string;
  guestBadgeLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let mounted = true;
    supabase?.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });
    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession ?? null);
      }) ?? { data: null };

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    if (!supabase || signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setOpen(false);
      router.replace(`/${locale}`);
      router.refresh();
    }
  };

  const items = [
    { href: `/${locale}/read`, label: readLabel },
    { href: `/${locale}/read/settings`, label: settingsLabel },
    { href: `/${locale}/app/about`, label: t.nav.about },
    { href: `/${locale}/app/info/faq`, label: t.nav.faq },
    { href: `/${locale}/app/donate`, label: t.nav.donate },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="liquid-nav relative z-10 w-full overflow-visible">
        <div className="nav-section grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:h-[84px] sm:gap-x-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-3 md:justify-self-start">
            <Link href={`/${locale}`} className="flex items-center shrink-0 gap-3">
              <LogoMark alt={t.brand} className="h-14 w-14 drop-shadow-sm sm:h-[72px] sm:w-[72px]" />
              <span className="sr-only">{t.brand}</span>
              <span className="hidden max-w-[12rem] truncate sm:block logo-text">
                <span className="logo-accent">{t.brand}</span>
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-micro font-bold text-primary">
              {guestBadgeLabel}
            </span>
          </div>

          <div className="hidden md:flex min-w-0 items-center justify-center px-6 md:col-start-2 md:col-end-3">
            <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
              <div className="mx-auto flex w-max items-center gap-2">
                {items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "inline-flex h-10 items-center rounded-lg px-3.5 text-base font-medium transition-colors whitespace-nowrap",
                        active
                          ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                          : "text-text-medium hover:bg-white/60 hover:text-text-dark dark:hover:bg-background-offwhite/60",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-start-3 flex items-center justify-end gap-2 shrink-0 md:justify-self-end">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="read-mobile-menu"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
            >
              <span className="material-symbols-outlined text-[22px]">{open ? "close" : "menu"}</span>
            </button>

            <LocaleSwitcher variant="dropdown" className="hidden sm:inline-flex" />

            {session ? (
              <>
                <Link
                  className="hidden md:inline-flex h-10 items-center justify-center rounded-lg bg-white/60 px-4 text-base font-semibold text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
                  href={`/${locale}/app/profile`}
                >
                  {t.nav.profile}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="hidden md:inline-flex h-10 items-center justify-center rounded-lg bg-white/60 px-4 text-base font-semibold text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white disabled:opacity-60 dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                className="hidden md:inline-flex h-10 items-center justify-center rounded-lg bg-white/60 px-4 text-base font-semibold text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
                href={`/${locale}/auth?next=/${locale}/app`}
              >
                {t.nav.signIn}
              </Link>
            )}

            <Link
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-teal-500 px-4 text-base font-semibold text-white shadow-soft ring-1 ring-white/10 transition-all hover:brightness-105"
              href={`/${locale}/app`}
            >
              {t.footer.sections.app.links.app}
              <span className="material-symbols-outlined ml-2 text-[18px] hidden sm:inline-block">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div id="read-mobile-menu" className="md:hidden border-t border-border-light/60 liquid-surface">
          <div className="page-section flex flex-col gap-1 py-4">
            <div className="px-3 pb-2">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-micro font-bold text-primary">
                {guestBadgeLabel}
              </span>
            </div>

            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-text-dark hover:bg-gray-50 dark:hover:bg-background-offwhite"
              >
                {item.label}
                <span className="material-symbols-outlined text-[18px] text-text-light">chevron_right</span>
              </Link>
            ))}

            {session ? (
              <>
                <Link
                  href={`/${locale}/app/profile`}
                  className="mt-2 inline-flex items-center justify-center rounded-xl border border-primary/25 bg-white px-4 py-3 text-base font-semibold text-primary shadow-sm hover:bg-primary/5 dark:bg-background-offwhite"
                >
                  {t.nav.profile}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="mt-2 inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-base font-semibold text-text-dark shadow-sm hover:bg-gray-50 disabled:opacity-60 dark:bg-background-offwhite"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/auth?next=/${locale}/app`}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-primary/25 bg-white px-4 py-3 text-base font-semibold text-primary shadow-sm hover:bg-primary/5 dark:bg-background-offwhite"
              >
                {t.nav.signIn}
              </Link>
            )}

            <div className="mt-3 flex justify-center">
              <LocaleSwitcher variant="dropdown" className="flex" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
