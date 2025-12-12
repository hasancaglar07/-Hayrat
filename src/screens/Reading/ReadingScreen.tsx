import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { FlatList, ActivityIndicator, Pressable, Text, View, Image, Animated, useWindowDimensions } from "react-native";
import AppHeader from "../../components/AppHeader";
import ReadingTextBlock from "../../components/ReadingTextBlock";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadingStackParamList } from "../../navigation/types";
import { getSectionsForDay } from "../../data/content";
import { useSettings } from "../../hooks/useSettings";
import { useUser } from "../../hooks/useUser";
import { useReading } from "../../hooks/useReading";
import { todayDateString, getWeekdayFromDate, isSameWeek } from "../../utils/date";
import { useTranslation } from "react-i18next";
import { colors, radii, spacing } from "../../theme/designTokens";
import {
  BASE_POINTS_MAKEUP,
  BASE_POINTS_TODAY,
  STREAK_MILESTONE_BONUS,
  WEEKLY_BONUS_POINTS,
  calculatePoints,
} from "../../utils/points";
import { useStats } from "../../hooks/useStats";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { calculateStreak, isStreakMilestone } from "../../utils/streak";

// Reading flow implementation, UI refined in the revamp for calmer reading (see docs/05-reading-experience.md)
const ReadingScreen: React.FC<NativeStackScreenProps<ReadingStackParamList, "Reading">> = ({ route, navigation }) => {
  const fallbackDayId = getWeekdayFromDate(todayDateString());
  const { dayId = fallbackDayId, mode = "today", date } = route.params || {};
  const { appSettings, readingSettings, updateReadingSettings } = useSettings();
  const { profile } = useUser();
  const { completeReading, setBookmark, lastReadingPosition, isLoading, startReading } = useReading();
  const { logs } = useStats();
  const { height } = useWindowDimensions();
  const language = profile?.appLanguage || appSettings.language || "en";
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastOffsetRef = useRef(0);
  const lastScrollY = useRef(0);
  const chromeAnim = useRef(new Animated.Value(0)).current;
  const [chromeHidden, setChromeHidden] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusRailAnim = useRef(new Animated.Value(0.25)).current;
  const focusRailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoControlAnim = useRef(new Animated.Value(0)).current;
  const autoControlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveBookmarkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoControlVisible, setAutoControlVisible] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const keepAwakeTag = "reading-screen";

  const sections = useMemo(() => getSectionsForDay(language, dayId), [language, dayId]);
  const dayLabel = t(`weekday.${dayId}`);
  const weeklyTarget = Math.max(1, Math.min(7, profile?.targetReadingDaysPerWeek || 7));
  const sectionTotal = sections.length;
  const hasSections = sectionTotal > 0;
  const progressCurrent = hasSections ? Math.min(currentIndex + 1, sectionTotal) : 0;
  const progressPercent = hasSections ? Math.min(100, Math.round((progressCurrent / sectionTotal) * 100)) : 0;
  const readingDate = date || todayDateString();
  const readingWeekday = useMemo(() => getWeekdayFromDate(readingDate), [readingDate]);
  const prospectiveBonuses = useMemo(() => {
    const completionDateObj = new Date(`${readingDate}T00:00:00Z`);
    const prospectiveLog = {
      date: readingDate,
      weekday: readingWeekday,
      completed: true,
      mode,
      pointsEarned: 0,
      completedAt: new Date().toISOString(),
    };
    const logsWithoutCurrent = logs.filter((l) => l.date !== readingDate);
    const prospectiveLogs = [...logsWithoutCurrent, prospectiveLog];
    const weekLogs = prospectiveLogs.filter(
      (l) => l.completed && isSameWeek(new Date(`${l.date}T00:00:00Z`), completionDateObj)
    );
    const inCurrentWeek = isSameWeek(completionDateObj, new Date());
    const completedDates = new Set(weekLogs.map((l) => l.date));
    const weekComplete = inCurrentWeek && completedDates.size >= weeklyTarget;
    const streakPreview = calculateStreak(prospectiveLogs);
    const milestone = isStreakMilestone(streakPreview.currentStreakDays);
    const totalPoints = calculatePoints({
      mode,
      allWeekComplete: mode === "today" ? weekComplete : false,
      isStreakMilestone: milestone,
    });
    return { weekComplete, milestone, totalPoints };
  }, [logs, mode, readingDate, readingWeekday, weeklyTarget]);
  const weeklyComplete = prospectiveBonuses.weekComplete;
  const streakMilestone = prospectiveBonuses.milestone;
  const showWeeklyBonus = (weeklyComplete || streakMilestone) && mode === "today" && sections.length > 0;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(10)).current;
  const iconTint = readingSettings.theme === "dark" ? "#f5f5f0" : readingSettings.theme === "sepia" ? "#3b2f2f" : colors.textPrimary;
  const bottomInset = Math.max(insets.bottom, 12);
  const requiredTimeSec = useMemo(() => {
    const estimated = sections.reduce((acc, section) => acc + (section.estimatedDurationSec || 0), 0);
    if (estimated > 0) return Math.max(60, Math.min(estimated, 240)); // clamp for fairness
    return 60;
  }, [sections]);
  const remainingSeconds = Math.max(0, Math.ceil(requiredTimeSec - elapsedMs / 1000));
  const canCompleteByTime = remainingSeconds <= 0;
  const basePoints = mode === "today" ? BASE_POINTS_TODAY : BASE_POINTS_MAKEUP;
  const pointsBreakdownParts = useMemo(() => {
    const parts = [
      mode === "today"
        ? t("screen.reading.points.today", { points: basePoints, defaultValue: `+${basePoints} bugün` })
        : t("screen.reading.points.makeup", { points: basePoints, defaultValue: `+${basePoints} kaza` }),
    ];
    if (weeklyComplete)
      parts.push(
        t("screen.reading.points.weeklyBonus", { points: WEEKLY_BONUS_POINTS, defaultValue: `+${WEEKLY_BONUS_POINTS} haftalık` })
      );
    if (streakMilestone)
      parts.push(
        t("screen.reading.points.streakBonus", { points: STREAK_MILESTONE_BONUS, defaultValue: `+${STREAK_MILESTONE_BONUS} streak` })
      );
    return parts;
  }, [basePoints, mode, weeklyComplete, streakMilestone, t]);
  const pointsBreakdownLabel = pointsBreakdownParts.join(" · ");

  const toggleChrome = useCallback(
    (hidden: boolean) => {
      if (hidden === chromeHidden) return;
      setChromeHidden(hidden);
      Animated.timing(chromeAnim, { toValue: hidden ? 1 : 0, duration: 180, useNativeDriver: true }).start();
    },
    [chromeAnim, chromeHidden]
  );

  const showToast = useCallback(
    (message: string) => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToastMessage(message);
      Animated.timing(toastAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      toastTimerRef.current = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
        toastTimerRef.current = null;
      }, 1200);
    },
    [toastAnim]
  );

  const haptic = useCallback(
    async (mode: "light" | "success" = "light") => {
      if (readingSettings.hapticsEnabled === false) return;
      try {
        if (mode === "success") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // ignore haptic errors
      }
    },
    [readingSettings.hapticsEnabled]
  );

  const pingFocusRail = useCallback(() => {
    if (focusRailTimerRef.current) clearTimeout(focusRailTimerRef.current);
    Animated.timing(focusRailAnim, { toValue: 0.6, duration: 120, useNativeDriver: true }).start();
    focusRailTimerRef.current = setTimeout(() => {
      Animated.timing(focusRailAnim, { toValue: 0.2, duration: 180, useNativeDriver: true }).start();
    }, 1200);
  }, [focusRailAnim]);

  const pingAutoControl = useCallback(() => {
    if (!readingSettings.autoScroll) return;
    if (autoControlTimerRef.current) clearTimeout(autoControlTimerRef.current);
    setAutoControlVisible(true);
    Animated.timing(autoControlAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    autoControlTimerRef.current = setTimeout(() => {
      Animated.timing(autoControlAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setAutoControlVisible(false));
      autoControlTimerRef.current = null;
    }, 2000);
  }, [autoControlAnim, readingSettings.autoScroll]);

  const adjustAutoSpeed = useCallback(
    (delta: number) => {
      const next = Math.max(10, Math.min(120, (readingSettings.autoScrollSpeed || 40) + delta));
      updateReadingSettings({ autoScrollSpeed: next });
      pingAutoControl();
    },
    [pingAutoControl, readingSettings.autoScrollSpeed, updateReadingSettings]
  );

  useEffect(() => {
    if (showWeeklyBonus) {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(toastTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      Animated.timing(toastTranslate, { toValue: 10, duration: 200, useNativeDriver: true }).start();
    }
  }, [showWeeklyBonus, toastOpacity, toastTranslate]);

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index?: number }[] }) => {
      const first = viewableItems.find((v) => typeof v.index === "number");
      if (first && typeof first.index === "number") setCurrentIndex(first.index);
    }
  );

  useEffect(() => {
    startReading(dayId, mode, date);
  }, [dayId, mode, date, startReading]);

  useEffect(() => {
    setElapsedMs(0);
    const startedAt = Date.now();
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAt), 1000);
    return () => clearInterval(interval);
  }, [dayId, date]);

  useEffect(() => {
    const readingDate = date || todayDateString();
    if (lastReadingPosition && lastReadingPosition.date === readingDate && lastReadingPosition.dayId === dayId) {
      listRef.current?.scrollToOffset({ offset: lastReadingPosition.offset, animated: false });
    }
  }, [dayId, date, lastReadingPosition]);

  useEffect(() => {
    if (!readingSettings.autoScroll) return;
    const speed = readingSettings.autoScrollSpeed || 40; // px per second
    const interval = setInterval(() => {
      listRef.current?.scrollToOffset({
        offset: (lastOffsetRef.current || 0) + speed / 10,
        animated: true,
      });
      lastOffsetRef.current = (lastOffsetRef.current || 0) + speed / 10;
    }, 100);
    return () => clearInterval(interval);
  }, [readingSettings.autoScroll, readingSettings.autoScrollSpeed]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (focusRailTimerRef.current) clearTimeout(focusRailTimerRef.current);
      if (autoControlTimerRef.current) clearTimeout(autoControlTimerRef.current);
      if (saveBookmarkTimer.current) clearTimeout(saveBookmarkTimer.current);
      deactivateKeepAwake(keepAwakeTag).catch(() => {});
    },
    []
  );

  useEffect(() => {
    if (readingSettings.autoScroll) {
      pingAutoControl();
    } else {
      Animated.timing(autoControlAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setAutoControlVisible(false));
    }
  }, [autoControlAnim, pingAutoControl, readingSettings.autoScroll]);

  useEffect(() => {
    const toggleKeepAwake = async () => {
      if (readingSettings.screenLock) {
        await activateKeepAwakeAsync(keepAwakeTag);
      } else {
        await deactivateKeepAwake(keepAwakeTag);
      }
    };
    toggleKeepAwake().catch(() => {});
  }, [readingSettings.screenLock]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fdfaf3]">
        <ActivityIndicator />
      </View>
    );
  }

  const onComplete = async () => {
    if (!canCompleteByTime) {
      showToast(t("screen.reading.waitToComplete", { seconds: remainingSeconds, defaultValue: "Okumayı tamamlamak için {{seconds}} sn daha bekle" }));
      haptic("light");
      return;
    }
    const result = await completeReading({ dayId, mode, date });
    if (result) {
      showToast(`+${prospectiveBonuses.totalPoints} puan: ${pointsBreakdownLabel}`);
      haptic("success");
    }
  };

  const backgroundColor = readingSettings.theme === "dark" ? "#0f172a" : readingSettings.theme === "sepia" ? "#f5ecd3" : colors.background;
  const textPrimary = readingSettings.theme === "dark" ? "#f5f5f0" : readingSettings.theme === "sepia" ? "#3b2f2f" : colors.textPrimary;
  const textMuted = readingSettings.theme === "dark" ? "#d6d6cf" : colors.textSecondary;
  const chromeBorder = readingSettings.theme === "dark" ? "#1f2937" : readingSettings.theme === "sepia" ? "#e2d6ba" : colors.borderMuted;
  const headerTranslate = chromeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const headerOpacity = chromeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const bottomTranslate = chromeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 90] });
  const feedbackTranslate = toastAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  const focusRailColor = readingSettings.theme === "dark" ? "rgba(91, 189, 122, 0.35)" : "rgba(91, 189, 122, 0.18)";
  const barBackground = readingSettings.theme === "dark" ? "#0b1220" : readingSettings.theme === "sepia" ? "#f0e4ca" : colors.card;

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Animated.View style={{ transform: [{ translateY: headerTranslate }], opacity: headerOpacity, zIndex: 10 }} pointerEvents={chromeHidden ? "none" : "auto"}>
        <AppHeader
          title={`${dayLabel} ${t("screen.reading.title")}`}
          showBack
          showRankingWidget={false}
          backgroundColor={backgroundColor}
          borderColor={chromeBorder}
          rightContent={
            <Pressable
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.accentSoft, borderColor: colors.accent, borderWidth: 1 }}
              onPress={() => navigation.navigate("ReadingSettingsModal")}
              accessibilityLabel={t("screen.reading.settingsButton")}
            >
              <Image source={require("../../../assets/icons/custom/Gear_gear.png")} style={{ width: 20, height: 20, tintColor: iconTint }} />
            </Pressable>
          }
        />
      </Animated.View>
      <FlatList
        ref={listRef}
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6 }}>
            <ReadingTextBlock section={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: spacing.screen, paddingTop: 14, paddingBottom: 8, alignItems: "center" }}>
            <Text className="text-lg font-semibold mb-2 text-center" style={{ color: textPrimary }}>
              {dayLabel} {t("screen.reading.title")}
            </Text>
            <View className="px-4 py-1.5 rounded-full" style={{ backgroundColor: mode === "today" ? "#bfe9ca" : "#f0f2f1" }}>
              <Text className="text-xs font-semibold" style={{ color: mode === "today" ? colors.accentDark : textPrimary }}>
                {mode === "today" ? t("screen.reading.mode.today") : t("screen.reading.mode.makeup")}
              </Text>
            </View>
            {date ? (
              <Text className="text-xs mt-2 text-center" style={{ color: textMuted }}>
                {date}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <Text className="text-sm text-[#6b6052] py-4">{t("screen.reading.noContent")}</Text>
        }
        onScroll={(event) => {
          const offset = event.nativeEvent.contentOffset.y;
          const readingDate = date || todayDateString();
          lastOffsetRef.current = offset;
          const delta = offset - lastScrollY.current;
          if (offset < 20 || delta < -12) toggleChrome(false);
          if (delta > 16 && offset > 40) toggleChrome(true);
          lastScrollY.current = offset;
          pingFocusRail();
          pingAutoControl();
          if (saveBookmarkTimer.current) clearTimeout(saveBookmarkTimer.current);
          saveBookmarkTimer.current = setTimeout(() => {
            setBookmark({ date: readingDate, offset: lastOffsetRef.current, dayId }).catch(() => {});
          }, 600);
        }}
        onMomentumScrollEnd={(event) => {
          const offset = event.nativeEvent.contentOffset.y;
          const readingDate = date || todayDateString();
          lastOffsetRef.current = offset;
          lastScrollY.current = offset;
          toggleChrome(false);
          pingFocusRail();
          pingAutoControl();
          if (saveBookmarkTimer.current) clearTimeout(saveBookmarkTimer.current);
          setBookmark({ date: readingDate, offset, dayId }).catch(() => {});
        }}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: bottomInset + 160, paddingTop: 4 }}
        scrollEventThrottle={16}
        ListFooterComponent={
          <View style={{ paddingHorizontal: spacing.screen, paddingTop: 20, paddingBottom: bottomInset + 40, gap: 12 }}>
          <View
            style={{
              backgroundColor: barBackground,
              borderRadius: radii.xl,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: chromeBorder,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              gap: 8,
            }}
          >
            {hasSections ? (
              <>
                <Text className="text-sm font-semibold" style={{ color: textMuted }}>
                  {t("screen.reading.sectionProgress", { current: progressCurrent, total: sectionTotal })}
                </Text>
                <PrimaryButton title={t("screen.reading.completeButton")} onPress={onComplete} disabled={!canCompleteByTime} />
                <Text className="text-xs font-semibold" style={{ color: textMuted, textAlign: "center" }}>
                  {pointsBreakdownLabel}
                </Text>
                {!canCompleteByTime ? (
                  <Text className="text-xs font-semibold" style={{ color: textMuted, textAlign: "center" }}>
                    {t("screen.reading.waitToComplete", {
                      seconds: remainingSeconds,
                      defaultValue: "Okumayı tamamlamak için {{seconds}} sn daha bekle",
                    })}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text className="text-sm font-semibold" style={{ color: textMuted }}>
                {t("screen.reading.noContent")}
              </Text>
          )}
        </View>
      </View>
    }
  />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: spacing.screen - 4,
          top: height * 0.42,
          width: 3,
          height: 76,
          borderRadius: 999,
          backgroundColor: focusRailColor,
          opacity: focusRailAnim,
        }}
      />
      {toastMessage ? (
        <Animated.View
          style={{
            position: "absolute",
            left: spacing.screen,
            right: spacing.screen,
            bottom: bottomInset + 120,
            opacity: toastAnim,
            transform: [{ translateY: feedbackTranslate }],
          }}
        >
          <View
            style={{
              backgroundColor: readingSettings.theme === "dark" ? "#111827" : "rgba(17,24,39,0.92)",
              borderRadius: radii.xl,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            <Text className="text-sm font-semibold" style={{ color: "#f5f5f0", textAlign: "center" }}>
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      ) : null}
      {readingSettings.autoScroll ? (
        <Animated.View
          style={{
            position: "absolute",
            right: spacing.screen - 2,
            bottom: bottomInset + 120,
            opacity: autoControlAnim,
            transform: [{ translateY: chromeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) }],
          }}
          pointerEvents={autoControlVisible ? "auto" : "none"}
        >
          <View
            style={{
              backgroundColor: readingSettings.theme === "dark" ? "#0b1220" : "rgba(17,24,39,0.92)",
              borderRadius: radii.xl,
              paddingVertical: 8,
              paddingHorizontal: 10,
              gap: 6,
              minWidth: 150,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text className="text-xs font-semibold" style={{ color: "#f5f5f0" }}>
              {t("screen.readingSettings.autoScrollSpeedValue", { value: readingSettings.autoScrollSpeed || 40 })}
            </Text>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => adjustAutoSpeed(-5)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Text className="text-lg font-semibold" style={{ color: "#f5f5f0" }}>
                  -
                </Text>
              </Pressable>
              <Pressable
                onPress={() => pingAutoControl()}
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <Text className="text-xs font-semibold" style={{ color: "#f5f5f0" }}>
                  {t("screen.readingSettings.autoScroll")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => adjustAutoSpeed(5)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Text className="text-lg font-semibold" style={{ color: "#f5f5f0" }}>
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      ) : null}
      <Animated.View
        className="absolute left-0 right-0"
        style={{
          bottom: bottomInset,
          paddingHorizontal: spacing.screen,
          transform: [{ translateY: bottomTranslate }],
          opacity: headerOpacity,
        }}
        pointerEvents={chromeHidden ? "none" : "auto"}
      >
        <View
          className="flex-row items-center"
          style={{
            borderRadius: radii.xl,
            paddingVertical: 10,
            paddingHorizontal: 14,
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            gap: 12,
            alignItems: "center",
            backgroundColor: barBackground,
            borderColor: chromeBorder,
            borderWidth: 1,
          }}
        >
          <Pressable
            onPress={() => {
              const readingDate = date || todayDateString();
              setBookmark({ date: readingDate, offset: lastOffsetRef.current, dayId });
              showToast(t("screen.reading.bookmarkNote", { date: readingDate }));
              haptic("light");
            }}
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: "#eef3f1" }}
          >
            <Image source={require("../../../assets/icons/custom/Bookmark_bookmark.png")} style={{ width: 18, height: 18, tintColor: colors.textPrimary }} />
          </Pressable>
          <View style={{ flex: 1, gap: 4 }}>
            <Text className="text-xs font-semibold" style={{ color: textMuted }}>
              {hasSections
                ? t("screen.reading.sectionProgress", { current: progressCurrent, total: sectionTotal })
                : t("screen.reading.noContent")}
            </Text>
            <View style={{ height: 6, borderRadius: 999, backgroundColor: "#e6ece8", overflow: "hidden" }}>
              <View
                style={{
                  height: 6,
                  borderRadius: 999,
                  width: `${progressPercent}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </View>
          </View>
        </View>
        {showWeeklyBonus ? (
          <Animated.View
            className="mt-3 px-4 py-3 rounded-2xl"
            style={{
              backgroundColor: "#f0f9f2",
              borderColor: colors.borderMuted,
              borderWidth: 1,
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslate }],
            }}
          >
            <Text className="text-sm font-semibold" style={{ color: colors.accentDark }}>
              {weeklyComplete
                ? t("screen.home.weeklyBonusTitle", { defaultValue: "Weekly bonus unlocked!" })
                : t("screen.home.weeklyBonusHelper", { defaultValue: "Streak milestone reached!" })}
            </Text>
            <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              {streakMilestone
                ? t("screen.home.streakBonusHelper", { defaultValue: "Extra points for every 10-day streak." })
                : t("component.dayCard.helper.completed") || "Complete all 7 days this week to earn a bonus."}
            </Text>
          </Animated.View>
        ) : null}
        {lastReadingPosition && lastReadingPosition.dayId === dayId ? (
          <Text className="text-xs mt-2 text-center" style={{ color: textMuted }}>
            {t("screen.reading.bookmarkNote", { date: lastReadingPosition.date })}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default ReadingScreen;
