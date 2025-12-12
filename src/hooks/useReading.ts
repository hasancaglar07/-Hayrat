import { useReadingContext } from "../context/ReadingContext";
import { ReadingMode, Weekday } from "../data/types";

// Hook wrapper for reading context (see docs/05-reading-experience.md)
export const useReading = () => {
  const ctx = useReadingContext();

  const start = (dayId: Weekday, mode: ReadingMode, date?: string) => ctx.startReading(dayId, mode, date);
  const complete = (payload: { dayId: Weekday; mode: ReadingMode; date?: string }) => ctx.completeReading(payload);

  return {
    ...ctx,
    startReading: start,
    completeReading: complete,
  };
};
