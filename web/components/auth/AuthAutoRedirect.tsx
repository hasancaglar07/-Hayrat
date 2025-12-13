"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export function AuthAutoRedirect({ locale, nextPath }: { locale: Locale; nextPath: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    let mounted = true;
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!session || started.current) return;
    started.current = true;
    setSecondsLeft(3);
  }, [session]);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      router.replace(nextPath);
      router.refresh();
      return;
    }

    const id = window.setTimeout(() => {
      router.refresh();
      setSecondsLeft((v) => (v === null ? null : v - 1));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [nextPath, router, secondsLeft]);

  if (!session) return null;

  const title =
    locale === "tr"
      ? "Giriş yapıldı, yönlendiriliyorsun…"
      : locale === "ar"
        ? "تم تسجيل الدخول، يتم التحويل…"
        : "Signed in — redirecting…";
  const detail =
    secondsLeft === null
      ? null
      : locale === "tr"
        ? `${secondsLeft} sn`
        : locale === "ar"
          ? `${secondsLeft} ث`
          : `${secondsLeft}s`;

  return (
    <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
      <p className="text-base font-semibold text-primary">{title}</p>
      <p className="mt-2 text-sm text-text-medium">
        {locale === "tr"
          ? "Hesabın doğrulanıyor. Birkaç saniye içinde takip ekranına geçeceksin."
          : locale === "ar"
            ? "يتم التحقق من الحساب. سيتم نقلك إلى صفحة المتابعة خلال ثوانٍ."
            : "Verifying your session. You’ll be taken to the app in a few seconds."}{" "}
        {detail ? <span className="font-semibold text-text-dark">({detail})</span> : null}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          size="sm"
          className="shadow-sm shadow-primary/30 hover:bg-primary-dark"
          onClick={() => {
            router.replace(nextPath);
            router.refresh();
          }}
        >
          {locale === "tr" ? "Şimdi aç" : locale === "ar" ? "افتح الآن" : "Open now"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => router.refresh()}>
          {locale === "tr" ? "Yenile" : locale === "ar" ? "تحديث" : "Refresh"}
        </Button>
      </div>
    </div>
  );
}

