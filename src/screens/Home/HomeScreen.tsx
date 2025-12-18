import React, { useMemo } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import DayCard from "../../components/DayCard";
import { Weekday } from "../../data/types";
import { useStats } from "../../hooks/useStats";
import { useUser } from "../../hooks/useUser";
import { HomeStackParamList } from "../../navigation/types";
import { colors, radii, spacing } from "../../theme/designTokens";
import { getDateForWeekdayInCurrentWeek, getWeekdayFromDate, isSameWeek, parseDateString, todayDateString } from "../../utils/date";
import { getMissedDays } from "../../utils/missedDays";
import LottieView from "lottie-react-native";
import { BASE_POINTS_TODAY, WEEKLY_BONUS_POINTS } from "../../utils/points";

const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// Home layout tuned in the UI revamp (see docs/04-navigation-and-screens.md & docs/05-reading-experience.md)
const HomeScreen: React.FC<NativeStackScreenProps<HomeStackParamList, "Home">> = ({ navigation }) => {
  const { logs } = useStats();
  const { profile } = useUser();
  const today = todayDateString();
  const todayWeekday = getWeekdayFromDate(today);
  const weeklyTarget = Math.max(1, Math.min(7, profile?.targetReadingDaysPerWeek || 7));
  const tabNav = useNavigation<any>();
  const { t } = useTranslation();

  const statusForDay = (weekday: Weekday) => {
    const dateForDay = getDateForWeekdayInCurrentWeek(weekday, new Date());
    const log = logs.find((l) => l.date === dateForDay && l.completed);
    if (log) return log.mode === "makeup" ? "makeup" : "completed";
    if (dateForDay === today) return "today";
    if (dateForDay < today) return "missed";
    return "upcoming";
  };

  const missedDays = useMemo(
    () => getMissedDays(logs, 7, weeklyTarget, profile?.createdAt ? { startDate: profile.createdAt } : undefined),
    [logs, weeklyTarget, profile?.createdAt]
  );
  const completedThisWeek = useMemo(() => {
    const now = new Date();
    const completed = logs.filter((log) => log.completed && isSameWeek(parseDateString(log.date), now));
    return new Set(completed.map((log) => log.date)).size;
  }, [logs]);

  const weeklyProgressPct = Math.min(100, Math.round((completedThisWeek / weeklyTarget) * 100));
  const todayLabel = t(`weekday.${todayWeekday}`);
  const progressSegments = weekdays.map((w) => statusForDay(w));
  const todayStatus = statusForDay(todayWeekday);
  const todayCompleted = todayStatus === "completed" || todayStatus === "makeup";
  const mosqueAnimation = require("../../../assets/images/Mosque Animation.json");

  const openReading = (weekday: Weekday) => {
    const dateForDay = getDateForWeekdayInCurrentWeek(weekday, new Date());
    tabNav.navigate("ReadingStack", {
      screen: "Reading",
      params: { dayId: weekday, mode: weekday === todayWeekday ? "today" : "makeup", date: dateForDay },
    });
  };

  const openToday = () => openReading(todayWeekday);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={weekdays}
        keyExtractor={(item) => item}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 56 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: spacing.screen, paddingTop: 12, paddingBottom: 16, gap: 18 }}>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: radii.xl,
                padding: spacing.cardPadding + 2,
                gap: 16,
                borderWidth: 1,
                borderColor: colors.borderMuted,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <View style={{ alignItems: "center", gap: 8 }}>
                <View style={{ width: "100%", height: 140 }}>
                  <LottieView source={mosqueAnimation} autoPlay loop style={{ width: "100%", height: "100%" }} />
                </View>
                <View style={{ height: 3, width: "24%", backgroundColor: colors.accentSoft, borderRadius: 999 }} />
                <View
                  style={{
                    backgroundColor: colors.cardMuted,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: radii.pill,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                  }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                    {t("screen.home.weeklyProgressShort", { completed: completedThisWeek, total: weeklyTarget })}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: colors.accentSoft,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: radii.pill,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                    minWidth: 120,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-sm font-semibold" style={{ color: colors.accentDark }}>
                    {todayLabel} · {todayCompleted ? t(`component.dayCard.status.${todayStatus}`) : `+${BASE_POINTS_TODAY}`}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.cardMuted,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: radii.pill,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                    minWidth: 120,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    Bonus +{WEEKLY_BONUS_POINTS}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {progressSegments.map((status, idx) => {
                    const bg =
                      status === "completed" || status === "makeup"
                        ? colors.accent
                        : status === "today"
                        ? colors.accentSoft
                        : status === "missed"
                        ? colors.warningSoft
                        : colors.cardMuted;
                    const border =
                      status === "missed" ? colors.warningBorder : status === "today" ? colors.accent : colors.borderMuted;
                    return (
                      <View
                        key={`${status}-${idx}`}
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 999,
                          backgroundColor: bg,
                          borderWidth: 1,
                          borderColor: border,
                        }}
                      />
                    );
                  })}
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    {t("screen.home.weeklyProgressLabel", { completed: completedThisWeek, total: weeklyTarget })}
                  </Text>
                  <Text className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                    {weeklyProgressPct}%
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={openToday}
                  className="items-center justify-center"
                  style={{
                    backgroundColor: colors.accent,
                    borderRadius: radii.pill,
                    paddingVertical: 12,
                    minHeight: 48,
                    borderWidth: 1,
                    borderColor: colors.accentDark,
                    opacity: todayCompleted ? 0.85 : 1,
                  }}
                >
                  <View className="flex-row items-center gap-10">
                    <View
                      className="h-9 w-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.16)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" }}
                    >
                      <Image source={require("../../../assets/icons/custom/Checkmark_checkmark.png")} style={{ width: 16, height: 16, tintColor: "#ffffff" }} />
                    </View>
                    <Text className="text-base font-semibold" style={{ color: "#ffffff", letterSpacing: 0.15 }} numberOfLines={1} ellipsizeMode="tail">
                      {todayCompleted ? t("screen.home.ctaTodayCompleted") : t("screen.home.ctaToday")}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: radii.pill,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.22)",
                      }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: "#ffffff" }}>
                        {todayCompleted ? t("component.dayCard.status.completed") : `+${BASE_POINTS_TODAY}`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={{ gap: 2 }}>
              <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                {t("screen.home.weeklyTitle")}
              </Text>
              <Text className="text-base" style={{ color: colors.textSecondary }}>
                {t("screen.home.weeklySubtitle")}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: spacing.screen, paddingBottom: 12 }}>
            <DayCard
              weekday={item}
              isToday={item === todayWeekday}
              status={statusForDay(item) as any}
              isFuture={getDateForWeekdayInCurrentWeek(item, new Date()) > today}
              onPress={() => openReading(item)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListFooterComponent={
          <View style={{ paddingHorizontal: spacing.screen, paddingVertical: 16 }}>
            <Pressable
              onPress={() => navigation.navigate("MissedDays")}
              className="p-4"
              style={{
                borderRadius: radii.lg,
                borderWidth: 1,
                borderColor: colors.borderMuted,
                backgroundColor: colors.card,
                gap: 10,
              }}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.accentSoft }}>
                  <Image source={require("../../../assets/icons/custom/Warning_Triangle_warning-triangle.png")} style={{ width: 18, height: 18, tintColor: colors.accent }} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {t("screen.home.missedBannerAlt", { count: missedDays.length })}
                  </Text>
                  <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    {t("screen.home.missedHelper")}
                  </Text>
                </View>
                <Image source={require("../../../assets/icons/custom/Arrow_Down_arrow-down.png")} style={{ width: 14, height: 14, tintColor: colors.textSecondary, transform: [{ rotate: "-90deg" }] }} />
              </View>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
