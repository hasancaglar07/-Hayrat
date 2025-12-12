"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function FooterAuthActions({
  locale,
  openLabel,
  signInLabel,
  signOutLabel,
  profileLabel,
  guestReadLabel,
}: {
  locale: Locale;
  openLabel: string;
  signInLabel: string;
  signOutLabel: string;
  profileLabel: string;
  guestReadLabel: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase?.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });
    const { data: listener } = supabase?.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    }) ?? { data: null };

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    if (!supabase || signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace(`/${locale}`);
      router.refresh();
    }
  };

  if (session) {
    return (
      <>
        <Button asChild size="sm" className="shadow-sm shadow-primary/30 hover:bg-primary-dark">
          <Link href={`/${locale}/app`}>{openLabel}</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:text-primary">
          <Link href={`/${locale}/app/profile`}>{profileLabel}</Link>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-border text-foreground hover:text-primary"
          onClick={signOut}
          disabled={signingOut}
        >
          {signOutLabel}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="sm" className="shadow-sm shadow-primary/30 hover:bg-primary-dark">
        <Link href={`/${locale}/app`}>{openLabel}</Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:text-primary">
        <Link href={`/${locale}/auth?next=/${locale}/app`}>{signInLabel}</Link>
      </Button>
      <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:text-primary">
        <Link href={`/${locale}/read`}>{guestReadLabel}</Link>
      </Button>
    </>
  );
}

