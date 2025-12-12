import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n";
import { AppLanguage, UserProfile } from "../data/types";
import { STORAGE_KEYS } from "../data/storageKeys";
import { getDefaultAppLanguage } from "../utils/deviceLanguage";
import { useAuth } from "../hooks/useAuth";
import { ensureProfileExists, upsertProfile as upsertRemoteProfile } from "../lib/supabase/profile";

// User profile context (see docs/02-architecture.md and docs/04-navigation-and-screens.md)
export interface UserContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  loadUserProfile: () => Promise<void>;
  setLanguage: (language: AppLanguage) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  profile: null,
  isLoading: true,
  loadUserProfile: async () => {},
  setLanguage: () => {},
  updateProfile: async () => {},
});

const deviceLanguage = getDefaultAppLanguage();

const createDefaultProfile = (id: string, language: AppLanguage = deviceLanguage, onboardingCompleted = false): UserProfile => {
  const now = new Date().toISOString();
  return {
    id,
    nickname: "Reader",
    appLanguage: language,
    targetReadingDaysPerWeek: 7,
    khatmDurationDays: 7,
    showInGlobalRanking: false,
    createdAt: now,
    updatedAt: now,
    onboardingCompleted,
  };
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, userId, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistLocal = async (nextProfile: UserProfile) => {
    await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(nextProfile));
  };

  const loadUserProfile = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);
      const localProfile = stored ? (JSON.parse(stored) as UserProfile) : null;

      if (!isSignedIn) {
        if (localProfile) {
          setProfile(localProfile);
          if (localProfile.appLanguage) i18n.changeLanguage(localProfile.appLanguage);
        } else {
          setProfile(null);
        }
        return;
      }

      const remote = await ensureProfileExists(userId, localProfile ?? undefined);
      if (remote) {
        setProfile(remote);
        if (remote.appLanguage) i18n.changeLanguage(remote.appLanguage);
        await persistLocal(remote);
      } else if (localProfile) {
        const next = { ...localProfile, id: userId, updatedAt: new Date().toISOString() };
        setProfile(next);
        await persistLocal(next);
        await upsertRemoteProfile(next);
      } else {
        const next = createDefaultProfile(userId, deviceLanguage, false);
        setProfile(next);
        await persistLocal(next);
        await upsertRemoteProfile(next);
      }
    } catch (error) {
      console.warn("User profile load failed", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (authLoading) return;
    loadUserProfile();
  }, [authLoading, loadUserProfile]);

  const setLanguage = (language: AppLanguage) => {
    if (!profile) return;
    const next = { ...profile, appLanguage: language, updatedAt: new Date().toISOString() };
    setProfile(next);
    i18n.changeLanguage(language);
    persistLocal(next).catch((error) => console.warn("Persist language failed", error));
    if (isSignedIn) {
      upsertRemoteProfile({ ...next, id: userId }).catch((error) => console.warn("Persist remote language failed", error));
    }
  };

  const updateProfile = async (partial: Partial<UserProfile>) => {
    if (!userId) return;
    const base =
      profile || createDefaultProfile(userId, partial.appLanguage || deviceLanguage, partial.onboardingCompleted || false);
    const next: UserProfile = {
      ...base,
      ...partial,
      id: isSignedIn ? userId : base.id,
      updatedAt: new Date().toISOString(),
    };
    setProfile(next);
    if (partial.appLanguage) i18n.changeLanguage(partial.appLanguage);
    try {
      await persistLocal(next);
      if (isSignedIn) {
        await upsertRemoteProfile(next);
      }
    } catch (error) {
      console.warn("Persist profile failed", error);
    }
  };

  return (
    <UserContext.Provider value={{ profile, isLoading, loadUserProfile, setLanguage, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
