import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Share, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { useStats } from "../../hooks/useStats";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RankingStackParamList } from "../../navigation/types";
import { LeaderboardEntry, Weekday } from "../../data/types";
import { useTranslation } from "react-i18next";
import { useUser } from "../../hooks/useUser";
import { useSettings } from "../../hooks/useSettings";
import { colors, spacing } from "../../theme/designTokens";
import { getDateForWeekdayInCurrentWeek, isSameWeek, parseDateString, todayDateString } from "../../utils/date";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { requestPermission } from "../../utils/notifications";

const WEEK_SEQUENCE: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const AVATARS = [
  require("../../../assets/icons/custom/Profile_Icon_profile-icon.png"),
  require("../../../assets/icons/custom/Home_home.png"),
  require("../../../assets/icons/custom/Book_book.png"),
  require("../../../assets/icons/custom/Trophy_trophy.png"),
];

type PreviewRow = { entry: LeaderboardEntry; position: number };

// Ranking screen refined card layout (see docs/04-navigation-and-screens.md & docs/06-gamification-and-ranking.md)
const RankingScreen: React.FC<NativeStackScreenProps<RankingStackParamList, "Ranking">> = ({ navigation }) => {
  const { stats, logs } = useStats();
  const { profile, updateProfile } = useUser();
  const { appSettings, updateAppSettings, readingSettings } = useSettings();
  const { isSignedIn, signInWithProvider, userId } = useAuth();
  const { t } = useTranslation();
  const optedIn = profile?.showInGlobalRanking ?? false;
  const meUserId = userId || profile?.id || "me";
  const [filter, setFilter] = useState<"week" | "month" | "nearby">("week");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingJoin, setPendingJoin] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [refreshId, setRefreshId] = useState(0);
  const apiBaseUrl = (
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    // If you deploy the Next.js web app, its `/api/leaderboard` route can serve as the mobile API too.
    process.env.EXPO_PUBLIC_SITE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const weekdayKeys: Weekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date();
  const todayKey = weekdayKeys[today.getDay()];
  const todayIso = todayDateString();
  const todayDone = (stats.lastCompletedDate && stats.lastCompletedDate === todayIso) || logs.some((l) => l.date === todayIso && l.completed);
  const weeklyCompleted = useMemo(
    () =>
      logs.filter((l) => {
        if (!l.completed) return false;
        return isSameWeek(parseDateString(l.date), new Date());
      }).length,
    [logs]
  );
  const weeklyTarget = profile?.targetReadingDaysPerWeek || 7;
  const weeklyProgress = Math.min(1, weeklyTarget ? weeklyCompleted / weeklyTarget : 0);
  const weeklyCompletionSet = useMemo(
    () =>
      new Set(
        logs
          .filter((l) => l.completed && isSameWeek(parseDateString(l.date), new Date()))
          .map((l) => l.date)
      ),
    [logs]
  );
  const weekDayProgress = WEEK_SEQUENCE.map((day) => {
    const dateIso = getDateForWeekdayInCurrentWeek(day, today);
    return {
      day,
      dateIso,
      done: weeklyCompletionSet.has(dateIso),
      isToday: day === todayKey || dateIso === todayIso,
    };
  });

  const meEntry = useMemo(
    () => ({
      userId: meUserId,
      nickname: profile?.nickname || t("common.you"),
      totalPoints: stats.totalPoints || 0,
      weeklyPoints: stats.weeklyPoints || 0,
      monthlyPoints: stats.monthlyPoints || 0,
      currentStreakDays: stats.currentStreakDays || 0,
      avatarSource: AVATARS[3],
      countryCode: profile?.countryCode,
    }),
    [meUserId, profile?.countryCode, profile?.nickname, stats.currentStreakDays, stats.monthlyPoints, stats.totalPoints, stats.weeklyPoints, t]
  );
  const fallbackLeaderboard = useMemo(
    () => [
      {
        userId: "1",
        nickname: "Alex R.",
        totalPoints: 3450,
        currentStreakDays: 98,
        avatarSource: AVATARS[0],
      },
      {
        userId: "2",
        nickname: "Maria G.",
        totalPoints: 3120,
        currentStreakDays: 75,
        avatarSource: AVATARS[1],
      },
      {
        userId: "3",
        nickname: "Chen W.",
        totalPoints: 2980,
        currentStreakDays: 62,
        avatarSource: AVATARS[2],
      },
      meEntry,
      {
        userId: "4",
        nickname: "Omar K.",
        totalPoints: 1235,
        currentStreakDays: 21,
        avatarSource: AVATARS[0],
      },
    ],
    [meEntry]
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(fallbackLeaderboard);
  const previewRows = useMemo<PreviewRow[]>(() => {
    const getPointsForFilter = (entry: LeaderboardEntry) => {
      if (filter === "month") return entry.monthlyPoints ?? entry.totalPoints;
      if (filter === "week") return entry.weeklyPoints ?? entry.totalPoints;
      return entry.totalPoints;
    };
    const sorted = leaderboard.slice().sort((a, b) => getPointsForFilter(b) - getPointsForFilter(a));
    if (sorted.length === 0) return [];

    if (filter !== "nearby") {
      return sorted.slice(0, 5).map((entry, idx) => ({ entry, position: idx + 1 }));
    }

    const meIndex = sorted.findIndex((entry) => entry.userId === meUserId);
    if (meIndex < 0) return sorted.slice(0, 5).map((entry, idx) => ({ entry, position: idx + 1 }));

    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(0, meIndex - halfWindow);
    let end = Math.min(sorted.length, start + windowSize);
    start = Math.max(0, end - windowSize);
    return sorted.slice(start, end).map((entry, idx) => ({ entry, position: start + idx + 1 }));
  }, [filter, leaderboard, meUserId]);

  const rankingSummary = useMemo(() => {
    const getPointsForFilter = (entry: LeaderboardEntry) => {
      if (filter === "month") return entry.monthlyPoints ?? entry.totalPoints;
      if (filter === "week") return entry.weeklyPoints ?? entry.totalPoints;
      return entry.totalPoints;
    };
    const sorted = leaderboard.slice().sort((a, b) => getPointsForFilter(b) - getPointsForFilter(a));
    if (!sorted.length) return null;
    const meIndex = sorted.findIndex((entry) => entry.userId === meUserId);
    const myRank = meIndex >= 0 ? meIndex + 1 : 1;
    return { myRank, total: sorted.length };
  }, [filter, leaderboard, meUserId]);
  const daysToBeat = Math.max(0, (stats.longestStreakDays || 0) - (stats.currentStreakDays || 0));
  const shareMessage =
    t("screen.ranking.shareMessage", {
      points: stats.totalPoints || 0,
      streak: stats.currentStreakDays || 0,
    }) || "";
  const prayAnimation = require("../../../assets/images/pray.json");
  const sectionStyle = {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  };
  const insightCards = [
    {
      key: "points",
      label: t("screen.ranking.totalPoints"),
      value: stats.totalPoints || 0,
      icon: "trophy-outline",
    },
    {
      key: "weeklyPoints",
      label: t("screen.ranking.weeklyPoints"),
      value: stats.weeklyPoints || 0,
      icon: "calendar-outline",
      meta: t("screen.ranking.weeklyProgressLabel"),
    },
    {
      key: "monthlyPoints",
      label: t("screen.ranking.monthlyPoints"),
      value: stats.monthlyPoints || 0,
      icon: "stats-chart-outline",
    },
    {
      key: "longestStreak",
      label: t("screen.ranking.longestStreak"),
      value: stats.longestStreakDays || 0,
      suffix: t("screen.ranking.daysSuffix"),
      icon: "flame-outline",
      meta: `${t("screen.ranking.currentStreak")}: ${stats.currentStreakDays || 0}`,
    },
  ];

  const startGoogleOAuth = async () => {
    await signInWithProvider("google");
    if (readingSettings.hapticsEnabled !== false) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSignIn = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await startGoogleOAuth();
      setRefreshId((val) => val + 1);
    } catch {
      setSaveError(t("screen.ranking.joinAuthError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleGlobal = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    if (!optedIn && !apiBaseUrl) {
      setSaveError(
        t("screen.ranking.backendMissing", {
          defaultValue: "Global sıralama şu an aktif değil (sunucu ayarı eksik).",
        })
      );
      setIsSaving(false);
      return;
    }

    // If joining and not signed in, trigger Supabase OAuth
    if (!optedIn && !isSignedIn) {
      setPendingJoin(true);
      try {
        await startGoogleOAuth();
      } catch {
        setPendingJoin(false);
        setSaveError(t("screen.ranking.joinAuthError"));
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
      return;
    }

    // Persist opt-in/out locally (replace with backend call when ready)
    updateProfile({ showInGlobalRanking: !optedIn })
      .then(() => setRefreshId((val) => val + 1))
      .catch(() => setSaveError(t("screen.ranking.joinError")))
      .finally(() => setIsSaving(false));
  };
  const goToTodayReading = () => {
    const parentNav = navigation.getParent() as any;
    parentNav?.navigate("ReadingStack", { screen: "Reading", params: { dayId: todayKey, mode: "today" } });
  };
  const toggleReminder = async () => {
    if (reminderSaving) return;
    setReminderSaving(true);
    setReminderError(null);
    try {
      const nextEnabled = !appSettings.notificationsEnabled;
      if (nextEnabled) {
        const granted = await requestPermission();
        if (!granted) {
          setReminderError(t("notifications.permissionDenied"));
          return;
        }
      }
      await updateAppSettings({ notificationsEnabled: nextEnabled });
      if (readingSettings.hapticsEnabled !== false) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      setReminderError(t("screen.ranking.reminderError"));
    } finally {
      setReminderSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage });
      if (readingSettings.hapticsEnabled !== false) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // no-op share errors
    }
  };

  const handleRetryList = () => {
    setListError(null);
    setRefreshId((val) => val + 1);
  };

  useEffect(() => {
    if (!pendingJoin) return;
    if (!isSignedIn) return;
    setPendingJoin(false);
    setIsSaving(true);
    setSaveError(null);
    updateProfile({ showInGlobalRanking: true })
      .then(() => setRefreshId((val) => val + 1))
      .catch(() => setSaveError(t("screen.ranking.joinError")))
      .finally(() => setIsSaving(false));
  }, [isSignedIn, pendingJoin, t, updateProfile]);

  useEffect(() => {
    if (!usingFallback) return;
    setLeaderboard(fallbackLeaderboard);
  }, [fallbackLeaderboard, usingFallback]);

  useEffect(() => {
    const controller = new AbortController();
    const loadLeaderboard = async () => {
      setIsLoading(true);
      setListError(null);
      const baseUrl = apiBaseUrl;
      const ensureMeIncluded = (list: LeaderboardEntry[]) => {
        return list.some((entry) => entry.userId === meUserId) ? list : [meEntry, ...list];
      };

      if (!baseUrl) {
        setUsingFallback(true);
        setLeaderboard(fallbackLeaderboard);
        setIsLoading(false);
        return;
      }

      type RemoteEntry = {
        id: string;
        name: string;
        country?: string;
        points: number;
        streak: number;
        weeklyPoints?: number;
        monthlyPoints?: number;
      };
      const mapRemote = (row: RemoteEntry): LeaderboardEntry => ({
        userId: row.id,
        nickname: row.name ?? t("common.reader"),
        totalPoints: row.points ?? 0,
        currentStreakDays: row.streak ?? 0,
        weeklyPoints: row.weeklyPoints ?? 0,
        monthlyPoints: row.monthlyPoints ?? 0,
        countryCode: row.country,
      });

      try {
        const response = await fetch(`${baseUrl}/api/leaderboard?limit=50`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`leaderboard_load_failed_${response.status}`);
        }
        const data = (await response.json()) as RemoteEntry[];
        const mapped = Array.isArray(data) ? data.map(mapRemote) : [];
        setLeaderboard(ensureMeIncluded(mapped));
        setUsingFallback(false);
      } catch {
        if (controller.signal.aborted) return;
        setListError(t("screen.ranking.joinError"));
        setLeaderboard(fallbackLeaderboard);
        setUsingFallback(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => controller.abort();
  }, [apiBaseUrl, fallbackLeaderboard, meEntry, meUserId, refreshId, t]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.ranking.title")} showRankingWidget={false} showBack />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingBottom: 40, paddingTop: 16 }}>
        <Text className="text-base" style={{ color: colors.textSecondary, marginBottom: 10 }}>
          {t("screen.ranking.subtitle")}
        </Text>

        <View style={{ gap: 16 }}>
          <View
            style={{
              backgroundColor: colors.accent,
              borderRadius: 24,
              padding: spacing.cardPadding,
              borderWidth: 1,
              borderColor: colors.accentDark,
              overflow: "hidden",
            }}
          >
            <View style={{ position: "absolute", right: -30, top: -16, width: 170, height: 170, backgroundColor: colors.accentSoft, opacity: 0.3, borderRadius: 999 }} />
            <View style={{ position: "absolute", left: -40, bottom: -50, width: 210, height: 210, backgroundColor: colors.cardMuted, opacity: 0.18, borderRadius: 999 }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text className="text-xs font-semibold uppercase" style={{ color: "#e6fffb", letterSpacing: 1 }}>
                  {t("screen.ranking.todayLabel")}
                </Text>
                <Text className="text-2xl font-bold mt-1" style={{ color: "#ffffff" }}>
                  {todayDone ? t("screen.ranking.todayDone") : t("screen.ranking.todayPending")}
                </Text>
                <Text className="text-sm mt-2" style={{ color: "#e2f7f1" }}>
                  {todayDone ? t("screen.ranking.bonusReady") : t("screen.ranking.bonusHint")}
                </Text>
              </View>
              <View style={{ width: 110, height: 110 }}>
                <LottieView source={prayAnimation} autoPlay loop style={{ width: "100%", height: "100%" }} />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: 12,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.25)",
                  gap: 4,
                }}
              >
                <Text className="text-xs font-semibold uppercase" style={{ color: "#d7f4f1", letterSpacing: 0.5 }}>
                  {t("screen.ranking.currentStreak")}
                </Text>
                <Text className="text-xl font-bold" style={{ color: "#ffffff" }}>
                  {stats.currentStreakDays || 0} {t("screen.ranking.daysSuffix")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: 12,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.25)",
                  gap: 6,
                }}
              >
                <Text className="text-xs font-semibold uppercase" style={{ color: "#d7f4f1", letterSpacing: 0.5 }}>
                  {t("screen.ranking.weeklyTargetLabel", { count: weeklyTarget })}
                </Text>
                <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
                  <View style={{ width: `${weeklyProgress * 100}%`, height: "100%", backgroundColor: "#ffffff" }} />
                </View>
                <Text className="text-xs font-semibold" style={{ color: "#e2f7f1" }}>
                  {weeklyCompleted}/{weeklyTarget} {t("screen.ranking.weeklyProgressLabel")}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {weekDayProgress.map((dayInfo) => (
                <View
                  key={dayInfo.day}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 14,
                    minWidth: 64,
                    borderWidth: 1,
                    borderColor: dayInfo.done ? "#ffffff" : "rgba(255,255,255,0.35)",
                    backgroundColor: dayInfo.isToday ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)",
                  }}
                >
                  <Text className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                    {t(`weekday.${dayInfo.day}`).slice(0, 2)}
                  </Text>
                  <View style={{ height: 6, borderRadius: 999, marginTop: 6, backgroundColor: "rgba(255,255,255,0.35)" }}>
                    <View style={{ width: dayInfo.done ? "100%" : "40%", height: "100%", borderRadius: 999, backgroundColor: "#ffffff", opacity: dayInfo.done ? 1 : 0.7 }} />
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              onPress={goToTodayReading}
              style={{
                marginTop: 14,
                alignSelf: "flex-start",
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 999,
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: colors.card,
              }}
            >
              <Text className="text-base font-semibold" style={{ color: colors.accentDark }}>
                {t("screen.ranking.todayCta")}
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {insightCards.map((card) => {
              const formattedValue = typeof card.value === "number" ? card.value.toLocaleString() : card.value;
              return (
                <View
                  key={card.key}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 14,
                    gap: 6,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                    flexBasis: "48%",
                    flexGrow: 1,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        backgroundColor: colors.cardMuted,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.borderMuted,
                      }}
                    >
                      <Ionicons name={card.icon as any} size={18} color={colors.accent} />
                    </View>
                    <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                      {card.label}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {formattedValue} {card.suffix || ""}
                  </Text>
                  {card.meta ? (
                    <Text className="text-xs" style={{ color: colors.textMuted }}>
                      {card.meta}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={toggleReminder}
              disabled={reminderSaving}
              style={{
                flex: 1,
                minHeight: 64,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: appSettings.notificationsEnabled ? colors.accent : colors.borderMuted,
                backgroundColor: appSettings.notificationsEnabled ? colors.accentSoft : colors.cardMuted,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              {reminderSaving ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              )}
              <View style={{ flex: 1 }}>
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {appSettings.notificationsEnabled ? t("screen.ranking.reminderOn") : t("screen.ranking.reminderOff")}
                </Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {t("screen.ranking.todayPending")}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={{
                flex: 1,
                minHeight: 64,
                padding: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderMuted,
                backgroundColor: colors.cardMuted,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Ionicons name="share-social-outline" size={20} color={colors.textPrimary} />
              <View style={{ flex: 1 }}>
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {t("screen.ranking.shareCta")}
                </Text>
                <Text className="text-xs" numberOfLines={1} style={{ color: colors.textSecondary }}>
                  {shareMessage}
                </Text>
              </View>
            </Pressable>
          </View>
          {reminderError && (
            <Text className="text-sm" style={{ color: colors.warning }}>
              {reminderError}
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginTop: 6, gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text className="text-xs font-semibold uppercase" style={{ color: colors.textSecondary, letterSpacing: 0.5 }}>
                {t("screen.ranking.previewTitle")}
              </Text>
              <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                {usingFallback ? t("screen.ranking.previewSubtitle") : t("screen.ranking.previewSubtitleLive")}
              </Text>
              {!apiBaseUrl ? (
                <Text className="text-sm mt-2" style={{ color: colors.warning }}>
                  {t("screen.ranking.backendMissing", {
                    defaultValue: "Global sıralama şu an aktif değil (sunucu ayarı eksik).",
                  })}
                </Text>
              ) : null}
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              {rankingSummary ? (
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: colors.accentSoft,
                    borderWidth: 1,
                    borderColor: colors.accent,
                  }}
                >
                  <Text className="text-sm font-semibold" style={{ color: colors.accentDark }}>
                    #{rankingSummary.myRank} / {rankingSummary.total}
                  </Text>
                </View>
              ) : null}

              {!isSignedIn ? (
                <Pressable
                  onPress={handleSignIn}
                  disabled={isSaving}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: colors.cardMuted,
                    borderWidth: 1,
                    borderColor: colors.borderMuted,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? <ActivityIndicator color={colors.textSecondary} /> : <Ionicons name="logo-google" size={16} color={colors.textSecondary} />}
                  <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    {t("screen.ranking.signInCta")}
                  </Text>
                </Pressable>
              ) : null}

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.cardMuted,
                  borderWidth: 1,
                  borderColor: colors.borderMuted,
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  {optedIn ? t("screen.ranking.joined") : t("screen.ranking.previewBadge")}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              padding: 8,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.borderMuted,
            }}
          >
            {[
              { key: "week", label: t("screen.ranking.filterWeekly") },
              { key: "month", label: t("screen.ranking.filterMonthly") },
              { key: "nearby", label: t("screen.ranking.filterNearby") },
            ].map((opt) => {
              const active = filter === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setFilter(opt.key as "week" | "month" | "nearby")}
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: active ? colors.accent : colors.borderMuted,
                    backgroundColor: active ? colors.accentSoft : colors.cardMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-sm font-semibold" style={{ color: active ? colors.accent : colors.textSecondary }}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: 10 }}>
            {listError ? (
              <View style={{ paddingVertical: 12, alignItems: "center", gap: 8 }}>
                <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  {listError}
                </Text>
                <Pressable
                  onPress={handleRetryList}
                  style={{
                    paddingHorizontal: 16,
                    height: 44,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.cardMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {t("screen.ranking.retry")}
                  </Text>
                </Pressable>
              </View>
            ) : isLoading ? (
              <View style={{ paddingVertical: 12, alignItems: "center" }}>
                <ActivityIndicator color={colors.accent} />
                <Text className="text-sm mt-6" style={{ color: colors.textSecondary }}>
                  {t("screen.ranking.loading")}
                </Text>
              </View>
            ) : previewRows.length === 0 ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
                  {t("screen.ranking.empty")}
                </Text>
              </View>
            ) : (
              previewRows.map((row) => {
                const entry = row.entry;
                const position = row.position;
                const isMe = entry.userId === meUserId;
                const medals = ["🥇", "🥈", "🥉"];
                const topThree = position <= 3;
                const positionLabel = medals[position - 1] || `${position}`;
                return (
                  <View
                    key={entry.userId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 14,
                      gap: 12,
                      borderRadius: 18,
                      backgroundColor: isMe ? colors.accentSoft : colors.card,
                      borderWidth: 1,
                      borderColor: isMe ? colors.accent : topThree ? colors.accentSoft : colors.borderMuted,
                      shadowColor: colors.shadow,
                      shadowOpacity: 0.06,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: topThree ? colors.accentSoft : colors.cardMuted,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.borderMuted,
                      }}
                    >
                      <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                        {positionLabel}
                      </Text>
                    </View>
                    <View className="h-12 w-12 rounded-full bg-white items-center justify-center" style={{ overflow: "hidden" }}>
                      <Image source={entry.avatarSource || AVATARS[0]} style={{ width: 44, height: 44, tintColor: isMe ? colors.accentDark : undefined }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                        {entry.nickname}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {t("screen.ranking.totalPoints")}: {entry.totalPoints} · {t("screen.ranking.currentStreak")}: {entry.currentStreakDays}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 999,
                            backgroundColor: colors.cardMuted,
                            borderWidth: 1,
                            borderColor: colors.borderMuted,
                          }}
                        >
                          <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                            {entry.totalPoints} {t("screen.ranking.pointsSuffix")}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 999,
                            backgroundColor: colors.cardMuted,
                            borderWidth: 1,
                            borderColor: colors.borderMuted,
                          }}
                        >
                          <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                            🔥 {entry.currentStreakDays} {t("screen.ranking.daysSuffix")}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="flame" size={18} color={isMe ? colors.accentDark : colors.accent} />
                      <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                        {entry.currentStreakDays}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          <View style={{ ...sectionStyle, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  {t("screen.ranking.heroTitle")}
                </Text>
                <Text className="text-base mt-1.5 leading-6" style={{ color: colors.textSecondary }}>
                  {t("screen.ranking.heroBody")}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: optedIn ? colors.accentSoft : colors.cardMuted,
                  borderWidth: 1,
                  borderColor: optedIn ? colors.accent : colors.borderMuted,
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: optedIn ? colors.accent : colors.textSecondary }}>
                  {optedIn ? t("screen.ranking.joined") : t("screen.ranking.previewBadge")}
                </Text>
              </View>
            </View>
            <Text className="text-sm leading-6" style={{ color: colors.textSecondary }}>
              {saveError ? saveError : t("screen.ranking.privacyNote")}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={handleToggleGlobal}
                disabled={isSaving || (!optedIn && !apiBaseUrl)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.accent,
                  backgroundColor: colors.accentSoft,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                  opacity: isSaving || (!optedIn && !apiBaseUrl) ? 0.6 : 1,
                }}
              >
                {isSaving && <ActivityIndicator color={colors.accentDark} />}
                <Text className="text-base font-semibold" style={{ color: colors.accentDark }}>
                  {optedIn ? t("screen.ranking.leaveCta") : t("screen.ranking.joinCta")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Profile")}
                className="h-12 items-center justify-center px-5"
                style={{
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.cardMuted,
                  paddingHorizontal: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {t("screen.ranking.editProfile")}
                </Text>
              </Pressable>
            </View>
            <Text className="text-sm leading-6" style={{ color: colors.textMuted }}>
              {t("screen.ranking.authHint")}
            </Text>
          </View>

          <View style={{ ...sectionStyle, marginTop: 6, gap: 10, borderWidth: 1, borderColor: colors.borderMuted }}>
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {t("screen.ranking.recordTitle")}
            </Text>
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              {daysToBeat <= 0
                ? t("screen.ranking.recordAchieved", { days: stats.longestStreakDays || stats.currentStreakDays || 0 })
                : t("screen.ranking.recordChase", { remaining: daysToBeat + 1, target: stats.longestStreakDays || 0 })}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 14,
                  backgroundColor: colors.cardMuted,
                  borderWidth: 1,
                  borderColor: colors.borderMuted,
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  ⭐ {t("screen.ranking.totalPoints")}: {stats.totalPoints || 0}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 14,
                  backgroundColor: colors.cardMuted,
                  borderWidth: 1,
                  borderColor: colors.borderMuted,
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  🔥 {t("screen.ranking.currentStreak")}: {stats.currentStreakDays || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RankingScreen;
