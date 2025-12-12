'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <Button
      type="button"
      onClick={onCopy}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">{copied ? "check" : "content_copy"}</span>
      {copied ? copiedLabel ?? label : label}
    </Button>
  );
}
