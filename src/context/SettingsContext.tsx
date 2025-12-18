import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n";
import { AppLanguage, AppSettings, ContentLanguage, ReadingSettings, ThemeMode } from "../data/types";
import { STORAGE_KEYS } from "../data/storageKeys";
import { scheduleAllNotifications, cancelAllNotifications, requestPermission } from "../utils/notifications";
import { getDefaultAppLanguage } from "../utils/deviceLanguage";
import { useAuth } from "../hooks/useAuth";
import { fetchSettings as fetchRemoteSettings, upsertAppSettings as upsertRemoteAppSettings, upsertReadingSettings as upsertRemoteReadingSettings } from "../lib/supabase/settings";

const deviceLanguage = getDefaultAppLanguage();

// Settings context (see docs/05-reading-experience.md, docs/07-i18n-and-content.md, docs/08-notifications-and-reminders.md)
export interface SettingsContextValue {
  appSettings: AppSettings;
  readingSettings: ReadingSettings;
  isLoading: boolean;
  setTheme: (theme: ThemeMode) => void;
  updateAppSettings: (partial: Partial<AppSettings>) => Promise<void>;
  updateReadingSettings: (partial: Partial<ReadingSettings>) => Promise<void>;
}

const defaultAppSettings: AppSettings = {
  language: deviceLanguage,
  notificationsEnabled: false,
  remindMissedDays: false,
  notificationTime: "21:00",
  missedReminderDay: 1,
  missedReminderHour: 20,
  missedReminderMinute: 0,
};

const defaultReadingSettings: ReadingSettings = {
  fontSize: 18,
  lineHeightMultiplier: 1.4,
  theme: "light",
  contentLanguages: ["transliteration", deviceLanguage],
  autoScroll: false,
  autoScrollSpeed: 40,
  screenLock: false,
  hapticsEnabled: true,
};

const normalizeContentLanguages = (langs: ContentLanguage[] | undefined, appLanguage: AppLanguage): ContentLanguage[] => {
  const base: ContentLanguage[] = ["transliteration"];
  const unique = Array.from(new Set([...(langs || []), ...base].filter(Boolean))) as ContentLanguage[];
  if (unique.length > 0) return unique;
  return [...base, appLanguage];
};

const deriveContentLanguagesFromLegacy = (raw: any, appLanguage: AppLanguage): ContentLanguage[] => {
  if (Array.isArray(raw?.contentLanguages) && raw.contentLanguages.length) {
    return normalizeContentLanguages(raw.contentLanguages as ContentLanguage[], appLanguage);
  }

  // Backward compatibility for showX toggles
  const list: ContentLanguage[] = [];
  const showArabic = raw?.showArabic ?? false;
  const showTransliteration = raw?.showTransliteration ?? true;
  const showTranslation = raw?.showTranslation ?? true;
  if (showArabic) list.push("arabic");
  if (showTransliteration) list.push("transliteration");
  if (showTranslation) list.push(appLanguage);
  return normalizeContentLanguages(list, appLanguage);
};

const deriveShowFlags = (langs: ContentLanguage[]) => {
  const showArabic = langs.includes("arabic");
  const showTransliteration = langs.includes("transliteration");
  const showTranslation = langs.some((l) => l !== "arabic" && l !== "transliteration");
  return { showArabic, showTransliteration, showTranslation };
};

