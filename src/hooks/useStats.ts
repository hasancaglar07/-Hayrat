import { useStatsContext } from "../context/StatsContext";
import { DayReadingLog } from "../data/types";

// Hook wrapper for stats context (see docs/06-gamification-and-ranking.md)
export const useStats = () => {
  const ctx = useStatsContext();

  const recordCompletion = (log: DayReadingLog) => ctx.recordCompletion(log);
  const refreshStats = () => ctx.refreshStats();

  return { ...ctx, recordCompletion, refreshStats };
};
