import { useUserContext } from "../context/UserContext";
import { AppLanguage, UserProfile } from "../data/types";

// Hook wrapper for user context (see docs/02-architecture.md)
export const useUser = () => {
  const ctx = useUserContext();

  const setLanguage = (language: AppLanguage) => ctx.setLanguage(language);
  const updateProfile = (profile: Partial<UserProfile>) => ctx.updateProfile(profile);

  return { ...ctx, setLanguage, updateProfile };
};
