import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const GUEST_ID_KEY = "@delail:guestUserId";

export type OAuthProvider = "google" | "apple";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  guestId: string;
  userId: string;
  isSignedIn: boolean;
  isLoading: boolean;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  guestId: "",
  userId: "",
  isSignedIn: false,
  isLoading: true,
  signInWithProvider: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

const generateGuestId = () => `guest-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

const extractOAuthCode = (url: string): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const direct = parsed.searchParams.get("code");
    if (direct) return direct;
    const hash = parsed.hash?.startsWith("#") ? parsed.hash.slice(1) : parsed.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const hashCode = hashParams.get("code");
      if (hashCode) return hashCode;
    }
  } catch {
    // ignore invalid URLs; fall back to regex parsing below
  }
  const match = url.match(/[?&#]code=([^&#]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

const getOAuthRedirectUrl = () => {
  if (Platform.OS === "web") return Linking.createURL("auth/callback");
  const executionEnvironment = (Constants as any)?.executionEnvironment as string | undefined;
  const isExpoGo =
    executionEnvironment === "storeClient" ||
    (executionEnvironment == null && (Constants as any)?.appOwnership === "expo");
  if (isExpoGo) return Linking.createURL("auth/callback");
  const schemeValue = (Constants.expoConfig as any)?.scheme;
  const scheme = Array.isArray(schemeValue) ? schemeValue[0] : schemeValue;
  if (typeof scheme === "string" && scheme.trim()) {
    return `${scheme.trim()}://auth/callback`;
  }
  return Linking.createURL("auth/callback");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [guestId, setGuestId] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGuestId = async () => {
      try {
        const stored = await AsyncStorage.getItem(GUEST_ID_KEY);
        if (stored) {
          if (mounted) setGuestId(stored);
          return stored;
        }
      } catch {
        // ignore storage errors
      }
      const next = generateGuestId();
      try {
        await AsyncStorage.setItem(GUEST_ID_KEY, next);
      } catch {
        // ignore persist errors
      }
      if (mounted) setGuestId(next);
      return next;
    };

    const hydrate = async () => {
      await loadGuestId();
      if (!supabase) {
        if (mounted) setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    hydrate();

    const { data: subscription } = supabase
      ? supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!mounted) return;
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
        })
      : { data: null };

    const handleAuthUrl = async (url: string) => {
      if (!supabase) return;
      const code = extractOAuthCode(url);
      if (!code) return;
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } catch {
        // ignore invalid auth links
      }
    };

    const handleLink = ({ url }: { url: string }) => {
      handleAuthUrl(url);
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleAuthUrl(url);
    });

    const listener = Linking.addEventListener("url", handleLink);

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
      listener.remove();
    };
  }, []);

  const signInWithProvider = useCallback(async (provider: OAuthProvider) => {
    if (!supabase) throw new Error("supabase_not_configured");
    const redirectTo = getOAuthRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error || !data.url) throw error || new Error("oauth_url_missing");
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success" && result.url) {
      const code = extractOAuthCode(result.url);
      if (!code) throw new Error("oauth_code_missing");
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        const { data: maybeSession } = await supabase.auth.getSession();
        if (!maybeSession.session) throw exchangeError;
      }
    } else if (result.type === "dismiss" || result.type === "cancel") {
      throw new Error("oauth_cancelled");
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) throw new Error("supabase_not_configured");
    if (!email) throw new Error("email_missing");
    const emailRedirectTo = getOAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const isSignedIn = Boolean(session?.user);
  const userId = isSignedIn ? session!.user.id : guestId;

  const value = useMemo<AuthContextValue>(
    () => ({ session, user, guestId, userId, isSignedIn, isLoading, signInWithProvider, signInWithEmail, signOut }),
    [session, user, guestId, userId, isSignedIn, isLoading, signInWithProvider, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