const SettingsContext = createContext<SettingsContextValue>({
  appSettings: defaultAppSettings,
  readingSettings: defaultReadingSettings,
  isLoading: true,
  setTheme: () => {},
  updateAppSettings: async () => {},
  updateReadingSettings: async () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, userId, isLoading: authLoading } = useAuth();
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(defaultReadingSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const [appRaw, readingRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.appSettings),
          AsyncStorage.getItem(STORAGE_KEYS.readingSettings),
        ]);

        const parsedApp = appRaw ? ({ ...defaultAppSettings, ...(JSON.parse(appRaw) as AppSettings) } as AppSettings) : defaultAppSettings;
        const localReadingParsed = readingRaw ? (JSON.parse(readingRaw) as ReadingSettings & { showArabic?: boolean; showTransliteration?: boolean; showTranslation?: boolean }) : null;
        const localReading: ReadingSettings = localReadingParsed
          ? {
              ...defaultReadingSettings,
              ...localReadingParsed,
              contentLanguages: deriveContentLanguagesFromLegacy(localReadingParsed, parsedApp.language || defaultAppSettings.language),
            }
          : {
              ...defaultReadingSettings,
              contentLanguages: ["transliteration", parsedApp.language || defaultAppSettings.language],
            };

        if (!isSignedIn) {
          setAppSettings(parsedApp);
          if (parsedApp.language) i18n.changeLanguage(parsedApp.language);
          setReadingSettings(localReading);
          return;
        }

        const remote = await fetchRemoteSettings(userId);
        const remoteApp = remote?.appSettings ?? defaultAppSettings;
        const nextApp = remote?.hasRemoteApp ? remoteApp : parsedApp;

        const remoteReadingRaw = remote?.readingSettings ?? {};
        const derivedContent = deriveContentLanguagesFromLegacy(remoteReadingRaw, nextApp.language || defaultAppSettings.language);
        const storedReading: Partial<ReadingSettings> = {};
        const rr: any = remoteReadingRaw;
        if (rr.fontSize != null) storedReading.fontSize = rr.fontSize;
        if (rr.lineHeightMultiplier != null) storedReading.lineHeightMultiplier = rr.lineHeightMultiplier;
        if (rr.theme != null) storedReading.theme = rr.theme;
        if (rr.autoScroll != null) storedReading.autoScroll = rr.autoScroll;

        const nextReading: ReadingSettings = remote?.hasRemoteReading
          ? {
              ...defaultReadingSettings,
              ...localReading,
              ...storedReading,
              contentLanguages: derivedContent,
            }
          : localReading;

        setAppSettings(nextApp);
        if (nextApp.language) i18n.changeLanguage(nextApp.language);
        setReadingSettings(nextReading);

        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(nextApp)),
          AsyncStorage.setItem(STORAGE_KEYS.readingSettings, JSON.stringify(nextReading)),
        ]);

        if (!remote?.hasRemoteApp) {
          upsertRemoteAppSettings(userId, nextApp).catch((error) => console.warn("Remote app settings seed failed", error));
        }
        if (!remote?.hasRemoteReading) {
          const flags = deriveShowFlags(nextReading.contentLanguages);
          upsertRemoteReadingSettings(userId, { ...nextReading, ...flags } as any).catch((error) =>
            console.warn("Remote reading settings seed failed", error)
          );
        }
      } catch (error) {
        console.warn("Settings hydrate failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (authLoading) return;
    hydrate();
  }, [authLoading, isSignedIn, userId]);

  const setTheme = (theme: ThemeMode) => {
    const next = { ...readingSettings, theme };
    setReadingSettings(next);
    AsyncStorage.setItem(STORAGE_KEYS.readingSettings, JSON.stringify(next)).catch((error) =>
      console.warn("Persist theme failed", error)
    );
    if (isSignedIn && userId) {
      const flags = deriveShowFlags(next.contentLanguages);
      upsertRemoteReadingSettings(userId, { ...next, ...flags } as any).catch((error) =>
        console.warn("Persist remote theme failed", error)
      );
    }
  };

  const updateAppSettings = async (partial: Partial<AppSettings>) => {
    let next = { ...appSettings, ...partial };
    const enablingNotifications = partial.notificationsEnabled === true && appSettings.notificationsEnabled !== true;
    if (enablingNotifications) {
      const granted = await requestPermission();
      if (!granted) {
        next = { ...next, notificationsEnabled: false };
      }
    }
    setAppSettings(next);
    if (partial.language) i18n.changeLanguage(partial.language);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(next));
      if (next.notificationsEnabled) {
        await scheduleAllNotifications(next);
      } else {
        await cancelAllNotifications();
      }
      if (isSignedIn && userId) {
        await upsertRemoteAppSettings(userId, next);
      }
    } catch (error) {
      console.warn("Persist app settings failed", error);
    }
  };

  const updateReadingSettings = async (partial: Partial<ReadingSettings>) => {
    const next = {
      ...readingSettings,
      ...partial,
      contentLanguages: normalizeContentLanguages(partial.contentLanguages || readingSettings.contentLanguages, appSettings.language || defaultAppSettings.language),
    };
    setReadingSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.readingSettings, JSON.stringify(next));
      if (isSignedIn && userId) {
        const flags = deriveShowFlags(next.contentLanguages);
        await upsertRemoteReadingSettings(userId, { ...next, ...flags } as any);
      }
    } catch (error) {
      console.warn("Persist reading settings failed", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ appSettings, readingSettings, isLoading, setTheme, updateAppSettings, updateReadingSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
