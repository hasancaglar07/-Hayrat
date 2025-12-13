'use client';

import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

export function AppMainFrame({
  locale,
  schemaNotice,
  children,
}: {
  locale: Locale;
  schemaNotice: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReadingDay = pathname.startsWith(`/${locale}/app/reading/`);

  if (isReadingDay) {
    return <main className="w-full px-0 py-0">{children}</main>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="panel p-4 ring-1 ring-border-light/70 backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:p-8">
        <div className="mb-6">{schemaNotice}</div>
        {children}
      </div>
    </main>
  );
}

