// Local content loader (see docs/07-i18n-and-content.md)
import { AppLanguage, ReadingSection, Weekday } from "./types";
import { readingSectionsByLocale, type ReadingSection as ContentSection } from "@delail/content";

const fallbackContentLocale: AppLanguage = "en";
const arabicTextById = new Map(
  (readingSectionsByLocale.ar ?? []).map((s) => [s.id, s.arabicText] as const),
);

const getLocaleSections = (language: AppLanguage): ContentSection[] => {
  return readingSectionsByLocale[language] ?? readingSectionsByLocale[fallbackContentLocale] ?? [];
};

const mapSection = (section: ContentSection): ReadingSection => ({
  id: section.id,
  weekday: section.weekday as Weekday,
  order: section.order,
  title: section.title,
  arabicText: section.arabicText || arabicTextById.get(section.id) || "",
  transliteration: section.transliteration || undefined,
  translations: section.translations as ReadingSection["translations"],
  estimatedDurationSec: section.estimatedDurationSec,
});

export const getSectionsForDay = (language: AppLanguage, weekday: Weekday): ReadingSection[] => {
  const sections = getLocaleSections(language);
  return sections
    .filter((s) => s.weekday === weekday)
    .map(mapSection)
    .sort((a, b) => a.order - b.order);
};

export const getAllSectionsForLanguage = (language: AppLanguage): ReadingSection[] => getLocaleSections(language).map(mapSection);

export const getSectionById = (language: AppLanguage, id: string): ReadingSection | undefined => {
  const sections = getLocaleSections(language);
  const found = sections.find((s) => s.id === id);
  return found ? mapSection(found) : undefined;
};

export const getTranslationForSection = (id: string, language: AppLanguage): string | undefined => {
  const section = getSectionById(language, id) || getSectionById("en", id);
  if (!section) return undefined;
  return section.translations?.[language] || section.translations?.en;
};
