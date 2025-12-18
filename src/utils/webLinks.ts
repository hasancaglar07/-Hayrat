import type { AppLanguage } from "../data/types";

const SUPPORTED_LOCALES: AppLanguage[] = ["tr", "ar", "en", "fr", "id", "es", "de", "pt", "ru", "hi", "ur", "zh"];

export const normalizeLocale = (language?: string, fallback: AppLanguage = "tr"): AppLanguage => {
  const raw = (language ?? "").trim().toLowerCase().replace(/_/g, "-");
  const primary = raw.split("-")[0] as AppLanguage;
  return SUPPORTED_LOCALES.includes(primary) ? primary : fallback;
};

export const getWebBaseUrl = (): string => {
  return (process.env.EXPO_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
};

export const buildLocalizedWebUrl = (path: string, language?: string): string => {
  const baseUrl = getWebBaseUrl();
  if (!baseUrl) return "";
  const locale = normalizeLocale(language);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}/${locale}${normalizedPath}`;
};

