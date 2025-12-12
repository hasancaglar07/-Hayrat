"use client";

import Image from "next/image";
import clsx from "clsx";

type LogoMarkProps = {
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export function LogoMark({
  alt,
  className,
  fallbackSrc = "/images/logo2.png",
}: LogoMarkProps) {
  return (
    <div className={clsx("relative shrink-0", className)} role="img" aria-label={alt}>
      <Image src={fallbackSrc} alt={alt} width={96} height={96} priority className="h-full w-full object-contain" />
    </div>
  );
}
