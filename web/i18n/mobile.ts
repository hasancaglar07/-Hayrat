import { fallbackLanguage, translations, type AppLanguage, type Messages, type TranslationValue } from "@delail/i18n";

export type MobileTOptions = {
  count?: number;
  defaultValue?: string;
} & Record<string, string | number | undefined>;

export type MobileT = (key: string, options?: MobileTOptions) => string;

export const supportedMobileLocales: readonly AppLanguage[] = ["tr", "ar", "en", "fr", "id", "es", "de", "pt", "ru", "hi", "ur", "zh"];

const normalizeLocale = (value: string) => value.toLowerCase().replace("_", "-");

const resolveAppLanguage = (locale: string): AppLanguage => {
  const normalized = normalizeLocale(locale);
  const base = normalized.split("-")[0] as AppLanguage;
  if (base in translations) return base;
  return fallbackLanguage;
};

const getDictionary = (locale: string): Messages => {
  const lang = resolveAppLanguage(locale);
  return translations[lang];
};

const interpolate = (template: string, values: Record<string, string | number | undefined>): string => {
  return template.replace(/{{(\w+)}}/g, (_match, key) => String(values[key] ?? ""));
};

const pickPluralKey = (dict: Messages, key: string, count: number | undefined): string => {
  if (typeof count !== "number") return key;
  if (count === 1) return key;
  const pluralKey = `${key}_plural`;
  return pluralKey in dict ? pluralKey : key;
};

const coerceToString = (value: TranslationValue | undefined): string | undefined => {
  if (typeof value === "string") return value;
  return undefined;
};

export const mobileT = (locale: string, key: string, options?: MobileTOptions): string => {
  const dict = getDictionary(locale);
  const fallbackDict = translations[fallbackLanguage];

  const resolvedKey = pickPluralKey(dict, key, options?.count);
  const template =
    coerceToString(dict[resolvedKey]) ??
    coerceToString(fallbackDict[resolvedKey]) ??
    coerceToString(dict[key]) ??
    coerceToString(fallbackDict[key]) ??
    options?.defaultValue ??
    key;

  return interpolate(template, { ...options, count: options?.count });
};

export const getMobileT = (locale: string): MobileT => {
  return (key, options) => mobileT(locale, key, options);
};
