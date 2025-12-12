'use client';

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export function FlashNotice({
  title,
  body,
  items,
  clearKeys = [],
  variant = "success",
  className,
}: {
  title: string;
  body?: string;
  items?: string[];
  clearKeys?: string[];
  variant?: "success" | "info" | "warning";
  className?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const palette = useMemo(() => {
    if (variant === "warning") return { bg: "bg-orange-50", border: "border-orange-200", title: "text-orange-900", body: "text-orange-800", chip: "bg-orange-100 text-orange-900" };
    if (variant === "info") return { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-900", body: "text-blue-800", chip: "bg-blue-100 text-blue-900" };
    return { bg: "bg-emerald-50", border: "border-emerald-200", title: "text-emerald-900", body: "text-emerald-800", chip: "bg-emerald-100 text-emerald-900" };
  }, [variant]);

  const clear = useCallback(() => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    clearKeys.forEach((key) => next.delete(key));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [clearKeys, pathname, router, searchParams]);

  const onClose = useCallback(() => {
    setHidden(true);
    if (clearKeys.length > 0) clear();
  }, [clear, clearKeys.length]);

  if (hidden) return null;

  return (
    <div className={clsx("panel rounded-2xl border p-4 sm:p-5", palette.bg, palette.border, className)} role="status" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className={clsx("text-base font-bold", palette.title)}>{title}</p>
          {body ? <p className={clsx("text-sm font-medium", palette.body)}>{body}</p> : null}
          {items?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {items.map((item, idx) => (
                <span key={`${idx}-${item}`} className={clsx("rounded-full px-3 py-1 text-micro font-bold", palette.chip)}>
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-text-medium transition-colors hover:bg-black/5 hover:text-text-dark"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}

