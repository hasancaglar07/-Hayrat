import React, { useState, useEffect, useMemo } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import SettingsItem from "../../components/SettingsItem";
import { useUser } from "../../hooks/useUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RankingStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";

const COUNTRY_OPTIONS = [
  { code: "TR", label: "Türkiye" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "UAE" },
  { code: "ID", label: "Indonesia" },
  { code: "MY", label: "Malaysia" },
  { code: "PK", label: "Pakistan" },
  { code: "IN", label: "India" },
  { code: "BD", label: "Bangladesh" },
  { code: "NL", label: "Netherlands" },
];

// Profile screen with calmer layout (see docs/04-navigation-and-screens.md)
const ProfileScreen: React.FC<NativeStackScreenProps<RankingStackParamList, "Profile">> = () => {
  const { profile, updateProfile } = useUser();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [targetDays, setTargetDays] = useState(profile?.targetReadingDaysPerWeek || 7);
  const [khatmDays, setKhatmDays] = useState(profile?.khatmDurationDays || 7);
  const [showRanking, setShowRanking] = useState(profile?.showInGlobalRanking ?? false);
  const [countrySearch, setCountrySearch] = useState("");

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setTargetDays(profile.targetReadingDaysPerWeek);
      setKhatmDays(profile.khatmDurationDays);
      setShowRanking(profile.showInGlobalRanking);
    }
  }, [profile]);

  const filteredCountries = useMemo(() => {
    const term = countrySearch.trim().toLowerCase();
    if (!term) return COUNTRY_OPTIONS;
    return COUNTRY_OPTIONS.filter((c) => c.code.toLowerCase().includes(term) || c.label.toLowerCase().includes(term));
  }, [countrySearch]);

  const saveProfile = () => {
    if (nickname.trim().length < 3) {
      alert(t("screen.profile.nicknameHint"));
      return;
    }
    updateProfile({ nickname: nickname.trim(), targetReadingDaysPerWeek: targetDays, khatmDurationDays: khatmDays, showInGlobalRanking: showRanking });
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, max: number) => {
    setter((prev) => Math.min(max, Math.max(1, prev + delta)));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.profile.title")} showBack showRankingWidget={false} />
        <View style={{ paddingHorizontal: spacing.screen, paddingTop: 16, gap: 18 }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 18,
            gap: 10,
          }}
        >
          <Text className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {t("screen.profile.basicInfo") || "Basic Info"}
        </Text>
        <Text className="text-base mb-1" style={{ color: colors.textSecondary }}>
          {t("screen.profile.nickname")}
        </Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder={t("screen.profile.nicknameHint")}
          onBlur={saveProfile}
          className="h-11 px-3 rounded-xl"
          style={{ backgroundColor: "#eef1f0", color: colors.textPrimary }}
        />
        <Text className="text-base mt-4 mb-1" style={{ color: colors.textSecondary }}>
          {t("screen.profile.country") || "Country (Optional)"}
        </Text>
          <TextInput
            value={countrySearch}
            onChangeText={setCountrySearch}
            placeholder={t("screen.profile.countrySearch") || "Search country"}
            className="h-10 px-3 rounded-xl"
            style={{ backgroundColor: "#eef1f0", color: colors.textPrimary, marginBottom: 8 }}
          />
          <View className="flex-row flex-wrap gap-2">
            {filteredCountries.map((c) => {
              const active = (profile?.countryCode || "TR") === c.code;
              return (
                <Pressable
                  key={c.code}
                  onPress={() => updateProfile({ countryCode: c.code })}
                  className="px-3 py-2 rounded-full"
                  style={{ backgroundColor: active ? colors.accent : "#eef1f0" }}
                >
                  <Text className="text-base font-semibold" style={{ color: active ? "#fff" : colors.textPrimary }}>
                    {c.code} · {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 18,
            gap: 16,
          }}
        >
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {t("screen.profile.goals") || "Reading Goals"}
          </Text>

          {[
            { label: t("screen.profile.weeklyTarget"), value: targetDays, set: setTargetDays, max: 7 },
            { label: t("screen.profile.khatmDays"), value: khatmDays, set: setKhatmDays, max: 30 },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
                {item.label}
              </Text>
              <View className="flex-row items-center gap-14">
                <Pressable
                  onPress={() => adjust(item.set, -1, item.max)}
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#e8f1ec" }}
                >
                  <Ionicons name="remove" size={18} color={colors.textPrimary} />
                </Pressable>
                <View className="items-center">
                  <Text className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>
                    {item.value}
                  </Text>
                  <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    {t("screen.profile.daysLabel") || "days"}
                  </Text>
                </View>
                <Pressable
                  onPress={() => adjust(item.set, 1, item.max)}
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#e8f1ec" }}
                >
                  <Ionicons name="add" size={18} color={colors.textPrimary} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 16,
          }}
        >
          <SettingsItem
            label={t("screen.profile.showInGlobal")}
            hasSwitch
            description={t("screen.profile.showInGlobalHint")}
            value={showRanking}
            onToggle={(value) => {
              setShowRanking(value);
              updateProfile({ showInGlobalRanking: value });
            }}
          />
        </View>

        <View style={{ paddingVertical: 12 }}>
          <PrimaryButton title={t("screen.profile.save") || "Save / Update"} onPress={saveProfile} />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
