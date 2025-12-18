import React from "react";
import { Text, View, useColorScheme, type ViewStyle } from "react-native";
import { AppLanguage, ContentLanguage, ReadingSection, Weekday } from "../data/types";
import { useSettings } from "../hooks/useSettings";
import { useUser } from "../hooks/useUser";
import { textStyles } from "../theme/typography";
import { getSectionById } from "../data/content";
import { useTranslation } from "react-i18next";
import { resolveTheme } from "../utils/theme";

interface ReadingTextBlockProps {
  section: ReadingSection;
}

// Displays reading content blocks with calmer hierarchy (see docs/05-reading-experience.md)
const ReadingTextBlock: React.FC<ReadingTextBlockProps> = ({ section }) => {
  const { readingSettings, appSettings } = useSettings();
  const { profile } = useUser();
  const { t, i18n } = useTranslation();
  const appLanguage = profile?.appLanguage || appSettings.language || "en";
  const colorScheme = useColorScheme();
  const theme = resolveTheme(appSettings.themePreference, readingSettings.theme, colorScheme);
  const contentLanguages: ContentLanguage[] = readingSettings.contentLanguages?.length
    ? (readingSettings.contentLanguages as ContentLanguage[])
    : ["transliteration", appLanguage];
  const translationLanguages = contentLanguages.filter((lang) => lang !== "arabic" && lang !== "transliteration") as AppLanguage[];
  const showTranslationBadges = translationLanguages.length > 1;
  const fontSize = readingSettings.fontSize;
  const lineHeight = fontSize * readingSettings.lineHeightMultiplier * 1.05;
  const arabicSize = fontSize + 6;
  const arabicLine = arabicSize * readingSettings.lineHeightMultiplier * 1.05;
  const baseColor =
    theme === "dark" ? "#e5e5df" : theme === "sepia" ? "#2c2217" : "#1c1917";
  const mutedColor =
    theme === "dark"
      ? "rgba(229,229,223,0.7)"
      : theme === "sepia"
        ? "rgba(44,34,23,0.7)"
        : "rgba(28,25,23,0.7)";
  const containerStyle: ViewStyle = {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    gap: 12,
  };

  const weekdayFromTr: Record<string, Weekday> = {
    Pazartesi: "monday",
    Salı: "tuesday",
    Çarşamba: "wednesday",
    Perşembe: "thursday",
    Cuma: "friday",
    Cumartesi: "saturday",
    Pazar: "sunday",
  };

  const introLabels: Partial<Record<AppLanguage, string>> = {
    tr: "Giriş",
    en: "Intro",
    ar: "مقدمة",
    es: "Introducción",
    fr: "Introduction",
    de: "Einstieg",
    pt: "Introdução",
    ru: "Вступление",
    hi: "भूमिका",
    ur: "تمہید",
    id: "Pembukaan",
    zh: "引言",
  };

  const formatTitle = (title: string) => {
    const locale = (i18n.language as AppLanguage) || appLanguage;
    const parts = title.split(" ");
    const dayKey = weekdayFromTr[parts[0]] || null;
    const suffix = parts.slice(1).join(" ");
    const localizedDay = dayKey ? t(`weekday.${dayKey}`) || parts[0] : parts[0];
    const introWord = introLabels[locale] || introLabels.en || "Intro";
    const localizedSuffix = suffix.trim().toLowerCase() === "giriş" ? introWord : suffix;
    return [localizedDay, localizedSuffix].filter(Boolean).join(" ").trim();
  };

  const getTranslationText = (language: AppLanguage) => {
    const targetSection = getSectionById(language, section.id) || getSectionById("en", section.id) || section;
    return (
      targetSection?.translations?.[language] ||
      targetSection?.translations?.en ||
      targetSection?.translations?.tr ||
      section.translations?.en ||
      section.translations?.tr
    );
  };

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <View style={containerStyle}>
        {section.title ? (
          <Text className="text-lg font-medium" style={{ color: baseColor, marginTop: 4 }}>
            {formatTitle(section.title)}
          </Text>
        ) : null}
        {contentLanguages.map((lang) => {
          if (lang === "arabic") {
            return (
              <Text
                key={`${section.id}-arabic`}
                style={{
                  fontSize: arabicSize,
                  lineHeight: arabicLine,
                  textAlign: "right",
                  color: baseColor,
                  fontFamily: textStyles.arabic.fontFamily,
                }}
              >
                {section.arabicText}
              </Text>
            );
          }

          if (lang === "transliteration") {
            if (!section.transliteration) return null;
            return (
              <Text key={`${section.id}-transliteration`} style={{ fontSize, lineHeight, color: mutedColor, textAlign: "left" }}>
                {section.transliteration}
              </Text>
            );
          }

          const translation = getTranslationText(lang as AppLanguage);
          if (!translation) return null;
          return (
            <View key={`${section.id}-${lang}`} style={{ gap: showTranslationBadges ? 4 : 0 }}>
              {showTranslationBadges ? (
                <Text className="text-xs font-semibold" style={{ color: mutedColor }}>
                  {(lang as AppLanguage).toUpperCase()}
                </Text>
              ) : null}
              <Text style={{ fontSize: fontSize - 1, lineHeight, color: mutedColor, textAlign: "left" }}>{translation}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ReadingTextBlock;
