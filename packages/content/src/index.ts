export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ReadingSection {
  id: string;
  weekday: Weekday;
  order: number;
  title?: string;
  arabicText: string;
  transliteration?: string;
  translations: Partial<Record<string, string>>;
  estimatedDurationSec?: number;
}

// Dil bazlı okuma içerikleri (mobildeki src/content ile aynı kopya)
import ar from "./readingSections.ar.json";
import en from "./readingSections.en.json";
import es from "./readingSections.es.json";
import fr from "./readingSections.fr.json";
import id from "./readingSections.id.json";
import ru from "./readingSections.ru.json";
import tr from "./readingSections.tr.json";

// JSON importları Weekday alanını string olarak tipliyor; içerik valid olduğu için burada daraltıyoruz.
const arSections = ar as unknown as ReadingSection[];
const enSections = en as unknown as ReadingSection[];
const esSections = es as unknown as ReadingSection[];
const frSections = fr as unknown as ReadingSection[];
const idSections = id as unknown as ReadingSection[];
const ruSections = ru as unknown as ReadingSection[];
const trSections = tr as unknown as ReadingSection[];

export const readingSectionsByLocale: Record<string, ReadingSection[]> = {
  ar: arSections,
  en: enSections,
  es: esSections,
  fr: frSections,
  id: idSections,
  ru: ruSections,
  tr: trSections,
};

export type SupportedContentLocale = keyof typeof readingSectionsByLocale;
