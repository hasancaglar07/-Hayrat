'use client';

import { useEffect, useState } from "react";

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

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("theme-preference") as ThemeOption | null) ?? "system";
    setTheme(stored);
    applyTheme(stored);
    setThemeCookie(stored);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const changeTheme = (next: ThemeOption) => {
    setTheme(next);
    localStorage.setItem("theme-preference", next);
    applyTheme(next);
    setThemeCookie(next);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-background/85 px-2 py-1 text-micro font-semibold text-foreground shadow-sm backdrop-blur">
      {(["system", "light", "dark", "sepia"] as ThemeOption[]).map((opt) => (
        <button
          key={opt}
          onClick={() => changeTheme(opt)}
          className={`rounded-full px-2 py-1 capitalize transition-colors ${theme === opt ? "bg-primary text-white" : "text-text-medium hover:text-primary"}`}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
