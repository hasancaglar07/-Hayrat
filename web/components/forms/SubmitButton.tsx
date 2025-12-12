'use client';

import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { buttonVariants } from "@/components/ui/button";

export function SubmitButton({ label, loadingLabel, className }: { label: string; loadingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        buttonVariants({ variant: "default", size: "lg" }),
        "group relative w-full rounded-xl px-6 py-3 text-base font-bold shadow-sm transition-all hover:bg-primary-dark disabled:opacity-60",
        className,
      )}
    >
      <span className={clsx("material-symbols-outlined transition-transform", pending && "animate-spin")}>{pending ? "progress_activity" : "check_circle"}</span>
      {pending ? loadingLabel ?? label : label}
    </button>
  );
}
