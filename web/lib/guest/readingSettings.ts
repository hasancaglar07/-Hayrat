import { cookies } from "next/headers";
import type { Locale } from "@/i18n/config";
import type { ContentLanguage, ReadingSettings, ThemeMode } from "@/lib/core/types";
import { defaultReadingSettings } from "@/lib/data/settings";

export const guestReadingSettingsCookieName = "guest-reading-settings";

type StoredGuestReadingSettingsV1 = {
  v?: 1;
  fontSize?: number;
  lineHeightMultiplier?: number;
  theme?: ThemeMode;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  showArabic?: boolean;
  showTransliteration?: boolean;
  showTranslation?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const isThemeMode = (value: unknown): value is ThemeMode => value === "light" || value === "dark" || value === "sepia";

const buildContentLanguages = (locale: Locale, opts: { showArabic: boolean; showTransliteration: boolean; showTranslation: boolean }): ContentLanguage[] => {
  const langs: ContentLanguage[] = [];
  if (opts.showArabic) langs.push("arabic");
  if (opts.showTransliteration) langs.push("transliteration");
  if (opts.showTranslation) langs.push(locale as ContentLanguage);
  return langs.length ? langs : ["arabic", "transliteration", locale as ContentLanguage];
};

export const getDefaultGuestReadingSettings = (locale: Locale): ReadingSettings => {
  const base = defaultReadingSettings;
  const showArabic = base.contentLanguages.includes("arabic");
  const showTransliteration = base.contentLanguages.includes("transliteration");
  const showTranslation = base.contentLanguages.some((l) => l !== "arabic" && l !== "transliteration");
  return {
    ...base,
    contentLanguages: buildContentLanguages(locale, { showArabic, showTransliteration, showTranslation }),
  };
};

export const getGuestReadingSettings = (locale: Locale): ReadingSettings => {
  const defaults = getDefaultGuestReadingSettings(locale);
  const raw = cookies().get(guestReadingSettingsCookieName)?.value;
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as StoredGuestReadingSettingsV1;
    const fontSize =
      typeof parsed.fontSize === "number" && Number.isFinite(parsed.fontSize)
        ? clamp(Math.round(parsed.fontSize), 16, 28)
        : defaults.fontSize;
    const lineHeightMultiplier =
      typeof parsed.lineHeightMultiplier === "number" && Number.isFinite(parsed.lineHeightMultiplier)
        ? clamp(Number(parsed.lineHeightMultiplier.toFixed(1)), 1.2, 2)
        : defaults.lineHeightMultiplier;
    const theme = isThemeMode(parsed.theme) ? parsed.theme : defaults.theme;
    const autoScroll = typeof parsed.autoScroll === "boolean" ? parsed.autoScroll : Boolean(defaults.autoScroll);
    const autoScrollSpeed =
      typeof parsed.autoScrollSpeed === "number" && Number.isFinite(parsed.autoScrollSpeed)
        ? clamp(Math.round(parsed.autoScrollSpeed), 10, 120)
        : defaults.autoScrollSpeed ?? 40;
    const showArabic = typeof parsed.showArabic === "boolean" ? parsed.showArabic : defaults.contentLanguages.includes("arabic");
    const showTransliteration =
      typeof parsed.showTransliteration === "boolean"
        ? parsed.showTransliteration
        : defaults.contentLanguages.includes("transliteration");
    const showTranslation =
      typeof parsed.showTranslation === "boolean"
        ? parsed.showTranslation
        : defaults.contentLanguages.some((l) => l !== "arabic" && l !== "transliteration");

    return {
      ...defaults,
      fontSize,
      lineHeightMultiplier,
      theme,
      autoScroll,
      autoScrollSpeed,
      contentLanguages: buildContentLanguages(locale, { showArabic, showTransliteration, showTranslation }),
    };
  } catch {
    return defaults;
  }
};

