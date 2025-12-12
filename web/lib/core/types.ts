// Mirrors mobile src/data/types.ts for reuse in web
export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type AppLanguage =
  | "tr"
  | "en"
  | "ar"
  | "zh"
  | "hi"
  | "es"
  | "fr"
  | "bn"
  | "pt"
  | "ru"
  | "ur"
  | "id"
  | "de"
  | "ja"
  | "sw"
  | "mr"
  | "te"
  | "ta"
  | "vi"
  | "ko";
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

export interface ReadingSettings {
  fontSize: number;
  lineHeightMultiplier: number;
  theme: ThemeMode;
  autoScroll?: boolean;
  autoScrollSpeed?: number; // pixels per second
  screenLock?: boolean;
  hapticsEnabled?: boolean;
  contentLanguages: ContentLanguage[];
}

export interface AppSettings {
  language: AppLanguage;
  notificationsEnabled: boolean;
  notificationTime?: string;
  remindMissedDays: boolean;
  missedReminderDay?: number;
  missedReminderHour?: number;
  missedReminderMinute?: number;
  themePreference?: "system" | ThemeMode;
}
