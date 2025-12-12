import type { Metadata } from "next";
import { getMessages, locales, type Locale } from "@/i18n/config";
import { TealGlowBackground } from "@/components/layout/TealGlowBackground";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: Props): Metadata {
  const messages = getMessages(params.locale);
  return createPageMetadata({
    locale: params.locale,
    path: "/",
    title: messages.landing.seoTitle,
    description: messages.landing.seoDescription,
    images: ["/images/logo2.png"],
  });
}

export default function LocaleLayout({ children, params }: Props) {
  return (
    <div data-locale={params.locale}>
      <TealGlowBackground>{children}</TealGlowBackground>
    </div>
  );
}
