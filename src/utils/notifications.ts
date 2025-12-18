// Notification helpers (see docs/08-notifications-and-reminders.md)
import * as Notifications from "expo-notifications";
import { AppSettings } from "../data/types";
import i18n from "../i18n/i18n";

const parseTime = (time?: string) => {
  if (!time) return { hour: 21, minute: 0 };
  const [rawHour, rawMinute] = time.split(":").map((value) => Number(value));
  const hour = Number.isFinite(rawHour) ? Math.max(0, Math.min(23, rawHour)) : 21;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  return { hour, minute };
};

export const requestPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const scheduleAllNotifications = async (settings: AppSettings) => {
  if (!settings.notificationsEnabled) return;
  const granted = await requestPermission();
  if (!granted) return;
  await cancelAllNotifications();
  const { hour, minute } = parseTime(settings.notificationTime);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.daily.title"),
      body: i18n.t("notifications.daily.body"),
      data: { type: "daily" },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
  if (settings.remindMissedDays) {
    // App settings store weekdays as 1=Monday ... 7=Sunday; expo-notifications expects 1=Sunday ... 7=Saturday.
    const appWeekday = settings.missedReminderDay || 1;
    const weekday = (appWeekday % 7) + 1;
    const missHour = settings.missedReminderHour ?? 20;
    const missMinute = settings.missedReminderMinute ?? 0;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications.missed.title"),
        body: i18n.t("notifications.missed.body"),
        data: { type: "missed" },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour: missHour, minute: missMinute },
    });
  }
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn("Cancel notifications failed", error);
  }
};
