import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const baseFetch = (globalThis as unknown as { fetch?: typeof fetch }).fetch;
const fetchTimeoutMs = Number(process.env.SUPABASE_FETCH_TIMEOUT_MS ?? 8000);

const fetchWithTimeout: typeof fetch = async (input, init) => {
  if (!baseFetch) throw new Error("fetch is not available");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), fetchTimeoutMs);

  let signal = controller.signal;
  if (init?.signal) {
    const anySignal = (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any;
    if (anySignal) {
      signal = anySignal([init.signal, controller.signal]);
    } else {
      init.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    // Prevent Next.js server-side fetch caching for Supabase queries.
    return await baseFetch(input, { ...(init ?? {}), cache: "no-store", signal } as RequestInit);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const createSupabaseServerClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const cookieStore = cookies();
  type CookieOptions = Record<string, unknown>;
  const options: {
    cookies: {
      get(name: string): string | undefined;
      set(name: string, value: string, options: CookieOptions): void;
      remove(name: string, options: CookieOptions): void;
    };
    global?: { fetch: typeof fetch };
  } = {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // cookies() is read-only in server components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // cookies() is read-only in server components
        }
      },
    },
  };
  if (baseFetch) {
    options.global = { fetch: fetchWithTimeout };
  }
  return createServerClient(supabaseUrl, supabaseAnonKey, options);
};

export const createSupabaseAdminClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  const options: Parameters<typeof createClient>[2] = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  };
  if (baseFetch) {
    options.global = { fetch: fetchWithTimeout };
  }
  return createClient(supabaseUrl, supabaseServiceKey, options);
};
