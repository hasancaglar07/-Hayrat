'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { supportedMobileLocales } from "@/i18n/mobile";
import { LogoMark } from "@/components/media/LogoMark";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type NavItem = { href: string; label: string; icon: string };
type NavAction = { href: string; label: string; icon: string };

export function AppNav({
  locale,
  items,
  actions,
  brand,
  streakDays,
  donateHref,
  donateLabel,
  userEmail,
  profileHref,
  profileLabel,
  signOutLabel,
}: {
  locale: Locale;
  items: NavItem[];
  actions?: NavAction[];
  brand: string;
  streakDays?: number;
  donateHref: string;
  donateLabel: string;
  userEmail?: string;
  profileHref?: string;
  profileLabel?: string;
  signOutLabel?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isReadingFocus = pathname.startsWith(`/${locale}/app/reading/`);

  useEffect(() => {
    if (!isReadingFocus || menuOpen) {
      setHidden(false);
      return;
    }

    lastScrollY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        const nearTop = y < 24;
        if (nearTop) setHidden(false);
        else if (delta > 8) setHidden(true);
        else if (delta < -8) setHidden(false);
        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isReadingFocus, menuOpen]);

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase?.auth.signOut();
    } finally {
      router.replace(`/${locale}`);
      router.refresh();
    }
  };

  return (
    <nav
      className={clsx(
        "sticky top-0 z-40 w-full transition-[max-height,opacity] duration-200",
        hidden
          ? "max-h-0 overflow-hidden opacity-0 pointer-events-none md:max-h-none md:opacity-100 md:pointer-events-auto md:overflow-visible"
          : "max-h-[1000px] opacity-100",
      )}
    >
      <div className="liquid-nav relative z-10 w-full overflow-visible">
        <div className="nav-section grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:h-[84px] sm:gap-x-4 md:grid-cols-[1fr_auto_1fr]">
          <Link prefetch={false} href={`/${locale}`} className="flex items-center shrink-0 gap-3 md:justify-self-start">
            <LogoMark alt={brand} className="h-16 w-16 drop-shadow-sm sm:h-20 sm:w-20" />
            <span className="sr-only">{brand}</span>
            <span className="hidden max-w-[12rem] truncate sm:block logo-text">
              <span className="logo-accent">{brand}</span>
            </span>
          </Link>

          <div className="hidden md:flex min-w-0 items-center justify-center px-6 md:col-start-2 md:col-end-3">
            <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
              <div className="mx-auto flex w-max items-center gap-2">
                {items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
                  const href = item.href === `/${locale}/app/settings` ? `${item.href}?next=${encodeURIComponent(current)}` : item.href;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      prefetch={false}
                      className={clsx(
                        "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-base font-medium transition-colors whitespace-nowrap",
                        active
                          ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                          : "text-text-medium hover:bg-white/60 hover:text-text-dark dark:hover:bg-background-offwhite/60",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
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
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="app-mobile-menu"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
            >
              <span className="material-symbols-outlined text-[22px]">{menuOpen ? "close" : "menu"}</span>
            </button>
            {streakDays && streakDays > 0 ? (
              <div className="hidden items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-micro font-bold text-orange-600 sm:flex">
                <span className="material-symbols-outlined text-[18px] filled text-orange-500">local_fire_department</span>
                {streakDays}
              </div>
            ) : null}
            {actions?.map((action) => {
              const active = pathname.startsWith(action.href);
              const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
              const href = action.href === `/${locale}/app/settings` ? `${action.href}?next=${encodeURIComponent(current)}` : action.href;
              return (
                <Link
                  key={action.href}
                  href={href}
                  prefetch={false}
                  className={clsx(
                    "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white hover:text-primary dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite",
                    active && "bg-primary/10 text-primary ring-primary/20",
                  )}
                  aria-current={active ? "page" : undefined}
                  aria-label={action.label}
                  title={action.label}
                >
                  <span className="material-symbols-outlined text-[22px]">{action.icon}</span>
                </Link>
              );
            })}
            {profileHref ? (
              <Link
                href={profileHref}
                prefetch={false}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white hover:text-primary dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
                aria-label={profileLabel ?? "Profile"}
                title={userEmail ?? profileLabel ?? "Profile"}
              >
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
              </Link>
            ) : null}
            {signOutLabel ? (
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur transition-colors hover:bg-white hover:text-primary disabled:opacity-60 dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
                aria-label={signOutLabel}
                title={signOutLabel}
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </button>
            ) : null}
            <LocaleSwitcher variant="dropdown" className="hidden sm:inline-flex" availableLocales={supportedMobileLocales} />
            <Link
              href={donateHref}
              prefetch={false}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary/10 px-4 text-base font-semibold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15"
            >
              {donateLabel}
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id="app-mobile-menu"
          className="md:hidden border-t border-border-light/60 liquid-surface"
        >
          <div className="page-section flex flex-col gap-1 py-4">
            {items.map((item) => {
              const active = pathname.startsWith(item.href);
              const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
              const href = item.href === `/${locale}/app/settings` ? `${item.href}?next=${encodeURIComponent(current)}` : item.href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  prefetch={false}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold",
                    active ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-gray-50 dark:hover:bg-background-offwhite",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-text-light">chevron_right</span>
                </Link>
              );
            })}

            {profileHref || signOutLabel ? (
              <div className="mt-2 border-t border-border-light/60 pt-2">
                {userEmail ? (
                  <div className="px-3 py-2 text-xs font-semibold text-text-light truncate">{userEmail}</div>
                ) : null}
                {profileHref ? (
                  <Link
                    href={profileHref}
                    prefetch={false}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-text-dark hover:bg-gray-50 dark:hover:bg-background-offwhite"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      {profileLabel ?? "Profile"}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-text-light">chevron_right</span>
                  </Link>
                ) : null}
                {signOutLabel ? (
                  <button
                    type="button"
                    onClick={signOut}
                    disabled={signingOut}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-text-dark hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-background-offwhite"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      {signOutLabel}
                    </span>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
