import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList, RootStackParamList } from "../../navigation/types";
import { useUser } from "../../hooks/useUser";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Niyet & hedef ekranı yenilenmiş (see docs/04-navigation-and-screens.md)
const IntentSetupScreen: React.FC<NativeStackScreenProps<OnboardingStackParamList, "IntentSetup">> = ({ navigation }) => {
  const { updateProfile } = useUser();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [targetDays, setTargetDays] = useState(7);
  const [khatmDays, setKhatmDays] = useState(7);
  const [frequencyMode, setFrequencyMode] = useState<"daily" | "perWeek">("daily");
  const [intention, setIntention] = useState(true);

  const toggleWeeklyDay = (delta: number) => {
    setTargetDays((prev) => Math.min(7, Math.max(1, prev + delta)));
  };

  const toggleKhatmDay = (delta: number) => {
    setKhatmDays((prev) => Math.min(30, Math.max(1, prev + delta)));
  };

  const onContinue = async () => {
    if (!intention) {
      Alert.alert(t("screen.intent.title"), t("screen.intent.intentionRequired"));
      return;
    }
    const resolvedTarget = frequencyMode === "daily" ? 7 : targetDays;
    await updateProfile({
      targetReadingDaysPerWeek: resolvedTarget,
      khatmDurationDays: khatmDays,
      onboardingCompleted: true,
    });
    const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    rootNav?.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-1" style={{ paddingHorizontal: spacing.screen, paddingTop: Math.max(16, insets.top + 4) }}>
      <View className="space-y-6">
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View className="space-y-1">
          <Text className="text-2xl font-extrabold" style={{ color: colors.textPrimary, lineHeight: 30 }}>
            {t("screen.intent.title")}
          </Text>
          <Text className="text-lg" style={{ color: colors.textSecondary, lineHeight: 26 }}>
            {t("screen.intent.subtitle")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text className="text-base font-extrabold mb-3" style={{ color: colors.textPrimary }}>
            {t("screen.intent.frequencyTitle")}
          </Text>
          <View className="space-y-3">
            <Pressable
              onPress={() => setFrequencyMode("daily")}
              className="flex-row items-center justify-between px-3 py-3 rounded-2xl"
              style={{
                borderWidth: 1,
                borderColor: frequencyMode === "daily" ? colors.accent : colors.borderMuted,
                backgroundColor: frequencyMode === "daily" ? "#e9f7ef" : colors.card,
              }}
            >
              <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                {t("screen.intent.optionDaily")}
              </Text>
              <Ionicons name="checkmark-circle" size={22} color={frequencyMode === "daily" ? colors.accent : colors.textMuted} />
            </Pressable>

            <View
              className="rounded-2xl"
              style={{ borderWidth: 1, borderColor: frequencyMode === "perWeek" ? colors.accent : colors.borderMuted, padding: 12 }}
            >
              <Pressable
                onPress={() => setFrequencyMode("perWeek")}
                className="flex-row items-center justify-between px-2 py-1"
              >
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {t("screen.intent.optionPerWeek")}
                </Text>
                <Ionicons
                  name={frequencyMode === "perWeek" ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={frequencyMode === "perWeek" ? colors.accent : colors.textMuted}
                />
              </Pressable>
              <View
                className="mt-3 flex-row items-center justify-between px-3 py-3 rounded-2xl"
                style={{ backgroundColor: "#eff5f2" }}
              >
                <Pressable
                  onPress={() => toggleWeeklyDay(-1)}
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#dfe9e4" }}
                >
                  <Ionicons name="remove" size={20} color={colors.textPrimary} />
                </Pressable>
                <Text className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>
                  {targetDays}
                </Text>
                <Pressable
                  onPress={() => toggleWeeklyDay(1)}
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#dfe9e4" }}
                >
                  <Ionicons name="add" size={20} color={colors.textPrimary} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text className="text-base font-extrabold mb-3" style={{ color: colors.textPrimary }}>
            {t("screen.intent.khatmQuestion")}
          </Text>
          <View className="mt-3 flex-row items-center justify-between px-3 py-3 rounded-2xl" style={{ backgroundColor: "#eff5f2" }}>
            <Pressable
              onPress={() => toggleKhatmDay(-1)}
              disabled={khatmDays <= 1}
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "#dfe9e4", opacity: khatmDays <= 1 ? 0.5 : 1 }}
            >
              <Ionicons name="remove" size={20} color={colors.textPrimary} />
            </Pressable>
            <View className="items-center">
              <Text className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>
                {khatmDays}
              </Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                {t("screen.profile.daysLabel")}
              </Text>
            </View>
            <Pressable
              onPress={() => toggleKhatmDay(1)}
              disabled={khatmDays >= 30}
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "#dfe9e4", opacity: khatmDays >= 30 ? 0.5 : 1 }}
            >
              <Ionicons name="add" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => setIntention((prev) => !prev)}
          className="flex-row items-start gap-3"
        >
          <View
            className="h-6 w-6 rounded-md items-center justify-center"
            style={{ backgroundColor: intention ? colors.accent : colors.card, borderColor: colors.border, borderWidth: 1 }}
          >
            {intention ? <Ionicons name="checkmark" size={18} color="#ffffff" /> : null}
          </View>
          <Text className="flex-1 text-base" style={{ color: colors.textPrimary }}>
            {t("screen.intent.intentionText")}
          </Text>
        </Pressable>
      </View>

      <View style={{ paddingVertical: Math.max(28, insets.bottom + 12) }}>
        <PrimaryButton title={t("screen.intent.cta")} onPress={onContinue} />
      </View>
      </View>
    </SafeAreaView>
  );
};

export default IntentSetupScreen;
