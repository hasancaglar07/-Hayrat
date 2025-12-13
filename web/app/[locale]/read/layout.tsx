import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";
import { getMobileT } from "@/i18n/mobile";
import { ReadNav } from "@/components/layout/ReadNav";
import { Footer } from "@/components/layout/Footer";

type Props = { children: React.ReactNode; modal: React.ReactNode; params: { locale: Locale } };

export const dynamic = "force-dynamic";

export default function ReadLayout({ children, modal, params }: Props) {
  const t = getMessages(params.locale);
  const mobileT = getMobileT(params.locale);
  const readLabel = mobileT("screen.reading.title", { defaultValue: "Read" });
  const guestBadgeLabel = params.locale === "tr" ? "Misafir Okuma" : params.locale === "ar" ? "قراءة كضيف" : "Guest Reading";

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-dark">
      <ReadNav
        locale={params.locale}
        t={t}
        readLabel={readLabel}
        settingsLabel={t.nav.settings}
        guestBadgeLabel={guestBadgeLabel}
      />
      <main className="mx-auto w-full max-w-6xl px-0 py-8 sm:px-6 lg:px-8">
        <div className="panel rounded-none p-0 ring-1 ring-border-light/70 backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:p-8">
          {children}
        </div>
      </main>
      <Footer locale={params.locale} variant="guest" />
      {modal}
    </div>
  );
}
