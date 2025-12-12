// Derived from docs/03-data-models.md
export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type AppLanguage = "tr" | "ar" | "en" | "fr" | "id" | "es" | "de" | "pt" | "ru" | "hi" | "ur" | "zh";
export type ReadingMode = "today" | "makeup";
export type ThemeMode = "light" | "dark" | "sepia";
export type ContentLanguage = AppLanguage | "arabic" | "transliteration";

export interface ReadingSection {
  id: string;
  weekday: Weekday;
  order: number;
  title?: string;
  arabicText: string;
  transliteration?: string;
  translations: Partial<Record<AppLanguage, string>>;
  estimatedDurationSec?: number;
}

export interface UserProfile {
  id: string;
  nickname: string;
  appLanguage: AppLanguage;
  targetReadingDaysPerWeek: number;
  khatmDurationDays: number;
  showInGlobalRanking: boolean;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted?: boolean;
}

export interface DayReadingLog {
  date: string; // YYYY-MM-DD
  weekday: Weekday;
  mode: ReadingMode;
  completed: boolean;
  pointsEarned: number;
  completedAt?: string;
  sectionIds?: string[];
}

export interface UserStats {
  totalPoints: number;
  currentStreakDays: number;
  longestStreakDays: number;
  totalReadings: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  lastCompletedDate?: string;
}

export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  totalPoints: number;
  currentStreakDays: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  countryCode?: string;
  avatarSource?: any;
}

export interface ReadingSettings {
  fontSize: number;
  lineHeightMultiplier: number;
  theme: ThemeMode;
  contentLanguages: ContentLanguage[];
  autoScroll?: boolean;
  autoScrollSpeed?: number; // pixels per second
  screenLock?: boolean;
  hapticsEnabled?: boolean;
}

export interface AppSettings {
  language: AppLanguage;
  notificationsEnabled: boolean;
  notificationTime?: string;
  remindMissedDays: boolean;
  missedReminderDay?: number; // 1=Monday ... 7=Sunday
  missedReminderHour?: number;
  missedReminderMinute?: number;
  themePreference?: "system" | ThemeMode;
}

export const STORAGE_KEYS = {
  userProfile: "@delail:userProfile",
  userStats: "@delail:userStats",
  readingLogs: "@delail:readingLogs",
  readingSettings: "@delail:readingSettings",
  appSettings: "@delail:appSettings",
  lastReadingPosition: "@delail:lastReadingPosition",
  contentVersion: "@delail:contentVersion",
};
