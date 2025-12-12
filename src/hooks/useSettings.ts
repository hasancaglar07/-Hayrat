import { useSettingsContext } from "../context/SettingsContext";
import { AppSettings, ReadingSettings, ThemeMode } from "../data/types";

// Hook wrapper for settings context (see docs/05-reading-experience.md and docs/08-notifications-and-reminders.md)
export const useSettings = () => {
  const ctx = useSettingsContext();

  const setTheme = (theme: ThemeMode) => ctx.setTheme(theme);
  const updateAppSettings = (partial: Partial<AppSettings>) => ctx.updateAppSettings(partial);
  const updateReadingSettings = (partial: Partial<ReadingSettings>) => ctx.updateReadingSettings(partial);

  return { ...ctx, setTheme, updateAppSettings, updateReadingSettings };
};
