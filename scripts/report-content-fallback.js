#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const baseLocale = "en";

const contentDir = path.join(__dirname, "..", "packages", "content", "src");

const contentLocales = fs
  .readdirSync(contentDir)
  .map((filename) => {
    const match = filename.match(/^readingSections\.([a-z]+)\.json$/);
    return match?.[1] ?? null;
  })
  .filter(Boolean)
  .sort();

const loadSections = (locale) => {
  const filePath = path.join(contentDir, `readingSections.${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const sectionsToMap = (sections) => new Map(sections.map((s) => [s.id, s]));

if (!contentLocales.includes(baseLocale)) {
  console.error(`content-fallback: missing base locale file readingSections.${baseLocale}.json`);
  process.exit(2);
}

const baseSections = loadSections(baseLocale);
const baseById = sectionsToMap(baseSections);

let hasFallback = false;

for (const locale of contentLocales) {
  if (locale === baseLocale) continue;
  const sections = loadSections(locale);
  const byId = sectionsToMap(sections);

  const byWeekday = {};
  const sampleIds = [];

  for (const [id, base] of baseById.entries()) {
    const current = byId.get(id);
    if (!current) continue;

    const currentText = current.translations?.[locale];
    const baseText = base.translations?.[baseLocale];
    if (typeof currentText !== "string" || typeof baseText !== "string") continue;

    if (currentText.trim() !== baseText.trim()) continue;

    hasFallback = true;
    const weekday = current.weekday || "unknown";
    byWeekday[weekday] = (byWeekday[weekday] || 0) + 1;
    if (sampleIds.length < 12) sampleIds.push(id);
  }

  const total = Object.values(byWeekday).reduce((a, b) => a + b, 0);
  if (!total) continue;

  console.error(`content-fallback: ${locale} has ${total} sections identical to ${baseLocale}`);
  for (const [weekday, count] of Object.entries(byWeekday).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.error(`  - ${weekday}: ${count}`);
  }
  console.error(`  - sample: ${sampleIds.join(", ")}`);
}

if (hasFallback) {
  process.exit(1);
}

console.log(`content-fallback: OK (locales=${contentLocales.length}, base=${baseLocale})`);
