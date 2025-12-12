import React from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DonateStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, spacing } from "../../theme/designTokens";

// About screen content pulled from i18n (see docs/04-navigation-and-screens.md)
const AboutScreen: React.FC<NativeStackScreenProps<DonateStackParamList, "About">> = () => {
  const { t } = useTranslation();
  const ensureArray = (val: any, fallback: string[]) => (Array.isArray(val) ? val : fallback);
  const benefitFallback = [
    "Increased love for the Prophet Muhammad (peace be upon him).",
    "Receiving the Prophet's intercession on the Day of Judgment.",
    "Attainment of peace, tranquility, and closeness to the Divine.",
    "Fulfillment of needs and removal of difficulties.",
  ];
  const adabFallback = [
    "Begin with purity by performing ablution (Wudu).",
    "Face the Qibla (direction of prayer) if possible.",
    "Recite with a sincere heart, mindfulness, and humility.",
    "Reflect upon the meanings of the prayers and the status of the Prophet.",
  ];
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.about.title")} showBack showRankingWidget={false} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingVertical: 16, gap: 18 }}>
        <Text className="text-lg font-semibold text-center" style={{ color: colors.textPrimary }}>
          {t("screen.about.heading") || "About Delâilü’l-Hayrât"}
        </Text>

        <View style={{ gap: 14 }}>
          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.whatTitle") || "What is Delâilü’l-Hayrât?"}
          </Text>
          <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
            {t("screen.about.whatBody") ||
              "Delâilü’l-Hayrât is a celebrated collection of prayers for the Islamic prophet Muhammad, authored by the Moroccan Sufi and Islamic scholar Muhammad al-Jazuli. It is one of the most popular and universally acclaimed compilations of blessings upon the Prophet."}
          </Text>

          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.whoTitle") || "Who wrote it?"}
          </Text>
          <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
            {t("screen.about.whoBody") ||
              "It was written by Imam al-Jazuli, a revered scholar from the 15th century. His dedication and love for the Prophet Muhammad inspired him to compile this work, which has since been cherished by millions of Muslims worldwide."}
          </Text>

          <View className="items-center my-4">
            <View style={{ height: 1, backgroundColor: "#d7e7db", width: "100%" }} />
            <View className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.accent, marginTop: -6 }} />
          </View>

          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.benefitsTitle") || "Benefits of reading"}
          </Text>
          <View style={{ gap: 8 }}>
            {ensureArray(t("screen.about.benefitList", { returnObjects: true }), benefitFallback).map((item, idx) => (
              <View key={idx} className="flex-row items-start gap-2">
                <View className="h-2 w-2 rounded-full mt-2" style={{ backgroundColor: colors.accent }} />
                <Text className="flex-1 text-lg leading-7" style={{ color: colors.textSecondary }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Text className="text-xl font-extrabold mt-4" style={{ color: colors.accentDark }}>
            {t("screen.about.adabTitle") || "How to read (adab)"}
          </Text>
          <View style={{ gap: 8 }}>
            {ensureArray(t("screen.about.adabList", { returnObjects: true }), adabFallback).map((item, idx) => (
              <View key={idx} className="flex-row items-start gap-2">
                <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  {idx + 1}.
                </Text>
                <Text className="flex-1 text-lg leading-7" style={{ color: colors.textSecondary }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;
