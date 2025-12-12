import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { FaqList } from "./faqClient";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/info/faq",
    title: `${t.brand} | ${t.nav.faq}`,
    description: t.faq.intro,
  });
}

export default function FaqPage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);
  return (
    <div className="panel space-y-6 p-6 md:p-8">
      <div className="space-y-3">
        <p className="kicker">{t.nav.faq}</p>
        <h1 className="page-title">{t.faq.title}</h1>
        <p className="text-text-medium">{t.faq.intro}</p>
      </div>
      <FaqList items={t.faq.items} />
    </div>
  );
}
