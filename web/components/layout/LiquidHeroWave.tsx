import { useId } from "react";

type LiquidHeroWaveProps = {
  className?: string;
};

export function LiquidHeroWave({ className }: LiquidHeroWaveProps) {
  const uid = useId();
  const gradientId = `liquid-wave-gradient-${uid}`;
  const filterId = `liquid-soften-${uid}`;
  return (
    <div
      className={[
        "pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 sm:h-40 lg:h-52",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--primary-rgb))" stopOpacity="0.22" />
            <stop offset="65%" stopColor="rgb(var(--primary-rgb))" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(var(--primary-rgb))" stopOpacity="0" />
          </linearGradient>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <g className="liquid-wave-back" filter={`url(#${filterId})`}>
          <path
            fill={`url(#${gradientId})`}
            d="M0,96L60,122.7C120,149,240,203,360,213.3C480,224,600,192,720,165.3C840,139,960,117,1080,128C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </g>
        <g className="liquid-wave-front">
          <path
            fill="rgb(var(--primary-rgb))"
            fillOpacity="0.12"
            d="M0,160L80,181.3C160,203,320,245,480,250.7C640,256,800,224,960,197.3C1120,171,1280,149,1360,138.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </g>
      </svg>
    </div>
  );
}
