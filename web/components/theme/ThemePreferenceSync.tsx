'use client';

import { useEffect } from "react";

type ThemeOption = "light" | "dark" | "sepia" | "system";

const applyTheme = (theme: ThemeOption) => {
  const root = document.documentElement;
  root.classList.remove("dark", "sepia");
  if (theme === "dark") root.classList.add("dark");
  if (theme === "sepia") root.classList.add("sepia");
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
  }
};

const setThemeCookie = (theme: ThemeOption) => {
  document.cookie = `theme-preference=${theme}; path=/; max-age=31536000; samesite=lax`;
};

export function ThemePreferenceSync({ preference }: { preference?: ThemeOption }) {
  useEffect(() => {
    let next: ThemeOption = "system";

    if (preference) {
      next = preference;
      try {
        localStorage.setItem("theme-preference", next);
      } catch {
        // ignore
      }
    } else {
      try {
        next = (localStorage.getItem("theme-preference") as ThemeOption | null) ?? "system";
      } catch {
        // ignore
      }
    }

    setThemeCookie(next);
    applyTheme(next);
  }, [preference]);

  return null;
}
