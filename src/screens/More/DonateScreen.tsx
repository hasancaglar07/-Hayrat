import React from "react";
import { Text, View, Alert, Linking, ScrollView } from "react-native";
import AppHeader from "../../components/AppHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DonateStackParamList } from "../../navigation/types";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import { DONATION_URL, DONATION_METRICS, PRIVACY_POLICY_URL, TERMS_URL, SUPPORT_EMAIL } from "../../constants/config";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { buildLocalizedWebUrl } from "../../utils/webLinks";

// Donate screen with gentle copy (see docs/04-navigation-and-screens.md)
const DonateScreen: React.FC<NativeStackScreenProps<DonateStackParamList, "Donate">> = () => {
  const { t, i18n } = useTranslation();
  const nav = useNavigation<any>();
  const language = i18n.resolvedLanguage || i18n.language;
  const donationUrl = buildLocalizedWebUrl("/app/donate", language) || DONATION_URL;
  const privacyUrl = buildLocalizedWebUrl("/app/legal/privacy-policy", language) || PRIVACY_POLICY_URL;
  const termsUrl = buildLocalizedWebUrl("/app/legal/terms-of-use", language) || TERMS_URL;

  const openExternal = async (url: string, fallbackTitle?: string) => {
    if (!url) {
      Alert.alert(fallbackTitle || t("screen.donate.title"), t("screen.donate.note"));
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await WebBrowser.openBrowserAsync(url);
    } else {
      await Linking.openURL(url);
    }
  };

  const openMail = async () => {
    const mailto = `mailto:${SUPPORT_EMAIL}`;
    const supported = await Linking.canOpenURL(mailto);
    if (supported) {
      await Linking.openURL(mailto);
    } else {
      Alert.alert(t("legal.support"), SUPPORT_EMAIL);
    }
  };
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.donate.title")} showBack showRankingWidget={false} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 16, paddingBottom: 32, gap: 20 }}>
        <View style={{ gap: 12 }}>
          <Text className="text-3xl font-extrabold" style={{ color: colors.textPrimary, lineHeight: 38 }}>
            {t("screen.donate.heroTitle")}
          </Text>
          <Text className="text-lg leading-7" style={{ color: colors.textSecondary }}>
            {t("screen.donate.body")}
          </Text>
        </View>

        <View className="flex-row justify-between">
            {[
            { value: DONATION_METRICS.countries, label: t("screen.donate.countries") },
            { value: DONATION_METRICS.readings, label: t("screen.donate.readings") },
          ].map((item) => (
            <View key={item.label} className="items-start">
              <Text className="text-3xl font-extrabold" style={{ color: colors.textPrimary }}>
                {item.value}
              </Text>
              <Text className="text-base" style={{ color: colors.textSecondary }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 18,
            gap: 10,
            borderWidth: 1,
            borderColor: colors.borderMuted,
            shadowColor: colors.shadow,
            shadowOpacity: 0.1,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 5 },
          }}
        >
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {t("screen.donate.online")}
          </Text>
          <Text className="text-base" style={{ color: colors.textSecondary, lineHeight: 24 }}>
            {t("screen.donate.onlineBody")}
          </Text>
          <PrimaryButton
            title={t("action.openDonation")}
            onPress={() => openExternal(donationUrl, t("screen.donate.online"))}
          />
        </View>

        <View style={{ gap: 10, paddingBottom: 12 }}>
          <SecondaryButton title={t("screen.about.title")} onPress={() => nav.navigate("About")} />
          <SecondaryButton title={t("screen.settings.title")} onPress={() => nav.navigate("AppSettings")} />
          <SecondaryButton title={t("screen.info.faq.title")} onPress={() => nav.navigate("FAQ")} />
          <SecondaryButton title={t("screen.info.benefits.title")} onPress={() => nav.navigate("Benefits")} />
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 16,
            gap: 12,
            borderWidth: 1,
            borderColor: colors.borderMuted,
          }}
        >
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {t("screen.donate.legalTitle")}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary, lineHeight: 20 }}>
            {t("screen.donate.legalSubtitle")}
          </Text>
          <View style={{ gap: 8, paddingTop: 4 }}>
            <SecondaryButton title={t("legal.privacy")} onPress={() => openExternal(privacyUrl, t("legal.privacy"))} />
            <SecondaryButton title={t("legal.terms")} onPress={() => openExternal(termsUrl, t("legal.terms"))} />
            <SecondaryButton title={t("legal.support")} onPress={openMail} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DonateScreen;
