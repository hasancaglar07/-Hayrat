export * from "@delail/core";
import { parseUtcDateString } from "@delail/core";

export const formatDisplayDate = (date: string, locale: string, options?: Intl.DateTimeFormatOptions): string => {
  const jsDate = parseUtcDateString(date);
  return new Intl.DateTimeFormat(locale, options ?? { day: "2-digit", month: "long", year: "numeric" }).format(jsDate);
};
