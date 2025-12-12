import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type SchemaStatus =
  | { ok: true }
  | { ok: false; reason: "missing_env" }
  | { ok: false; reason: "missing_schema"; message?: string }
  | { ok: false; reason: "unknown"; message?: string };

export const getSchemaStatus = async (): Promise<SchemaStatus> => {
  const client = createSupabaseAdminClient() ?? createSupabaseServerClient();
  if (!client) return { ok: false, reason: "missing_env" };

  const { error } = await client.from("reading_logs").select("id").limit(1);
  if (!error) return { ok: true };

  const code = (error as { code?: string } | null)?.code;
  if (code === "PGRST205") return { ok: false, reason: "missing_schema", message: (error as { message?: string } | null)?.message };
  return { ok: false, reason: "unknown", message: (error as { message?: string } | null)?.message };
};

