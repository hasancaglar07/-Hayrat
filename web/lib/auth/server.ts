import { createSupabaseServerClient } from "../supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export const getServerSupabase = (): SupabaseClient | null => {
  return createSupabaseServerClient();
};

const fetchCurrentUser = async (): Promise<User | null> => {
  const client = createSupabaseServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error) {
    if (error.message !== "Auth session missing!") {
      console.error("getCurrentUser error", error.message);
    }
    return null;
  }
  return data.user ?? null;
};

export const getCurrentUser = fetchCurrentUser;
