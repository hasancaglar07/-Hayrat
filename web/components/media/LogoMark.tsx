"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

type LogoMarkProps = {
  alt: string;
  className?: string;
  fallbackSrc?: string;
  animationSrc?: string;
};

export function LogoMark({
  alt,
  className,
  fallbackSrc = "/images/logo2.png",
  animationSrc = "/images/Mosque%20Animation.json",
}: LogoMarkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [animationFailed, setAnimationFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let animation: AnimationItem | null = null;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    (async () => {
      try {
        const mod = await import("lottie-web");
        if (cancelled || !containerRef.current) return;

        const lottie = mod.default ?? mod;
        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: !prefersReducedMotion,
          autoplay: !prefersReducedMotion,
          path: animationSrc,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });

        animation.addEventListener?.("DOMLoaded", () => {
          if (cancelled) return;
          setAnimationReady(true);
        });
        animation.addEventListener?.("data_failed", () => {
          if (cancelled) return;
          setAnimationFailed(true);
        });
      } catch {
        if (cancelled) return;
        setAnimationFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [animationSrc]);

  return (
    <div className={clsx("relative shrink-0 overflow-hidden", className)} role="img" aria-label={alt}>
      {!animationFailed ? (
        <div
          ref={containerRef}
          aria-hidden="true"
          className={clsx(
            "absolute inset-0 h-full w-full pointer-events-none",
            !animationReady && "opacity-0",
          )}
        />
      ) : null}

      <Image
        src={fallbackSrc}
        alt={alt}
        width={96}
        height={96}
        priority
        className={clsx(
          "h-full w-full object-contain",
          !animationFailed && animationReady && "opacity-0",
        )}
      />
    </div>
  );
}
