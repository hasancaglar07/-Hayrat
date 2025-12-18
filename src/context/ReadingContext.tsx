import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DayReadingLog, ReadingMode, Weekday } from "../data/types";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useStatsContext } from "./StatsContext";
import { getWeekdayFromDate, todayDateString } from "../utils/date";
import { useUserContext } from "./UserContext";
import { useAuth } from "../hooks/useAuth";
import { fetchBookmark, upsertBookmark } from "../lib/supabase/bookmarks";
import { getReadingRewardPreview, resolveReadingMode } from "../utils/readingRewards";

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

  const completeReading = useCallback(
    async ({ dayId, mode: paramMode, date }: { dayId: Weekday; mode?: ReadingMode; date?: string }) => {
      const today = todayDateString();
      const completionDate = date || today;

      // Prevent writing logs into the future (also avoids streak/points abuse).
      if (completionDate > today) return null;

      // Idempotent completion: if already completed, don't recalculate points/bonuses.
      if (logs.some((l) => l.date === completionDate && l.completed)) return null;

      const resolvedMode: ReadingMode = resolveReadingMode({ completionDate, mode: paramMode });
      const weekday = getWeekdayFromDate(completionDate);
      const completedAt = new Date().toISOString();
      const { pointsEarned } = getReadingRewardPreview({
        logs,
        completionDate,
        mode: resolvedMode,
        weeklyTarget,
        completedAt,
      });

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
    [logs, recordCompletion, weeklyTarget]
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
