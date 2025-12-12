import React from "react";
import { Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import FAQItem from "../../components/FAQItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InfoStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, spacing } from "../../theme/designTokens";

// FAQ screen using i18n content (see docs/04-navigation-and-screens.md)
const FAQScreen: React.FC<NativeStackScreenProps<InfoStackParamList, "FAQ">> = () => {
  const { t } = useTranslation();
  const faqDefaults = [
    {
      question: "What is Delâilü’l-Hayrât?",
      answer: "A renowned collection of prayers upon the Prophet Muhammad (peace be upon him), compiled by Imam al-Jazuli.",
    },
    {
      question: "What if I miss a day's reading?",
      answer: "You can complete it as kaza (makeup); the app will guide you to missed days.",
    },
    {
      question: "How is my progress tracked?",
      answer: "Your completions, streak and weekly hedef are tracked locally and counted toward bonuses.",
    },
    {
      question: "Can I change the daily reading time?",
      answer: "Yes, adjust notification time and daily goals in Settings.",
    },
    {
      question: "Is there an audio version of the readings?",
      answer: "Audio is not yet available; follow updates in the app for future releases.",
    },
  ];
  const faqs = faqDefaults.map((item, idx) => ({
    question: t(`screen.info.faq.q${idx + 1}.question`, { defaultValue: item.question }),
    answer: t(`screen.info.faq.q${idx + 1}.answer`, { defaultValue: item.answer }),
  }));
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.info.faq.title")} showBack showRankingWidget={false} />
      <View style={{ paddingHorizontal: spacing.screen, paddingTop: 16, gap: 12 }}>
        <Text className="text-lg" style={{ color: colors.textSecondary, lineHeight: 26 }}>
          {t("screen.info.faq.subtitle") || ""}
        </Text>
        <View style={{ backgroundColor: colors.card, borderRadius: 20, borderColor: colors.borderMuted, borderWidth: 1, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
          {faqs.map((faq, idx) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default FAQScreen;
