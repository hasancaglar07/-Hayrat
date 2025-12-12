import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/info/benefits",
    title: `${t.brand} | ${t.nav.benefits}`,
    description: t.benefits.intro,
    type: "article",
  });
}

export default function BenefitsPage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);

  return (
    <article className="panel space-y-10 p-6 md:p-8">
      <header className="liquid-section-header space-y-3">
        <p className="kicker">{t.nav.benefits}</p>
        <h1 className="page-title">{t.benefits.title}</h1>
        <p className="text-text-medium">{t.benefits.intro}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {t.benefits.sections.map((section) => (
          <div key={section.title} className="card p-6 transition-shadow hover:shadow-lg">
            <h2 className="section-title-sm">{section.title}</h2>
            <p className="mt-2 text-text-medium leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
