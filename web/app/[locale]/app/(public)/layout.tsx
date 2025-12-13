import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";
import { LandingNav } from "@/components/layout/LandingNav";
import { Footer } from "@/components/layout/Footer";

type Props = { children: React.ReactNode; params: { locale: Locale } };

export const dynamic = "force-dynamic";

export default function PublicAppLayout({ children, params }: Props) {
  const t = getMessages(params.locale);
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <LandingNav locale={params.locale} t={t} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="panel p-4 ring-1 ring-border-light/70 backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:p-8">
          {children}
        </div>
      </main>
      <Footer locale={params.locale} />
    </div>
  );
}
