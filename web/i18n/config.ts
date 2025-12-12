import { tr, type Messages } from "./messages/tr";
import { en } from "./messages/en";
import { ar } from "./messages/ar";
import { zh } from "./messages/zh";
import { hi } from "./messages/hi";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { bn } from "./messages/bn";
import { pt } from "./messages/pt";
import { ru } from "./messages/ru";
import { ur } from "./messages/ur";
import { id } from "./messages/id";
import { de } from "./messages/de";
import { ja } from "./messages/ja";
import { sw } from "./messages/sw";
import { mr } from "./messages/mr";
import { te } from "./messages/te";
import { ta } from "./messages/ta";
import { vi } from "./messages/vi";
import { ko } from "./messages/ko";

export const locales = [
  "tr",
  "en",
  "ar",
  "zh",
  "hi",
  "es",
  "fr",
  "bn",
  "pt",
  "ru",
  "ur",
  "id",
  "de",
  "ja",
  "sw",
  "mr",
  "te",
  "ta",
  "vi",
  "ko",
] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

const dictionaries: Record<Locale, Messages> = {
  tr,
  en,
  ar,
  zh,
  hi,
  es,
  fr,
  bn,
  pt,
  ru,
  ur,
  id,
  de,
  ja,
  sw,
  mr,
  te,
  ta,
  vi,
  ko,
};

export const getMessages = (locale: Locale): Messages => {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
};

export const format = (template: string, values: Record<string, string | number>) =>
  template.replace(/{(\w+)}/g, (_, key) => String(values[key] ?? ""));
