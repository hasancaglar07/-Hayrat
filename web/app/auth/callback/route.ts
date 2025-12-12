import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const isLocale = (value: string | undefined): value is Locale => {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
};

const isSafeInternalPath = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  if (value.includes("://")) return false;
  return true;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (code) {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  const cookieLocale = cookies().get("locale")?.value;
  const resolvedLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const defaultNext = `/${resolvedLocale}/app`;
  const redirectTo = isSafeInternalPath(next) ? next : defaultNext;

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
