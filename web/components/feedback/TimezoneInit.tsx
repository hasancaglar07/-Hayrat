'use client';

import { useEffect } from "react";

const COOKIE_NAME = "tz";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function TimezoneInit() {
  useEffect(() => {
    try {
      const hasCookie = document.cookie.split(";").some((part) => part.trim().startsWith(`${COOKIE_NAME}=`));
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!timeZone) return;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(timeZone)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
      if (!hasCookie) {
        const key = "tz_init_done";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          window.location.reload();
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}
