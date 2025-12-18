#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const contentLocales = ["ar", "tr", "en", "es", "fr", "de", "pt", "id", "ru", "hi", "ur", "zh"];
const baseLocale = "ar";

const contentDir = path.join(__dirname, "..", "packages", "content", "src");

const loadSections = (locale) => {
  const filePath = path.join(contentDir, `readingSections.${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const getIds = (sections) => sections.map((s) => s?.id).filter(Boolean);

const baseSections = loadSections(baseLocale);
const baseIds = new Set(getIds(baseSections));

let hasErrors = false;

for (const locale of contentLocales) {
  const sections = loadSections(locale);
  const ids = getIds(sections);
  const idSet = new Set(ids);

  const missing = [...baseIds].filter((id) => !idSet.has(id));
  const extra = ids.filter((id) => !baseIds.has(id));
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

  if (missing.length) {
    hasErrors = true;
    console.error(`content: ${locale} missing ${missing.length} section ids (vs ${baseLocale})`);
    console.error(missing.slice(0, 40).map((id) => `  - ${id}`).join("\n"));
    if (missing.length > 40) console.error(`  ... +${missing.length - 40} more`);
  }

  if (extra.length) {
    hasErrors = true;
    console.error(`content: ${locale} has ${extra.length} extra section ids (vs ${baseLocale})`);
    console.error(extra.slice(0, 40).map((id) => `  - ${id}`).join("\n"));
    if (extra.length > 40) console.error(`  ... +${extra.length - 40} more`);
  }

  if (duplicates.length) {
    hasErrors = true;
    console.error(`content: ${locale} has ${duplicates.length} duplicate ids`);
    console.error([...new Set(duplicates)].slice(0, 40).map((id) => `  - ${id}`).join("\n"));
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`content: OK (${contentLocales.length} locales, base=${baseLocale}, ids=${baseIds.size})`);
