import React, { useState, useEffect, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import SettingsItem from "../../components/SettingsItem";
import { useUser } from "../../hooks/useUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RankingStackParamList } from "../../navigation/types";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { useAuth } from "../../hooks/useAuth";

const COUNTRY_CODES = ["TR", "US", "GB", "FR", "DE", "CA", "AU", "SA", "AE", "ID", "MY", "PK", "IN", "BD", "NL"] as const;

const COUNTRY_LABEL_FALLBACK: Record<string, string> = {
  TR: "Türkiye",
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  ID: "Indonesia",
  MY: "Malaysia",
  PK: "Pakistan",
  IN: "India",
  BD: "Bangladesh",
  NL: "Netherlands",
};

// Profile screen with calmer layout (see docs/04-navigation-and-screens.md)
const ProfileScreen: React.FC<NativeStackScreenProps<RankingStackParamList, "Profile">> = () => {
  const { profile, updateProfile } = useUser();
  const { isSignedIn, user, userId: authUserId, signInWithProvider, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [targetDays, setTargetDays] = useState(profile?.targetReadingDaysPerWeek || 7);
  const [khatmDays, setKhatmDays] = useState(profile?.khatmDurationDays || 7);
  const [showRanking, setShowRanking] = useState(profile?.showInGlobalRanking ?? false);
  const [countrySearch, setCountrySearch] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingRankingOptIn, setPendingRankingOptIn] = useState(false);

  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const countryOptions = useMemo(() => {
    let displayNames: Intl.DisplayNames | null = null;
    try {
      displayNames = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      displayNames = null;
    }
    return COUNTRY_CODES.map((code) => ({
      code,
      label: displayNames?.of(code) || COUNTRY_LABEL_FALLBACK[code] || code,
    }));
  }, [locale]);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setTargetDays(profile.targetReadingDaysPerWeek);
      setKhatmDays(profile.khatmDurationDays);
      setShowRanking(profile.showInGlobalRanking);
    }
  }, [profile]);

  useEffect(() => {
    if (!pendingRankingOptIn) return;
    if (!isSignedIn) return;
    setPendingRankingOptIn(false);
    setShowRanking(true);
    updateProfile({ showInGlobalRanking: true });
  }, [isSignedIn, pendingRankingOptIn, updateProfile]);

  const filteredCountries = useMemo(() => {
    const term = countrySearch.trim().toLowerCase();
    if (!term) return countryOptions;
    return countryOptions.filter((c) => c.code.toLowerCase().includes(term) || c.label.toLowerCase().includes(term));
  }, [countryOptions, countrySearch]);

  const saveProfile = () => {
    if (nickname.trim().length < 3) {
      alert(t("screen.profile.nicknameHint"));
      return;
    }
    updateProfile({ nickname: nickname.trim(), targetReadingDaysPerWeek: targetDays, khatmDurationDays: khatmDays, showInGlobalRanking: showRanking });
  };

  const handleGoogleSignIn = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithProvider("google");
    } catch {
      setPendingRankingOptIn(false);
      setAuthError(t("screen.ranking.joinAuthError"));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOut();
    } catch {
      setAuthError(t("screen.ranking.joinError"));
    } finally {
      setAuthBusy(false);
    }
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, max: number) => {
    setter((prev) => Math.min(max, Math.max(1, prev + delta)));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.profile.title")} showBack showRankingWidget={false} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 16, paddingBottom: 32, gap: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 18,
            gap: 10,
          }}
        >
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {t("screen.profile.accountTitle")}
          </Text>
          {isSignedIn ? (
            <View style={{ gap: 8 }}>
              <View style={{ gap: 4 }}>
                <Text className="text-xs font-semibold uppercase" style={{ color: colors.textMuted, letterSpacing: 0.5 }}>
                  {t("screen.profile.accountEmailLabel")}
                </Text>
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {user?.email || "—"}
                </Text>
              </View>
              <View style={{ gap: 4 }}>
                <Text className="text-xs font-semibold uppercase" style={{ color: colors.textMuted, letterSpacing: 0.5 }}>
                  {t("screen.profile.accountIdLabel")}
                </Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {authUserId}
                </Text>
              </View>
              {authError ? (
                <Text className="text-sm" style={{ color: colors.warning }}>
                  {authError}
                </Text>
              ) : null}
              <Pressable
                onPress={handleSignOut}
                disabled={authBusy}
                className="items-center justify-center"
                style={{
                  minHeight: 56,
                  paddingHorizontal: 18,
                  borderRadius: radii.pill,
                  borderColor: colors.warningBorder,
                  borderWidth: 1.5,
                  backgroundColor: colors.warningSoft,
                  opacity: authBusy ? 0.65 : 1,
                }}
              >
                {authBusy ? <ActivityIndicator color={colors.warning} /> : <Text className="text-lg font-semibold" style={{ color: colors.warning }}>{t("action.signOut")}</Text>}
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <Text className="text-base" style={{ color: colors.textSecondary }}>
                {t("screen.profile.accountNotSignedIn")}
              </Text>
              {authError ? (
                <Text className="text-sm" style={{ color: colors.warning }}>
                  {authError}
                </Text>
              ) : null}
              <SecondaryButton title={t("screen.ranking.signInCta")} onPress={handleGoogleSignIn} />
            </View>
          )}
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            padding: 18,
            gap: 10,
          }}
        >
          <Text className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
            {t("screen.profile.basicInfo")}
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
          {t("screen.profile.country")}
        </Text>
          <TextInput
            value={countrySearch}
            onChangeText={setCountrySearch}
            placeholder={t("screen.profile.countrySearch")}
            className="h-10 px-3 rounded-xl"
            style={{ backgroundColor: "#eef1f0", color: colors.textPrimary, marginBottom: 8 }}
          />
          <View className="flex-row flex-wrap gap-2">
            {filteredCountries.map((c) => {
              const active = profile?.countryCode === c.code;
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
            {t("screen.profile.goals")}
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
                    {t("screen.profile.daysLabel")}
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
              if (value && !isSignedIn) {
                setPendingRankingOptIn(true);
                setShowRanking(false);
                handleGoogleSignIn();
                return;
              }
              setPendingRankingOptIn(false);
              setShowRanking(value);
              updateProfile({ showInGlobalRanking: value });
            }}
          />
        </View>

        <View style={{ paddingVertical: 12 }}>
          <PrimaryButton title={t("screen.profile.save")} onPress={saveProfile} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
