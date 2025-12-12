import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DayReadingLog, ReadingMode, Weekday } from "../data/types";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useStatsContext } from "./StatsContext";
import { calculatePoints } from "../utils/points";
import { calculateStreak, isStreakMilestone } from "../utils/streak";
import { getWeekdayFromDate, todayDateString, isSameWeek } from "../utils/date";
import { useUserContext } from "./UserContext";
import { useAuth } from "../hooks/useAuth";
import { fetchBookmark, upsertBookmark } from "../lib/supabase/bookmarks";

// Reading session context (see docs/05-reading-experience.md and docs/06-gamification-and-ranking.md)
export interface ReadingContextValue {
  currentDayId: Weekday | null;
  mode: ReadingMode;
  lastReadingPosition: { date: string; offset: number; dayId: Weekday } | null;
  isLoading: boolean;
  startReading: (dayId: Weekday, mode: ReadingMode, date?: string) => void;
  completeReading: (input: { dayId: Weekday; mode?: ReadingMode; date?: string }) => Promise<DayReadingLog | null>;
  setBookmark: (payload: { date: string; offset: number; dayId: Weekday }) => Promise<void>;
  logs: DayReadingLog[];
}

const ReadingContext = createContext<ReadingContextValue>({
  currentDayId: null,
  mode: "today",
  lastReadingPosition: null,
  isLoading: true,
  startReading: () => {},
  completeReading: async () => null,
  setBookmark: async () => {},
  logs: [],
});

export const ReadingProvider = ({ children }: { children: ReactNode }) => {
  const { logs, recordCompletion } = useStatsContext();
  const { profile } = useUserContext();
  const { isSignedIn, userId, isLoading: authLoading } = useAuth();
  const [currentDayId, setCurrentDayId] = useState<Weekday | null>(null);
  const [mode, setMode] = useState<ReadingMode>("today");
  const [lastReadingPosition, setLastReadingPosition] = useState<{ date: string; offset: number; dayId: Weekday } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const weeklyTarget = Math.max(1, Math.min(7, profile?.targetReadingDaysPerWeek || 7));

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.lastReadingPosition);
        const local = stored ? (JSON.parse(stored) as { date: string; offset: number; dayId: Weekday }) : null;

        if (!isSignedIn || !userId) {
          if (local) setLastReadingPosition(local);
          return;
        }

        const remote = await fetchBookmark(userId);
        const next = remote || local;
        if (next) {
          setLastReadingPosition(next);
          await AsyncStorage.setItem(STORAGE_KEYS.lastReadingPosition, JSON.stringify(next));
          if (!remote && local) {
            upsertBookmark(userId, local).catch((error) => console.warn("Seed remote bookmark failed", error));
          }
        }
      } catch (error) {
        console.warn("ReadingContext hydrate failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (authLoading) return;
    hydrate();
  }, [authLoading, isSignedIn, userId]);

  const startReading = useCallback((dayId: Weekday, readingMode: ReadingMode, date?: string) => {
    setCurrentDayId(dayId);
    setMode(readingMode);
    if (date) {
      setLastReadingPosition((prev) => (prev && prev.date === date ? prev : null));
    }
  }, []);

  const checkWeeklyCompletion = useCallback((allLogs: DayReadingLog[], completionDate: string) => {
    // Haftalık bonus: yalnızca içinde bulunduğumuz haftada, hedeflenen kadar gün tamamlanınca tetikler.
    const completionDateObj = new Date(`${completionDate}T00:00:00Z`);
    if (!isSameWeek(completionDateObj, new Date())) return false;
    const weekLogs = allLogs.filter((log) => isSameWeek(new Date(`${log.date}T00:00:00Z`), completionDateObj));
    const completedDates = new Set(weekLogs.filter((l) => l.completed).map((l) => l.date));
    const required = Math.max(1, Math.min(7, weeklyTarget));
    return completedDates.size >= required;
  }, [weeklyTarget]);

  const completeReading = useCallback(
    async ({ dayId, mode: paramMode, date }: { dayId: Weekday; mode?: ReadingMode; date?: string }) => {
      const completionDate = date || todayDateString();
      const resolvedMode: ReadingMode = paramMode || (completionDate === todayDateString() ? "today" : "makeup");
      const weekday = getWeekdayFromDate(completionDate);

      const existingCompletedLogs = logs.filter((log) => log.completed && log.date !== completionDate);
      const prospectiveLog: DayReadingLog = { date: completionDate, weekday, completed: true, mode: resolvedMode, pointsEarned: 0 };
      const streakPreview = calculateStreak([...existingCompletedLogs, prospectiveLog]);
      const allWeekComplete =
        resolvedMode === "today" &&
        checkWeeklyCompletion([...logs.filter((l) => l.date !== completionDate), prospectiveLog], completionDate);
      const milestone = isStreakMilestone(streakPreview.currentStreakDays);
      const pointsEarned = calculatePoints({ mode: resolvedMode, allWeekComplete, isStreakMilestone: milestone });

      const completedAt = new Date().toISOString();
      const newLog: DayReadingLog = {
        date: completionDate,
        weekday,
        mode: resolvedMode,
        completed: true,
        pointsEarned,
        completedAt,
      };

      try {
        await recordCompletion(newLog);
        setLastReadingPosition(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.lastReadingPosition);
        return newLog;
      } catch (error) {
        console.warn("completeReading failed", error);
        return null;
      }
    },
    [logs, recordCompletion, checkWeeklyCompletion]
  );

  const setBookmark = useCallback(async (payload: { date: string; offset: number; dayId: Weekday }) => {
    setLastReadingPosition(payload);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.lastReadingPosition, JSON.stringify(payload));
      if (isSignedIn && userId) {
        upsertBookmark(userId, payload).catch((error) => console.warn("Remote bookmark save failed", error));
      }
    } catch (error) {
      console.warn("Bookmark save failed", error);
    }
  }, [isSignedIn, userId]);

  return (
    <ReadingContext.Provider
      value={{ currentDayId, mode, lastReadingPosition, isLoading, startReading, completeReading, setBookmark, logs }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReadingContext = () => useContext(ReadingContext);
