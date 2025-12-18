import React from "react";
import { Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import Slider from "@react-native-community/slider";
import AppHeader from "../../components/AppHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadingStackParamList } from "../../navigation/types";
import SettingsItem from "../../components/SettingsItem";
import { useSettings } from "../../hooks/useSettings";
import { useTranslation } from "react-i18next";
import { AppLanguage, ContentLanguage, ThemeMode } from "../../data/types";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { colors, radii, spacing } from "../../theme/designTokens";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { resolveTheme } from "../../utils/theme";

// Reading settings modal refreshed for calm hierarchy (see docs/05-reading-experience.md)
const ReadingSettingsModal: React.FC<NativeStackScreenProps<ReadingStackParamList, "ReadingSettingsModal">> = () => {
  const { readingSettings, updateReadingSettings, setTheme, updateAppSettings, appSettings } = useSettings();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = resolveTheme(appSettings.themePreference, readingSettings.theme, colorScheme);

  const backgroundColor = "#dfe3e8";
  const cardColor = "#fdfdfd";
  const textPrimary = colors.textPrimary;
  const textMuted = colors.textSecondary;
  const autoScrollEnabled = !!readingSettings.autoScroll;
  const baseLanguages: ContentLanguage[] = ["transliteration"];
  const selectedLanguages = readingSettings.contentLanguages || baseLanguages;
  const showArabic = selectedLanguages.includes("arabic");
  const selectedTranslations = selectedLanguages.filter((lang) => lang !== "arabic" && lang !== "transliteration") as AppLanguage[];

  const lineHeights: { label: string; value: number }[] = [
    { label: t("screen.readingSettings.lineHeightSmall"), value: 1.2 },
    { label: t("screen.readingSettings.lineHeightMedium"), value: 1.4 },
    { label: t("screen.readingSettings.lineHeightLarge"), value: 1.6 },
  ];

  const languageOptions: { code: AppLanguage; label: string }[] = [
    { code: "tr", label: "Türkçe" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "pt", label: "Português" },
    { code: "ru", label: "Русский" },
    { code: "hi", label: "हिन्दी" },
    { code: "ur", label: "اردو" },
    { code: "id", label: "Bahasa Indonesia" },
    { code: "zh", label: "中文" },
  ];

  const toggleLanguage = (code: AppLanguage) => {
    const nextTranslations = selectedTranslations.includes(code)
      ? selectedTranslations.filter((c) => c !== code)
      : [...selectedTranslations, code];
    const nextContentLanguages: ContentLanguage[] = Array.from(new Set([...(showArabic ? (["arabic"] as ContentLanguage[]) : []), ...baseLanguages, ...nextTranslations]));
    updateReadingSettings({ contentLanguages: nextContentLanguages });
  };

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <AppHeader title={t("screen.readingSettings.title")} showBack showRankingWidget={false} />
      <View className="items-center mt-2">
        <View style={{ width: 60, height: 4, borderRadius: 8, backgroundColor: "#c6ccd4" }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 32, paddingTop: 12, gap: 12 }}>
        <View style={{ gap: 14 }}>
          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: radii.xl,
              padding: spacing.cardPadding,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
              {t("screen.readingSettings.section.typography")}
            </Text>

            <View style={{ gap: 12 }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold" style={{ color: textPrimary }}>
                  {t("screen.readingSettings.fontSize", { size: readingSettings.fontSize })}
                </Text>
                <Text className="text-sm" style={{ color: textPrimary }}>
                  {readingSettings.fontSize}pt
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text style={{ color: textMuted, fontSize: 13 }}>A</Text>
                <Slider
                  style={{ flex: 1, marginHorizontal: 12 }}
                  value={readingSettings.fontSize}
                  minimumValue={14}
                  maximumValue={24}
                  step={1}
                  onValueChange={(value) => updateReadingSettings({ fontSize: Math.round(value) })}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor="#cdd5d1"
                  thumbTintColor={colors.accent}
                />
                <Text style={{ color: textPrimary, fontSize: 16, fontWeight: "700" }}>A</Text>
              </View>

              <View className="flex-row items-center gap-2 mt-6">
                <Ionicons name="swap-vertical" size={18} color={textPrimary} />
                <Text className="text-base font-semibold" style={{ color: textPrimary }}>
                  {t("screen.readingSettings.lineHeight", { value: readingSettings.lineHeightMultiplier.toFixed(1) })}
                </Text>
              </View>
              <View className="flex-row bg-[#eef2f0] rounded-full p-2 gap-4">
                {lineHeights.map((opt) => {
                  const active = readingSettings.lineHeightMultiplier.toFixed(1) === opt.value.toFixed(1);
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => updateReadingSettings({ lineHeightMultiplier: opt.value })}
                      className="flex-1 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: active ? colors.accent : "transparent" }}
                    >
                      <Text className="text-sm font-semibold" style={{ color: active ? "#ffffff" : textPrimary }}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: radii.xl,
              padding: spacing.cardPadding,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
              {t("screen.readingSettings.section.content")}
            </Text>
            <View className="bg-white rounded-2xl" style={{ borderColor: "#e6ece8", borderWidth: 1, padding: 14, gap: 12 }}>
              <View style={{ gap: 6 }}>
                <Text className="text-base font-semibold" style={{ color: textPrimary }}>
                  {t("screen.readingSettings.contentLanguagesLabel")}
                </Text>
                <Text className="text-sm" style={{ color: textMuted }}>
                  {t("screen.readingSettings.contentLanguagesHint")}
                </Text>
              </View>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {languageOptions.map((opt) => {
                  const active = selectedTranslations.includes(opt.code);
                  return (
                    <Pressable
                      key={opt.code}
                      onPress={() => toggleLanguage(opt.code)}
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: active ? colors.accent : "#eef2f0" }}
                    >
                      <Text className="text-sm font-semibold" style={{ color: active ? "#fff" : textPrimary }}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ height: 1, backgroundColor: "#e6ece8" }} />
              <SettingsItem
                label={t("screen.readingSettings.showArabic")}
                hasSwitch
                value={showArabic}
                onToggle={(value) =>
                  updateReadingSettings({
                    contentLanguages: Array.from(new Set([...(value ? (["arabic"] as ContentLanguage[]) : []), ...baseLanguages, ...selectedTranslations])),
                  })
                }
              />
              <View style={{ height: 1, backgroundColor: "#e6ece8" }} />
              <SettingsItem
                label={t("screen.readingSettings.autoScroll")}
                hasSwitch
                value={!!readingSettings.autoScroll}
                onToggle={(value) => updateReadingSettings({ autoScroll: value })}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: radii.xl,
              padding: spacing.cardPadding,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-lg font-semibold mb-3" style={{ color: textPrimary }}>
              {t("screen.readingSettings.section.theme")}
            </Text>
            <View className="flex-row bg-white rounded-2xl p-2" style={{ borderColor: "#e6ece8", borderWidth: 1 }}>
              {["light", "dark", "sepia"].map((name) => {
                const active = theme === name;
                return (
                  <Pressable
                    key={name}
                    onPress={() => {
                      setTheme(name as ThemeMode);
                      updateAppSettings({ themePreference: name as ThemeMode });
                    }}
                    className="flex-1 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: active ? colors.accent : "transparent" }}
                  >
                    <Text className="text-sm font-semibold" style={{ color: active ? "#ffffff" : textPrimary }}>
                      {t(`screen.readingSettings.theme.${name}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: radii.xl,
              padding: spacing.cardPadding,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
              {t("screen.readingSettings.section.comfort")}
            </Text>
            <View className="bg-white rounded-2xl" style={{ borderColor: "#e6ece8", borderWidth: 1 }}>
              <SettingsItem
                label={t("screen.readingSettings.screenLock")}
                hasSwitch
                value={!!readingSettings.screenLock}
                onToggle={(value) => updateReadingSettings({ screenLock: value })}
              />
              <View style={{ height: 1, backgroundColor: "#e6ece8" }} />
              <SettingsItem
                label={t("screen.readingSettings.haptics")}
                hasSwitch
                value={!!readingSettings.hapticsEnabled}
                onToggle={(value) => updateReadingSettings({ hapticsEnabled: value })}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: radii.xl,
              padding: spacing.cardPadding,
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
              {t("screen.readingSettings.autoScrollSpeed")}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text style={{ color: textMuted, fontSize: 13 }}>{t("screen.readingSettings.autoScrollSpeedSlow")}</Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 12, opacity: autoScrollEnabled ? 1 : 0.45 }}
                value={readingSettings.autoScrollSpeed || 40}
                minimumValue={10}
                maximumValue={120}
                step={5}
                onValueChange={(value) => updateReadingSettings({ autoScrollSpeed: Math.round(value) })}
                minimumTrackTintColor={autoScrollEnabled ? colors.accent : "#cdd5d1"}
                maximumTrackTintColor="#cdd5d1"
                thumbTintColor={autoScrollEnabled ? colors.accent : "#cdd5d1"}
                disabled={!autoScrollEnabled}
              />
              <Text style={{ color: textPrimary, fontSize: 13, fontWeight: "700" }}>{t("screen.readingSettings.autoScrollSpeedFast")}</Text>
            </View>
            {!autoScrollEnabled ? (
              <Text className="text-xs mt-2" style={{ color: textMuted }}>
                {t("screen.readingSettings.autoScrollHint")}
              </Text>
            ) : (
              <Text className="text-xs mt-2" style={{ color: textMuted }}>
                {t("screen.readingSettings.autoScrollSpeedValue", { value: readingSettings.autoScrollSpeed || 40 })}
              </Text>
            )}
          </View>

          <View style={{ gap: 10, paddingTop: 6, paddingBottom: 12 }}>
            <Text className="text-xs" style={{ color: textMuted }}>
              {t("screen.readingSettings.autosaveNote")}
            </Text>
            <SecondaryButton
              title={t("screen.readingSettings.reset")}
              onPress={() => {
                updateReadingSettings({
                  fontSize: 18,
                  lineHeightMultiplier: 1.4,
                  contentLanguages: ["transliteration", appSettings.language || "tr"],
                  autoScroll: false,
                  autoScrollSpeed: 40,
                  screenLock: false,
                  hapticsEnabled: true,
                });
                setTheme("light");
                updateAppSettings({ themePreference: "light" });
              }}
            />
            <PrimaryButton title={t("action.save")} onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReadingSettingsModal;
