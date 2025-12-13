import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { createSupabaseRequestClient } from "@/lib/supabase/request";

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

export async function GET(nextRequest: NextRequest) {
  const url = new URL(nextRequest.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  const cookieCarrier = new NextResponse(null);
  let callbackError: "oauth" | "missing_code" | null = null;

  if (code) {
    const supabase = createSupabaseRequestClient(nextRequest, cookieCarrier);
    try {
      await supabase?.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("supabase exchangeCodeForSession failed", error);
      callbackError = "oauth";
    }
  } else {
    callbackError = "missing_code";
  }

  const cookieLocale = nextRequest.cookies.get("locale")?.value;
  const resolvedLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const defaultNext = `/${resolvedLocale}/app`;
  const safeNext = isSafeInternalPath(next) ? next : defaultNext;

  const redirectTo =
    callbackError === null
      ? safeNext
      : `/${resolvedLocale}/auth?next=${encodeURIComponent(safeNext)}&error=${encodeURIComponent(callbackError)}`;

  const response = NextResponse.redirect(new URL(redirectTo, url.origin));
  for (const cookie of cookieCarrier.cookies.getAll()) response.cookies.set(cookie);
  return response;
}
