import { readingSectionsByLocale, type ReadingSection as ContentSection } from "@delail/content";
import type { ReadingSection, Weekday } from "../core/types";
import { defaultLocale, type Locale } from "@/i18n/config";

const arabicTextById = new Map(
  (readingSectionsByLocale.ar ?? []).map((s) => [s.id, s.arabicText] as const),
);

const mapSection = (section: ContentSection): ReadingSection => ({
  id: section.id,
  weekday: section.weekday as Weekday,
  order: section.order,
  title: section.title,
  arabicText: section.arabicText || arabicTextById.get(section.id) || "",
  transliteration: section.transliteration || undefined,
  translations: section.translations,
  estimatedDurationSec: section.estimatedDurationSec,
});

export const getSectionsForWeekday = (weekday: Weekday, locale: Locale = defaultLocale): ReadingSection[] => {
  const sections = readingSectionsByLocale[locale] ?? readingSectionsByLocale[defaultLocale] ?? [];
  return sections
    .filter((s) => s.weekday === weekday)
    .map(mapSection)
    .sort((a, b) => a.order - b.order);
};

export const getLocalizedSections = (locale: Locale = defaultLocale): ReadingSection[] => {
  const sections = readingSectionsByLocale[locale] ?? readingSectionsByLocale[defaultLocale] ?? [];
  return sections.map(mapSection);
};
