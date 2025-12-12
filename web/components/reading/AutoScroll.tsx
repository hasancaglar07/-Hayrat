'use client';

import { useEffect } from "react";

export function AutoScroll({ enabled, speed }: { enabled?: boolean; speed?: number }) {
  useEffect(() => {
    if (!enabled) return;

    let animationFrame: number | null = null;
    let lastTime = performance.now();
    const speedPxPerSecond = typeof speed === "number" && speed > 0 ? speed : 30;

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      window.scrollBy(0, (speedPxPerSecond * delta) / 1000);

      if (window.innerHeight + window.scrollY < document.body.scrollHeight - 4) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    };
  }, [enabled, speed]);

  return null;
}
