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
  const ensureArray = (val: unknown): string[] =>
    Array.isArray(val) ? val.filter((item): item is string => typeof item === "string") : [];
  const sections = [
    {
      title: t("screen.about.whatTitle"),
      body: t("screen.about.whatBody"),
    },
    {
      title: t("screen.about.whoTitle"),
      body: t("screen.about.whoBody"),
    },
  ];

  const benefitsList = ensureArray(t("screen.about.benefitList", { returnObjects: true }));
  const adabList = ensureArray(t("screen.about.adabList", { returnObjects: true }));

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
            {t("screen.about.benefitsTitle")}
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
            {t("screen.about.adabTitle")}
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
