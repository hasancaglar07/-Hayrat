// Notification helpers (see docs/08-notifications-and-reminders.md)
import * as Notifications from "expo-notifications";
import { AppSettings } from "../data/types";
import i18n from "../i18n/i18n";

const parseTime = (time?: string) => {
  if (!time) return { hour: 21, minute: 0 };
  const [h, m] = time.split(":").map(Number);
  return { hour: h || 21, minute: m || 0 };
};

export const requestPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted" || status === "undetermined";
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
    trigger: { hour, minute, repeats: true },
  });
  if (settings.remindMissedDays) {
    const weekday = settings.missedReminderDay || 1;
    const missHour = settings.missedReminderHour ?? 20;
    const missMinute = settings.missedReminderMinute ?? 0;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications.missed.title"),
        body: i18n.t("notifications.missed.body"),
        data: { type: "missed" },
      },
      trigger: { weekday, hour: missHour, minute: missMinute, repeats: true },
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
