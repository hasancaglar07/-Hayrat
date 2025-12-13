import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "./i18n/config";
import { createSupabaseRequestClient } from "./lib/supabase/request";

const PUBLIC_FILE = /\.(.*)$/;

const isLocale = (value: string | undefined): value is Locale => {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/auth/callback") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  const cookieLocale = request.cookies.get("locale")?.value;

  if (isLocale(firstSegment)) {
    const response = NextResponse.next();
    if (cookieLocale !== firstSegment) {
      response.cookies.set("locale", firstSegment, { path: "/", sameSite: "lax" });
    }
    // Keep Supabase auth cookies refreshed for SSR routes.
    try {
      const supabase = createSupabaseRequestClient(request, response);
      await supabase?.auth.getUser();
    } catch (error) {
      console.error("supabase middleware getUser failed", error);
    }
    return response;
  }

  const resolvedLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${resolvedLocale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("locale", resolvedLocale, { path: "/", sameSite: "lax" });
  try {
    const supabase = createSupabaseRequestClient(request, response);
    await supabase?.auth.getUser();
  } catch (error) {
    console.error("supabase middleware getUser failed", error);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon.ico).*)"],
};
