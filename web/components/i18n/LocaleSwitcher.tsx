'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { defaultLocale, locales } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";

const isLocale = (segment: string | undefined) => (locales as readonly string[]).includes(segment ?? "");

export function LocaleSwitcher({
  className,
  variant = "tabs",
  availableLocales,
}: {
  className?: string;
  variant?: "tabs" | "dropdown";
  availableLocales?: readonly string[];
}) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/");
  const allLocales = availableLocales?.length ? availableLocales : locales;
  const localeFromPath = isLocale(segments[1]) ? segments[1] : defaultLocale;
  const currentLocale = allLocales.includes(localeFromPath) ? localeFromPath : defaultLocale;
  const restPath = isLocale(segments[1]) ? `/${segments.slice(2).join("/")}` : pathname;
  const rest = restPath === "/" ? "" : restPath;

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  if (variant === "dropdown") {
    return (
      <div ref={wrapperRef} className={clsx("relative inline-flex", className)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background/85 px-2.5 py-1.5 text-micro font-semibold text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
        >
          <span className="uppercase">{currentLocale}</span>
          <span className="material-symbols-outlined text-[16px] text-text-medium">
            {open ? "expand_less" : "expand_more"}
          </span>
        </button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-2 min-w-[4.5rem] rounded-2xl border border-border bg-background/95 p-1 text-micro font-semibold shadow-lg backdrop-blur"
          >
            {allLocales.map((loc) => (
              <Link
                key={loc}
                href={`/${loc}${rest}`}
                onClick={() => setOpen(false)}
                role="menuitem"
                className={clsx(
                  "flex items-center rounded-xl px-3 py-2 uppercase transition-colors",
                  loc === currentLocale
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary/60 hover:text-primary",
                )}
                aria-current={loc === currentLocale ? "page" : undefined}
              >
                {loc}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-1 rounded-full border border-border bg-background/85 px-2 py-1 text-micro font-semibold text-foreground shadow-sm backdrop-blur",
        className,
      )}
    >
      {allLocales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest}`}
          className={clsx(
            "rounded-full px-2 py-1 uppercase transition-colors",
            loc === currentLocale ? "bg-primary text-white" : "text-text-medium hover:text-primary",
          )}
          aria-current={loc === currentLocale ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
