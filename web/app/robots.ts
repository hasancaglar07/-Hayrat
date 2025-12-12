import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { metadataBase } from "@/lib/seo/metadata";

const internalDisallow = [
  "/app/reading",
  "/app/profile",
  "/app/settings",
  "/app/missed",
  "/app/history",
  "/app/ranking",
  "/auth",
] as const;

export default function robots(): MetadataRoute.Robots {
  const disallow = (locales as readonly Locale[]).flatMap((locale) =>
    internalDisallow.map((path) => `/${locale}${path}`),
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: new URL("/sitemap.xml", metadataBase).toString(),
  };
}

