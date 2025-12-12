import { NativeModules, Platform } from "react-native";
import { AppLanguage } from "../data/types";

const supportedLanguages: AppLanguage[] = ["tr", "ar", "en", "fr", "id", "es", "de", "pt", "ru", "hi", "ur", "zh"];
const defaultLanguage: AppLanguage = "tr";

const aliasMap: Record<string, AppLanguage> = {
  in: "id", // old Indonesian code
  "pt-br": "pt",
  "pt-pt": "pt",
  "zh-cn": "zh",
  "zh-tw": "zh",
  "zh-hans": "zh",
  "zh-hant": "zh",
};

const normalizeLocale = (value?: string) => value?.toLowerCase().replace("_", "-") || "";

const localeCandidates = () => {
  const candidates: string[] = [];
  try {
    const intlLocale = Intl?.DateTimeFormat?.().resolvedOptions().locale;
    if (intlLocale) candidates.push(intlLocale);
  } catch {
    // ignore
  }

  if (Platform.OS === "ios") {
    const settings = NativeModules.SettingsManager?.settings;
    const appleLanguages: string[] | undefined = settings?.AppleLanguages;
    if (Array.isArray(appleLanguages)) candidates.push(...appleLanguages);
    if (settings?.AppleLocale) candidates.push(settings.AppleLocale as string);
  } else {
    const localeId: string | undefined = NativeModules.I18nManager?.localeIdentifier;
    if (localeId) candidates.push(localeId);
  }

  return candidates.map(normalizeLocale).filter(Boolean);
};

const mapLocaleToLanguage = (locale: string): AppLanguage | null => {
  if (!locale) return null;
  if (aliasMap[locale]) return aliasMap[locale];

  const base = locale.split("-")[0];
  if (aliasMap[base]) return aliasMap[base];

  if (supportedLanguages.includes(locale as AppLanguage)) return locale as AppLanguage;
  if (supportedLanguages.includes(base as AppLanguage)) return base as AppLanguage;

  return null;
};

export const getDefaultAppLanguage = (): AppLanguage => {
  for (const loc of localeCandidates()) {
    const matched = mapLocaleToLanguage(loc);
    if (matched) return matched;
  }
  return defaultLanguage;
};
