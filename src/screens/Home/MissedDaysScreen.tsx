import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View, Image } from "react-native";
import AppHeader from "../../components/AppHeader";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import { useStats } from "../../hooks/useStats";
import { getMissedDays } from "../../utils/missedDays";
import { getWeekdayFromDate } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../../hooks/useSettings";
import { useUser } from "../../hooks/useUser";
import { colors, radii, spacing } from "../../theme/designTokens";

// Kaçan günler listesi refined in the UI revamp (see docs/04-navigation-and-screens.md)
const MissedDaysScreen: React.FC<NativeStackScreenProps<HomeStackParamList, "MissedDays">> = () => {
  const { logs } = useStats();
  const [lookbackDays, setLookbackDays] = useState(7);
  const { profile } = useUser();
  const weeklyTarget = Math.max(1, Math.min(7, profile?.targetReadingDaysPerWeek || 7));
  const missedDays = useMemo(
    () => getMissedDays(logs, lookbackDays, weeklyTarget, profile?.createdAt ? { startDate: profile.createdAt } : undefined),
    [logs, lookbackDays, weeklyTarget, profile?.createdAt]
  );
  const tabNav = useNavigation<any>();
  const { t } = useTranslation();
  const { appSettings } = useSettings();
  const locale = profile?.appLanguage || appSettings.language || "en";

  const formatDateLabel = (date: string) => {
    try {
      const [y, m, d] = date.split("-").map(Number);
      const jsDate = new Date(Date.UTC(y, m - 1, d));
      return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(jsDate);
    } catch {
      return date;
    }
  };

  const openMakeup = (date: string) => {
    const weekday = getWeekdayFromDate(date);
    tabNav.navigate("ReadingStack", { screen: "Reading", params: { dayId: weekday, mode: "makeup", date } });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.missed.title")} showBack showRankingWidget={false} />
      <View style={{ paddingHorizontal: spacing.screen, paddingVertical: 18, gap: 12 }}>
        <Text className="text-lg text-center" style={{ color: colors.textSecondary, lineHeight: 26 }}>
          {t("screen.missed.subtitle")}
        </Text>
        <View className="flex-row items-center justify-center mb-4">
          {[7, 14, 30].map((option) => {
            const active = lookbackDays === option;
            return (
              <Pressable
                key={option}
                onPress={() => setLookbackDays(option)}
                className="px-4 py-2 mx-1 rounded-full"
                style={{
                  backgroundColor: active ? colors.accent : colors.cardMuted,
                  borderWidth: active ? 0 : 1,
                  borderColor: colors.borderMuted,
                }}
              >
                <Text className="text-base font-semibold" style={{ color: active ? "#ffffff" : colors.textPrimary }}>
                  {t("screen.missed.lookback", { count: option })}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {missedDays.length === 0 ? (
          <View className="items-center mt-10">
            <View className="h-24 w-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: colors.accentSoft }}>
              <Image source={require("../../../assets/icons/custom/Checkmark_checkmark.png")} style={{ width: 42, height: 42, tintColor: colors.accent }} />
            </View>
            <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
              {t("screen.missed.emptyTitle")}
            </Text>
            <Text className="text-base mt-2" style={{ color: colors.textSecondary }}>
              {t("screen.missed.emptySubtitle")}
            </Text>
          </View>
        ) : (
          <FlatList
            data={missedDays}
            keyExtractor={(item) => item.date}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => {
              const weekday = getWeekdayFromDate(item.date);
              return (
                <Pressable onPress={() => openMakeup(item.date)}>
                  <View
                    className="flex-row items-center justify-between px-5 py-4"
                    style={{
                      borderRadius: radii.lg,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.borderMuted,
                      shadowColor: colors.shadow,
                      shadowOpacity: 0.12,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                    }}
                  >
                    <View>
                      <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                        {t(`weekday.${weekday}`)}, {formatDateLabel(item.date)}
                      </Text>
                      <View
                        className="mt-2 rounded-full px-3 py-1"
                        style={{ backgroundColor: colors.cardMuted, alignSelf: "flex-start" }}
                      >
                        <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                          {t("screen.missed.notCompleted")}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="rounded-full px-5 py-2"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Text className="text-base font-semibold text-white">{t("screen.missed.readAsMakeup")}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 48 }}
          />
        )}
      </View>
    </View>
  );
};

export default MissedDaysScreen;
