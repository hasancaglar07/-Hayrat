"use client";

import { useEffect, useRef } from "react";

export function TealGlowBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let target = { x: 50, y: 12 };
    const current = { x: 50, y: 12 };

    const apply = () => {
      el.style.setProperty("--glow-x", `${current.x}%`);
      el.style.setProperty("--glow-y", `${current.y}%`);
    };

    const update = () => {
      current.x += (target.x - current.x) * 0.03;
      current.y += (target.y - current.y) * 0.03;
      apply();

      const dx = Math.abs(target.x - current.x);
      const dy = Math.abs(target.y - current.y);
      if (dx < 0.1 && dy < 0.1) {
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(update);
    };

    const ensureAnimation = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      target = {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(25, y)),
      };
      ensureAnimation();
    };

    const onLeave = () => {
      target = { x: 50, y: 12 };
      ensureAnimation();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    apply();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: "var(--page-gradient)",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "var(--glow-gradient)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 min-h-screen w-full">{children}</div>
    </div>
  );
}
