import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PRIVACY_POLICY_URL, TERMS_URL, SUPPORT_EMAIL } from "../../constants/config";
import * as WebBrowser from "expo-web-browser";
import { buildLocalizedWebUrl } from "../../utils/webLinks";

// Onboarding intro refined (see docs/04-navigation-and-screens.md and docs/01-overview.md)
const WelcomeScreen: React.FC<NativeStackScreenProps<OnboardingStackParamList, "Welcome">> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const language = i18n.resolvedLanguage || i18n.language;
  const termsUrl = buildLocalizedWebUrl("/app/legal/terms-of-use", language) || TERMS_URL;
  const privacyUrl = buildLocalizedWebUrl("/app/legal/privacy-policy", language) || PRIVACY_POLICY_URL;

  const openLink = async (url: string) => {
    if (!url) return;
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
      await Linking.openURL(mailto);
    }
  };
  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: insets.top + 8 }}
    >
      <View className="flex-1 items-center justify-center">
        <View className="items-center space-y-9">
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: radii.lg,
              backgroundColor: "#d5f1e1",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../../../assets/images/icon.png")} style={{ width: 80, height: 80 }} resizeMode="contain" />
          </View>
          <Text className="text-4xl font-extrabold text-center" style={{ color: colors.textPrimary, lineHeight: 42 }}>
            {t("screen.welcome.title")}
          </Text>
          <Text className="text-lg text-center" style={{ color: colors.textSecondary, lineHeight: 28 }}>
            {t("screen.welcome.subtitle")}
          </Text>
        </View>
      </View>
      <View style={{ paddingBottom: Math.max(32, insets.bottom + 12), gap: 16 }}>
        <PrimaryButton title={t("screen.welcome.cta")} onPress={() => navigation.navigate("IntentSetup")} />
          <Pressable onPress={() => navigation.navigate("IntentSetup")}>
            <Text className="text-base text-center underline" style={{ color: colors.textSecondary }}>
            {t("screen.welcome.guestCta")}
            </Text>
          </Pressable>
        <View style={{ alignItems: "center", gap: 6, paddingTop: 4 }}>
          <Text className="text-xs text-center" style={{ color: colors.textSecondary, lineHeight: 18 }}>
            {t("legal.disclaimer")}
          </Text>
          <View className="flex-row items-center justify-center" style={{ gap: 14 }}>
            <Pressable onPress={() => openLink(termsUrl)}>
              <Text className="text-xs underline" style={{ color: colors.textPrimary }}>
                {t("legal.terms")}
              </Text>
            </Pressable>
            <Pressable onPress={() => openLink(privacyUrl)}>
              <Text className="text-xs underline" style={{ color: colors.textPrimary }}>
                {t("legal.privacy")}
              </Text>
            </Pressable>
            <Pressable onPress={openMail}>
              <Text className="text-xs underline" style={{ color: colors.textPrimary }}>
                {t("legal.support")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
