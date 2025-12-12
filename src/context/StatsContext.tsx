import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DayReadingLog, UserStats } from "../data/types";
import { STORAGE_KEYS } from "../data/storageKeys";
import { calculateStreak } from "../utils/streak";
import { isSameWeek, isSameMonth } from "../utils/date";
import { useAuth } from "../hooks/useAuth";
import { fetchLogs as fetchRemoteLogs, upsertLog as upsertRemoteLog, upsertLogs as upsertRemoteLogs } from "../lib/supabase/logs";
import { ensureProfileExists } from "../lib/supabase/profile";

// Stats context (see docs/06-gamification-and-ranking.md)
export interface StatsContextValue {
  stats: UserStats;
  logs: DayReadingLog[];
  isLoading: boolean;
  refreshStats: () => void;
  recordCompletion: (log: DayReadingLog) => Promise<void>;
  setLogsDirectly: (logs: DayReadingLog[]) => void;
}

const defaultStats: UserStats = {
  totalPoints: 0,
  currentStreakDays: 0,
  longestStreakDays: 0,
  totalReadings: 0,
};

const StatsContext = createContext<StatsContextValue>({
  stats: defaultStats,
  logs: [],
  isLoading: true,
  refreshStats: () => {},
  recordCompletion: async () => {},
  setLogsDirectly: () => {},
});

const effectiveTimestamp = (log: DayReadingLog) => {
  if (log.completedAt) return new Date(log.completedAt).getTime();
  return new Date(`${log.date}T00:00:00Z`).getTime();
};

const computeAggregates = (logs: DayReadingLog[]): UserStats => {
  const completedLogs = logs.filter((l) => l.completed).sort((a, b) => effectiveTimestamp(a) - effectiveTimestamp(b));
  const now = new Date();
  const totals = completedLogs.reduce(
    (acc, log) => {
      const dateObj = log.completedAt ? new Date(log.completedAt) : new Date(`${log.date}T00:00:00Z`);
      acc.totalPoints += log.pointsEarned;
      acc.totalReadings += 1;
      if (isSameWeek(dateObj, now)) acc.weeklyPoints += log.pointsEarned;
      if (isSameMonth(dateObj, now)) acc.monthlyPoints += log.pointsEarned;
      return acc;
    },
    { totalPoints: 0, totalReadings: 0, weeklyPoints: 0, monthlyPoints: 0 }
  );

  const streak = calculateStreak(completedLogs);
  const lastCompletedDate = completedLogs.length
    ? completedLogs[completedLogs.length - 1].completedAt?.slice(0, 10) || completedLogs[completedLogs.length - 1].date
    : undefined;

  return {
    totalPoints: totals.totalPoints,
    totalReadings: totals.totalReadings,
    weeklyPoints: totals.weeklyPoints,
    monthlyPoints: totals.monthlyPoints,
    currentStreakDays: streak.currentStreakDays,
    longestStreakDays: streak.longestStreakDays,
    lastCompletedDate,
  };
};

const mergeLogs = (localLogs: DayReadingLog[], remoteLogs: DayReadingLog[]) => {
  const map = new Map<string, DayReadingLog>();
  const consider = (log: DayReadingLog) => {
    const existing = map.get(log.date);
    if (!existing) {
      map.set(log.date, log);
      return;
    }
    const existingTs = effectiveTimestamp(existing);
    const nextTs = effectiveTimestamp(log);
    if ((log.completed && !existing.completed) || nextTs > existingTs) {
      map.set(log.date, log);
    }
  };

  remoteLogs.forEach(consider);
  localLogs.forEach(consider);

  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, userId, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [logs, setLogs] = useState<DayReadingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const logsRaw = await AsyncStorage.getItem(STORAGE_KEYS.readingLogs);
        const localLogs: DayReadingLog[] = logsRaw ? JSON.parse(logsRaw) : [];

        if (!isSignedIn) {
          setLogs(localLogs);
          const computed = computeAggregates(localLogs);
          setStats(computed);
          await AsyncStorage.setItem(STORAGE_KEYS.userStats, JSON.stringify(computed));
          return;
        }

        await ensureProfileExists(userId);
        const remoteLogs = await fetchRemoteLogs(userId);
        const merged = mergeLogs(localLogs, remoteLogs);
        setLogs(merged);
        const computed = computeAggregates(merged);
        setStats(computed);
        await persist(merged, computed);

        if (merged.length > remoteLogs.length || localLogs.length > 0) {
          upsertRemoteLogs(userId, merged).catch((error) => console.warn("Remote logs sync failed", error));
        }
      } catch (error) {
        console.warn("Stats hydrate failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (authLoading) return;
    hydrate();
  }, [authLoading, isSignedIn, userId]);

  const persist = async (nextLogs: DayReadingLog[], nextStats: UserStats) => {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.readingLogs, JSON.stringify(nextLogs)),
      AsyncStorage.setItem(STORAGE_KEYS.userStats, JSON.stringify(nextStats)),
    ]);
  };

  const refreshStats = () => {
    const nextStats = computeAggregates(logs);
    setStats(nextStats);
    persist(logs, nextStats).catch((error) => console.warn("Stats persist failed", error));
  };

  const recordCompletion = async (log: DayReadingLog) => {
    const filtered = logs.filter((l) => l.date !== log.date);
    const nextLogs = [...filtered, log].sort((a, b) => (a.date < b.date ? -1 : 1));
    const nextStats = computeAggregates(nextLogs);
    setLogs(nextLogs);
    setStats(nextStats);
    try {
      await persist(nextLogs, nextStats);
      if (isSignedIn && userId) {
        upsertRemoteLog(userId, log).catch((error) => console.warn("Remote log persist failed", error));
      }
    } catch (error) {
      console.warn("Stats save failed", error);
    }
  };

  const setLogsDirectly = (nextLogs: DayReadingLog[]) => {
    const nextStats = computeAggregates(nextLogs);
    setLogs(nextLogs);
    setStats(nextStats);
    persist(nextLogs, nextStats).catch((error) => console.warn("Stats persist failed", error));
    if (isSignedIn && userId) {
      upsertRemoteLogs(userId, nextLogs).catch((error) => console.warn("Remote logs persist failed", error));
    }
  };

  return (
    <StatsContext.Provider value={{ stats, logs, isLoading, refreshStats, recordCompletion, setLogsDirectly }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsContext = () => useContext(StatsContext);
