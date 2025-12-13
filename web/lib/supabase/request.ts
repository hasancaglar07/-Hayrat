import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CookieOptions = Record<string, unknown>;

export const createSupabaseRequestClient = (
  request: NextRequest,
  response: NextResponse,
): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...(options as Record<string, unknown>) });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({
          name,
          value: "",
          ...(options as Record<string, unknown>),
          maxAge: 0,
        });
      },
    },
  });
};
