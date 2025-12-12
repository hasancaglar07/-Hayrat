'use client';

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";

type Props = {
  locale: Locale;
  enabled: boolean;
  remindMissedDays: boolean;
  notificationTime: string;
  missedCount: number;
};

const msUntilNextTime = (time: string): number => {
  const [hStr, mStr] = time.split(":");
  const hours = Number(hStr);
  const minutes = Number(mStr);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;

  const now = new Date();
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
};

export function NotificationScheduler({
  locale,
  enabled,
  remindMissedDays,
  notificationTime,
  missedCount,
}: Props) {
  const timers = useRef<{ timeoutId?: number; intervalId?: number }>({});

  useEffect(() => {
    if (timers.current.timeoutId) window.clearTimeout(timers.current.timeoutId);
    if (timers.current.intervalId) window.clearInterval(timers.current.intervalId);
    timers.current = {};

    if (!enabled) return;
    if (!("Notification" in window)) return;

    const t = getMobileT(locale);

    const showNotification = () => {
      if (Notification.permission !== "granted") return;
      const showMissed = remindMissedDays && missedCount > 0;
      const title = showMissed ? t("notifications.missed.title") : t("notifications.daily.title");
      const body = showMissed ? t("notifications.missed.body") : t("notifications.daily.body");
      try {
        new Notification(title, {
          body,
          tag: "delaili-hayrat-reminder",
        });
      } catch {
        // ignore
      }
    };

    const requestPermission = async () => {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }
    };

    requestPermission().finally(() => {
      const delay = msUntilNextTime(notificationTime);
      if (Notification.permission !== "granted") return;
      timers.current.timeoutId = window.setTimeout(() => {
        showNotification();
        timers.current.intervalId = window.setInterval(showNotification, 24 * 60 * 60 * 1000);
      }, delay);
    });

    return () => {
      if (timers.current.timeoutId) window.clearTimeout(timers.current.timeoutId);
      if (timers.current.intervalId) window.clearInterval(timers.current.intervalId);
    };
  }, [enabled, remindMissedDays, notificationTime, missedCount, locale]);

  return null;
}
