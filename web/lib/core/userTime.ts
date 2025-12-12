import { cookies } from "next/headers";

export const getUserTimeZone = (): string | undefined => {
  const value = cookies().get("tz")?.value;
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const todayDateStringInTimeZone = (timeZone: string): string => {
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!year || !month || !day) throw new Error("Failed to format date in time zone");
  return `${year}-${month}-${day}`;
};

export const userTodayDateString = (): string => {
  const tz = getUserTimeZone();
  if (!tz) return new Date().toISOString().slice(0, 10);
  try {
    return todayDateStringInTimeZone(tz);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

