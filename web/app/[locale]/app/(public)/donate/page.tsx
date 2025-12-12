import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n/config";
import { createPageMetadata } from "@/lib/seo/metadata";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/app/donate",
    title: `${t.brand} | ${t.nav.donate}`,
    description: t.donate.intro,
  });
}

export default function DonatePage({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale);
  const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <h1 className="page-title text-primary">{t.donate.title}</h1>
          <p className="mt-3 text-base text-text-medium">{t.donate.intro}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {donateUrl ? (
              <Button asChild size="lg" className="h-auto rounded-2xl px-7 py-4 shadow-soft hover:bg-primary-dark">
                <a href={donateUrl} target="_blank" rel="noreferrer">
                  {t.donate.donateOnline}
                </a>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-2xl border-primary/25 px-7 py-4 text-primary shadow-soft hover:bg-primary/5 dark:bg-background-offwhite dark:border-primary/40"
            >
              <Link href={`/${params.locale}/app/about`}>{t.donate.why}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.donate.bankTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base text-text-medium">{t.donate.iban}</p>
          <CopyButton value={t.donate.iban} label={t.donate.copy} copiedLabel={t.common.copied} />
        </CardContent>
      </Card>
    </div>
  );
}
