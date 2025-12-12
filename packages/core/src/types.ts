export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ReadingMode = "today" | "makeup";

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

