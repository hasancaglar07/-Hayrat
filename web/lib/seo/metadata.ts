import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

const PRODUCTION_SITE_URL = "https://www.delailalkhayrat.com";

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isConfiguredLocalhost =
    !!configured &&
    (configured.includes("localhost") || configured.includes("127.0.0.1") || configured.includes("0.0.0.0"));

  if (configured && !(process.env.NODE_ENV === "production" && isConfiguredLocalhost)) return configured;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : "http://localhost:3000";
}

const rawSiteUrl = resolveSiteUrl();
export const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;
export const metadataBase = new URL(siteUrl);

const normalizePath = (path: string) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export function localizedPath(locale: Locale, path: string) {
  const normalized = normalizePath(path);
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function buildAlternates(locale: Locale, path: string) {
  const normalized = normalizePath(path);
  const canonical = localizedPath(locale, normalized);
  const languages = Object.fromEntries(
    locales.map((loc) => [loc, localizedPath(loc, normalized)]),
  ) as Record<Locale, string>;

  return { canonical, languages };
}

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  images = ["/images/logo2.png"],
  keywords,
  noindex = false,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  images?: string[];
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const alternates = buildAlternates(locale, path);
  const canonicalUrl = new URL(alternates.canonical, metadataBase).toString();

  return {
    title,
    description,
    keywords,
    metadataBase,
    alternates,
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
      siteName: "Delail-i Hayrat",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}
