'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RefreshOnce({ id }: { id: string }) {
  const router = useRouter();

  useEffect(() => {
    try {
      const key = `refresh_once:${id}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      router.refresh();
    } catch {
      router.refresh();
    }
  }, [id, router]);

  return null;
}

