import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale, locales, Locale } from "@/i18n/config";
import { metadataBase } from "@/lib/seo/metadata";
import { ThemePreferenceSync } from "@/components/theme/ThemePreferenceSync";
import clsx from "clsx";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase,
  title: "Delailül Hayrat Web",
  description: "Delailül Hayrat okumanı web üzerinden düzenli şekilde takip et.",
  applicationName: "Delail-i Hayrat Takip",
  category: "religion",
  openGraph: {
    type: "website",
    siteName: "Delail-i Hayrat",
    images: ["/images/logo2.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo2.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/images/favicon.png" }],
    apple: [{ url: "/images/icon.png" }],
  },
};

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], display: "swap", variable: "--font-arabic", weight: ["400", "500", "600", "700"] });

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale?: Locale };
}) {
  const locale = params?.locale && locales.includes(params.locale) ? params.locale : defaultLocale;
  const rtlLocales: Locale[] = ["ar", "ur"];

  return (
    <html
      lang={locale}
      dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}
      className={clsx(inter.variable, notoNaskhArabic.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0,0&display=swap"
        />
      </head>
      <body className="min-h-screen text-text-dark">
        <Script src="https://unpkg.com/lottie-web@5.12.2/build/player/lottie.min.js" strategy="afterInteractive" />
        <ThemePreferenceSync />
        {children}
      </body>
    </html>
  );
}
