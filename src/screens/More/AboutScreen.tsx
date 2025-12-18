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
  const ensureArray = (val: unknown): string[] =>
    Array.isArray(val) ? val.filter((item): item is string => typeof item === "string") : [];
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.about.title")} showBack showRankingWidget={false} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingVertical: 16, gap: 18 }}>
        <Text className="text-lg font-semibold text-center" style={{ color: colors.textPrimary }}>
          {t("screen.about.heading")}
        </Text>

        <View style={{ gap: 14 }}>
          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.whatTitle")}
          </Text>
          <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
            {t("screen.about.whatBody")}
          </Text>

          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.whoTitle")}
          </Text>
          <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
            {t("screen.about.whoBody")}
          </Text>

          <View className="items-center my-4">
            <View style={{ height: 1, backgroundColor: "#d7e7db", width: "100%" }} />
            <View className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.accent, marginTop: -6 }} />
          </View>

          <Text className="text-xl font-extrabold" style={{ color: colors.accentDark }}>
            {t("screen.about.benefitsTitle")}
          </Text>
          <View style={{ gap: 8 }}>
            {ensureArray(t("screen.about.benefitList", { returnObjects: true })).map((item, idx) => (
              <View key={idx} className="flex-row items-start gap-2">
                <View className="h-2 w-2 rounded-full mt-2" style={{ backgroundColor: colors.accent }} />
                <Text className="flex-1 text-lg leading-7" style={{ color: colors.textSecondary }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Text className="text-xl font-extrabold mt-4" style={{ color: colors.accentDark }}>
            {t("screen.about.adabTitle")}
          </Text>
          <View style={{ gap: 8 }}>
            {ensureArray(t("screen.about.adabList", { returnObjects: true })).map((item, idx) => (
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
