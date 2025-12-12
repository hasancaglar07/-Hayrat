import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { localizedPath, metadataBase } from "@/lib/seo/metadata";

const publicPaths = [
  "/",
  "/app/about",
  "/app/donate",
  "/app/info/benefits",
  "/app/info/faq",
  "/app/info/what-is",
  "/app/info/virtues",
  "/app/info/benefits-of-reading",
  "/app/info/etiquette",
  "/app/info/weekly-plan",
  "/app/info/author-history",
  "/app/legal/privacy-policy",
  "/app/legal/terms-of-use",
  "/app/legal/cookie-policy",
  "/app/legal/data-protection",
  "/app/legal/disclaimer",
  "/app/legal/accessibility",
  "/app/legal/security",
  "/app/legal/copyright",
  "/app/legal/contact",
] as const;

const priorityForPath = (path: string) => {
  if (path === "/") return 1;
  if (path.startsWith("/app/info")) return 0.85;
  if (path.startsWith("/app/legal")) return 0.7;
  return 0.8;
};

const changeFrequencyForPath = (path: string): MetadataRoute.Sitemap[number]["changeFrequency"] => {
  if (path === "/") return "weekly";
  if (path.startsWith("/app/info")) return "monthly";
  if (path.startsWith("/app/legal")) return "yearly";
  return "monthly";
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales as readonly Locale[]) {
    for (const path of publicPaths) {
      const url = new URL(localizedPath(locale, path), metadataBase).toString();
      entries.push({
        url,
        lastModified,
        changeFrequency: changeFrequencyForPath(path),
        priority: priorityForPath(path),
      });
    }
  }

  return entries;
}

