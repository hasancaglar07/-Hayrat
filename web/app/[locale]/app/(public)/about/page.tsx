import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/about",
    title: `${t.brand} | ${t.nav.about}`,
    description: t.about.mission,
    type: "article",
  });
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);

  return (
    <div className="panel space-y-8 p-6 md:p-8">
      <div className="space-y-3">
        <p className="kicker">{t.nav.about}</p>
        <h1 className="page-title">{t.about.title}</h1>
        <p className="text-text-medium">{t.about.mission}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {t.about.sections.map((section) => (
          <div key={section.title} className="card p-6 transition-shadow hover:shadow-lg">
            <h2 className="section-title-sm">{section.title}</h2>
            <p className="mt-2 text-text-medium leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
