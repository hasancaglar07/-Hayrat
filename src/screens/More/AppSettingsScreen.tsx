import React, { useState, useEffect, useRef } from "react";
import { Pressable, Text, TextInput, View, Image, Alert, ScrollView } from "react-native";
import AppHeader from "../../components/AppHeader";
import SettingsItem from "../../components/SettingsItem";
import { useSettings } from "../../hooks/useSettings";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DonateStackParamList } from "../../navigation/types";
import { AppLanguage } from "../../data/types";
import { useTranslation } from "react-i18next";
import { useUser } from "../../hooks/useUser";
import { colors, spacing } from "../../theme/designTokens";
import { requestPermission } from "../../utils/notifications";

// App settings grouped per docs/08-notifications-and-reminders.md
const AppSettingsScreen: React.FC<NativeStackScreenProps<DonateStackParamList, "AppSettings">> = () => {
  const { appSettings, updateAppSettings, updateReadingSettings, setTheme } = useSettings();
  const { updateProfile } = useUser();
  const [notificationTime, setNotificationTime] = useState(appSettings.notificationTime || "21:00");
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [missedWeekday, setMissedWeekday] = useState(appSettings.missedReminderDay || 1);
  const [missedHour, setMissedHour] = useState(appSettings.missedReminderHour ?? 20);
  const [missedMinute, setMissedMinute] = useState(appSettings.missedReminderMinute ?? 0);
  const notificationInputRef = useRef<TextInput>(null);
  const languages: AppLanguage[] = ["tr", "en", "ar", "es", "fr", "de", "pt", "ru", "hi", "ur", "id", "zh"];
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setNotificationTime(appSettings.notificationTime || "21:00");
    setMissedWeekday(appSettings.missedReminderDay || 1);
    setMissedHour(appSettings.missedReminderHour ?? 20);
    setMissedMinute(appSettings.missedReminderMinute ?? 0);
  }, [appSettings.notificationTime, appSettings.missedReminderDay, appSettings.missedReminderHour, appSettings.missedReminderMinute]);

  const parseAndFormatTime = (value: string) => {
    const match = value.trim().match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const handleNotificationBlur = () => {
    const parsed = parseAndFormatTime(notificationTime);
    if (!parsed) {
      Alert.alert(t("screen.settings.notifications"), t("screen.settings.invalidTime") || "Lütfen geçerli bir saat girin (00:00 - 23:59).");
      setNotificationTime(appSettings.notificationTime || "21:00");
      return;
    }
    setNotificationTime(parsed);
    updateAppSettings({ notificationTime: parsed });
  };

  const updateLanguage = (lang: AppLanguage) => {
    i18n.changeLanguage(lang);
    updateProfile({ appLanguage: lang });
    updateAppSettings({ language: lang });
    setLanguagePickerOpen(false);
  };

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(t("screen.settings.notifications"), t("notifications.permissionDenied") || "Notification permission denied.");
        return;
      }
    }
    updateAppSettings({ notificationsEnabled: value });
  };

  const themeOptions: ("light" | "dark" | "system" | "sepia")[] = ["light", "dark", "system", "sepia"];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <AppHeader title={t("screen.settings.title")} showBack showRankingWidget={false} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.screen, paddingTop: 16, paddingBottom: 32, gap: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "#f7f9f8", borderRadius: 28, padding: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
          <Text className="text-sm font-semibold mb-4" style={{ color: colors.textSecondary }}>
            {t("screen.settings.general") || "General"}
          </Text>
          <Pressable
            className="flex-row items-center justify-between"
            style={{ paddingVertical: 12 }}
            onPress={() => setLanguagePickerOpen((prev) => !prev)}
          >
            <View className="flex-row items-center gap-10">
              <View className="h-10 w-10 rounded-full items-center justify-center" style={{ backgroundColor: "#eaf5ef" }}>
                <Image source={require("../../../assets/icons/custom/Globe_Earth_globe-earth.png")} style={{ width: 22, height: 22, tintColor: colors.accent }} />
              </View>
              <View>
                <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  {t("screen.settings.language")}
                </Text>
                <Text className="text-base" style={{ color: colors.textSecondary }}>
                  {appSettings.language.toUpperCase()}
                </Text>
              </View>
            </View>
            <Image source={require("../../../assets/icons/custom/Arrow_Down_arrow-down.png")} style={{ width: 16, height: 16, tintColor: colors.textSecondary, transform: [{ rotate: languagePickerOpen ? "90deg" : "-90deg" }] }} />
          </Pressable>
          {languagePickerOpen ? (
            <View className="mt-2 flex-row flex-wrap gap-2">
              {languages.map((lang) => {
                const active = appSettings.language === lang;
                return (
                  <Pressable
                    key={lang}
                    onPress={() => updateLanguage(lang)}
                    className="px-4 py-2 rounded-full"
                    style={{ backgroundColor: active ? colors.accent : "#eef1f0" }}
                  >
                    <Text className="text-base font-semibold" style={{ color: active ? "#fff" : colors.textPrimary }}>
                      {lang.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        <View style={{ backgroundColor: "#f7f9f8", borderRadius: 28, padding: 18, gap: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
          <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            {t("screen.settings.notifications")}
          </Text>
          <SettingsItem
            label={t("screen.settings.notificationsDaily")}
            hasSwitch
            value={appSettings.notificationsEnabled}
            onToggle={(value) => toggleNotifications(value)}
            iconSource={require("../../../assets/icons/custom/Bell_bell.png")}
          />
          <View style={{ height: 1, backgroundColor: colors.borderMuted }} />
          <Pressable className="flex-row items-center justify-between py-3" onPress={() => notificationInputRef.current?.focus()}>
            <View className="flex-row items-center gap-3">
              <Image source={require("../../../assets/icons/custom/Alarm_Clock_alarm-clock.png")} style={{ width: 18, height: 18, tintColor: colors.textSecondary }} />
              <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                {t("screen.settings.reminderTime")}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TextInput
                value={notificationTime}
                onChangeText={setNotificationTime}
                onBlur={handleNotificationBlur}
                ref={notificationInputRef}
                keyboardType="numbers-and-punctuation"
                className="h-10 px-3 rounded-full"
                style={{ backgroundColor: "#eef1f0", color: colors.textPrimary, minWidth: 90, textAlign: "right" }}
              />
              <Image source={require("../../../assets/icons/custom/Arrow_Down_arrow-down.png")} style={{ width: 16, height: 16, tintColor: colors.textSecondary, transform: [{ rotate: "-90deg" }] }} />
            </View>
          </Pressable>
          <View style={{ height: 1, backgroundColor: colors.borderMuted }} />
          <SettingsItem
            label={t("screen.settings.missedReminder")}
            hasSwitch
            value={appSettings.remindMissedDays}
            onToggle={(value) => updateAppSettings({ remindMissedDays: value })}
            description={t("screen.settings.missedHint")}
            iconSource={require("../../../assets/icons/custom/Bell_bell.png")}
          />
          {appSettings.remindMissedDays ? (
            <View style={{ marginTop: 8, gap: 10 }}>
              <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                {t("screen.settings.missedSection") || "Missed day reminders"}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                  const active = missedWeekday === d;
                  const key = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][d - 1] as any;
                  const label = t(`weekday.${key}`);
                  return (
                    <Pressable
                      key={d}
                      onPress={() => {
                        setMissedWeekday(d);
                        updateAppSettings({ missedReminderDay: d });
                      }}
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: active ? colors.accent : "#eef1f0" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: active ? "#fff" : colors.textPrimary }}>
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                  {t("screen.settings.missedTimeLabel") || "Reminder time"}
                </Text>
                <View className="flex-row items-center gap-2">
                  <TextInput
                    value={String(missedHour).padStart(2, "0")}
                    onChangeText={(v) => {
                      const num = Math.min(23, Math.max(0, Number(v) || 0));
                      setMissedHour(num);
                      updateAppSettings({ missedReminderHour: num });
                    }}
                    keyboardType="number-pad"
                    className="h-10 px-3 rounded-full"
                    style={{ backgroundColor: "#eef1f0", color: colors.textPrimary, width: 70, textAlign: "center" }}
                  />
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                    :
                  </Text>
                  <TextInput
                    value={String(missedMinute).padStart(2, "0")}
                    onChangeText={(v) => {
                      const num = Math.min(59, Math.max(0, Number(v) || 0));
                      setMissedMinute(num);
                      updateAppSettings({ missedReminderMinute: num });
                    }}
                    keyboardType="number-pad"
                    className="h-10 px-3 rounded-full"
                    style={{ backgroundColor: "#eef1f0", color: colors.textPrimary, width: 70, textAlign: "center" }}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ backgroundColor: "#f7f9f8", borderRadius: 28, padding: 16, gap: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
          <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
            {t("screen.settings.themeAppearance")}
          </Text>
          <View className="bg-white rounded-2xl p-2" style={{ borderColor: colors.borderMuted, borderWidth: 1 }}>
            <View className="flex-row flex-wrap items-center justify-between">
              {themeOptions.map((opt) => {
                const active = appSettings.themePreference === opt || (!appSettings.themePreference && opt === "light");
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      updateAppSettings({ themePreference: opt });
                      if (opt === "system") {
                        setTheme("light");
                        updateReadingSettings({ theme: "light" });
                      } else {
                        setTheme(opt as any);
                        updateReadingSettings({ theme: opt as any });
                      }
                    }}
                    className="flex-1 h-11 rounded-full items-center justify-center m-1"
                    style={{ backgroundColor: active ? colors.accent : "#eef1f0" }}
                  >
                    <Text className="text-sm font-semibold" style={{ color: active ? "#ffffff" : colors.textPrimary }}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppSettingsScreen;
