import { cookies } from "next/headers";
import type { Weekday } from "@/lib/core/types";
import { getDateForWeekdayInCurrentWeek, parseUtcDateString } from "@/lib/core/date";
import { userTodayDateString } from "@/lib/core/userTime";

export const guestReadingProgressCookieName = "guest-reading-progress";

const weekdays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

type StoredGuestReadingProgressV1 = {
  v?: 1;
  weekStart?: string;
  completed?: Partial<Record<Weekday, boolean>>;
};

export type GuestReadingProgress = {
  weekStart: string;
  completed: Record<Weekday, boolean>;
};

const computeWeekStart = (): string => {
  const today = userTodayDateString();
  return getDateForWeekdayInCurrentWeek("monday", parseUtcDateString(today));
};

const emptyProgress = (weekStart: string): GuestReadingProgress => ({
  weekStart,
  completed: Object.fromEntries(weekdays.map((d) => [d, false])) as Record<Weekday, boolean>,
});

export const getGuestReadingProgress = (): GuestReadingProgress => {
  const weekStart = computeWeekStart();
  const raw = cookies().get(guestReadingProgressCookieName)?.value;
  if (!raw) return emptyProgress(weekStart);

  try {
    const parsed = JSON.parse(raw) as StoredGuestReadingProgressV1;
    if (parsed.weekStart !== weekStart) return emptyProgress(weekStart);
    const completed = { ...emptyProgress(weekStart).completed };
    for (const day of weekdays) {
      if (parsed.completed && typeof parsed.completed[day] === "boolean") completed[day] = Boolean(parsed.completed[day]);
    }
    return { weekStart, completed };
  } catch {
    return emptyProgress(weekStart);
  }
};

export const setGuestReadingProgress = (progress: GuestReadingProgress) => {
  const payload: StoredGuestReadingProgressV1 = {
    v: 1,
    weekStart: progress.weekStart,
    completed: progress.completed,
  };
  cookies().set(guestReadingProgressCookieName, JSON.stringify(payload), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
};

export const markGuestReadingCompleted = (day: Weekday) => {
  const current = getGuestReadingProgress();
  const next: GuestReadingProgress = {
    ...current,
    completed: { ...current.completed, [day]: true },
  };
  setGuestReadingProgress(next);
  return next;
};

export const clearGuestReadingProgress = () => {
  cookies().set(guestReadingProgressCookieName, "", { path: "/", sameSite: "lax", maxAge: 0 });
};

