import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
      url: alternates.canonical,
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

