'use client';

import { useEffect, useMemo, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type BookmarkRow = {
  user_id: string;
  date: string;
  day_id: string;
  offset: number;
};

export function BookmarkSync({ dayId, date }: { dayId: string; date: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const lastSaveRef = useRef<number>(0);
  const pendingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    const restore = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return;
      const { data } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).maybeSingle();
      if (!mounted || !data) return;
      const row = data as BookmarkRow;
      if (row.day_id === dayId && row.date === date && typeof row.offset === "number") {
        requestAnimationFrame(() => {
          window.scrollTo({ top: row.offset, behavior: "auto" });
        });
      }
    };

    restore().catch(() => {});

    return () => {
      mounted = false;
    };
  }, [supabase, dayId, date]);

  useEffect(() => {
    if (!supabase) return;

    const saveBookmark = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return;
      const offset = Math.round(window.scrollY);
      await supabase
        .from("bookmarks")
        .upsert({ user_id: user.id, date, day_id: dayId, offset }, { onConflict: "user_id" });
    };

    const throttledSave = () => {
      const now = Date.now();
      if (now - lastSaveRef.current < 2000) {
        if (pendingRef.current == null) {
          pendingRef.current = window.setTimeout(() => {
            pendingRef.current = null;
            throttledSave();
          }, 2000);
        }
        return;
      }
      lastSaveRef.current = now;
      saveBookmark().catch(() => {});
    };

    const handleScroll = () => throttledSave();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (pendingRef.current != null) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
    };
  }, [supabase, dayId, date]);

  return null;
}
