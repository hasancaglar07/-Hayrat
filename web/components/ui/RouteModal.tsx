'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export function RouteModal({ children, className }: { children: React.ReactNode; className?: string }) {
  const router = useRouter();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={() => router.back()}
      />
      <div className={clsx("absolute inset-0 flex items-end justify-center p-3 sm:items-center sm:p-6", className)}>
        <div
          className="relative w-full max-w-2xl max-h-[92vh] overflow-auto rounded-3xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => router.back()}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-text-dark shadow-soft ring-1 ring-border-light/70 backdrop-blur hover:bg-white dark:bg-background-offwhite/60 dark:text-white dark:ring-white/10 dark:hover:bg-background-offwhite"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

