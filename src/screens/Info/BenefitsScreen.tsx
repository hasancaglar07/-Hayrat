import React from "react";
import { ScrollView, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InfoStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, spacing } from "../../theme/designTokens";

// Benefits screen aligned with content docs (see docs/04-navigation-and-screens.md & docs/07-i18n-and-content.md)
const BenefitsScreen: React.FC<NativeStackScreenProps<InfoStackParamList, "Benefits">> = () => {
  const { t } = useTranslation();
  const ensureArray = (val: any, fallback: string[]) => (Array.isArray(val) ? val : fallback);
  const sections = [
    {
      title: t("screen.about.whatTitle") || "What is Delâilü’l-Hayrât?",
      body:
        t("screen.about.whatBody") ||
        "Delâilü’l-Hayrât is a celebrated collection of prayers for the Islamic prophet Muhammad, authored by the Moroccan Sufi and Islamic scholar Muhammad al-Jazuli. It is one of the most popular and universally acclaimed compilations of blessings upon the Prophet.",
    },
    {
      title: t("screen.about.whoTitle") || "Who wrote it?",
      body:
        t("screen.about.whoBody") ||
        "It was written by Imam al-Jazuli, a revered scholar from the 15th century. His dedication and love for the Prophet Muhammad inspired him to compile this work, which has since been cherished by millions of Muslims worldwide.",
    },
  ];

  const benefitsList = ensureArray(t("screen.info.about.benefitList", { returnObjects: true }), [
    t("screen.info.about.benefit1") || "Increased love for the Prophet Muhammad (peace be upon him).",
    t("screen.info.about.benefit2") || "Receiving the Prophet's intercession on the Day of Judgment.",
    t("screen.info.about.benefit3") || "Attainment of peace, tranquility, and closeness to the Divine.",
    t("screen.info.about.benefit4") || "Fulfillment of needs and removal of difficulties.",
  ]);

  const adabList = ensureArray(t("screen.info.about.adabList", { returnObjects: true }), [
    t("screen.info.about.adab1") || "Begin with purity by performing ablution (Wudu).",
    t("screen.info.about.adab2") || "Face the Qibla (direction of prayer) if possible.",
    t("screen.info.about.adab3") || "Recite with a sincere heart, mindfulness, and humility.",
    t("screen.info.about.adab4") || "Reflect upon the meanings of the prayers and the status of the Prophet.",
  ]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.info.benefits.title")} showBack showRankingWidget={false} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingVertical: 16, gap: 18 }}>
        {sections.map((section) => (
          <View key={section.title}>
            <Text className="text-xl font-extrabold mb-3" style={{ color: colors.accentDark, lineHeight: 30 }}>
              {section.title}
            </Text>
            <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
              {section.body}
            </Text>
          </View>
        ))}

        <View className="items-center my-2">
          <View style={{ height: 1, backgroundColor: "#d7e7db", width: "100%" }} />
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: colors.accent, marginTop: -6 }}
          />
        </View>

        <View>
          <Text className="text-xl font-extrabold mb-3" style={{ color: colors.accentDark }}>
            {t("screen.about.benefitsTitle") || "Benefits of reading"}
          </Text>
          {benefitsList.map((benefit, idx) => (
            <View key={idx} className="flex-row items-start gap-2 mb-3">
              <View className="h-2 w-2 rounded-full mt-2" style={{ backgroundColor: colors.accent }} />
              <Text className="flex-1 text-lg leading-7" style={{ color: colors.textSecondary }}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        <View>
          <Text className="text-xl font-extrabold mb-3" style={{ color: colors.accentDark }}>
            {t("screen.about.adabTitle") || "How to read (adab)"}
          </Text>
          {adabList.map((item, idx) => (
            <View key={idx} className="flex-row items-start gap-2 mb-3">
              <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                {idx + 1}.
              </Text>
              <Text className="flex-1 text-lg leading-7" style={{ color: colors.textSecondary }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BenefitsScreen;
