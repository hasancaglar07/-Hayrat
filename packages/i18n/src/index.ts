export type AppLanguage = "tr" | "ar" | "en" | "fr" | "id" | "es" | "de" | "pt" | "ru" | "hi" | "ur" | "zh";

export type TranslationValue = string | string[];
export type Messages = Record<string, TranslationValue>;

import ar from "./ar.json";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import hi from "./hi.json";
import id from "./id.json";
import pt from "./pt.json";
import ru from "./ru.json";
import tr from "./tr.json";
import ur from "./ur.json";
import zh from "./zh.json";

export const translations: Record<AppLanguage, Messages> = {
  ar,
  de,
  en,
  es,
  fr,
  hi,
  id,
  pt,
  ru,
  tr,
  ur,
  zh,
};

export const fallbackLanguage: AppLanguage = "tr";
