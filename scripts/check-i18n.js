#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const languages = ["tr", "ar", "en", "fr", "id", "es", "de", "pt", "ru", "hi", "ur", "zh"];
const fallbackLanguage = "tr";
const strict = process.argv.includes("--strict");

const i18nDir = path.join(__dirname, "..", "packages", "i18n", "src");

const loadJson = (lang) => {
  const filePath = path.join(i18nDir, `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const isValidValue = (value) => typeof value === "string" || (Array.isArray(value) && value.every((v) => typeof v === "string"));

const base = loadJson(fallbackLanguage);
const baseKeys = Object.keys(base);

let hasErrors = false;

for (const lang of languages) {
  const data = loadJson(lang);
  const keys = new Set(Object.keys(data));
  const missing = baseKeys.filter((k) => !keys.has(k));
  const invalid = Object.entries(data).filter(([, v]) => !isValidValue(v));

  if (missing.length) {
    console.error(`i18n: ${lang} is missing ${missing.length} keys (vs ${fallbackLanguage})`);
    console.error(missing.slice(0, 40).map((k) => `  - ${k}`).join("\n"));
    if (missing.length > 40) console.error(`  ... +${missing.length - 40} more`);
    if (strict) hasErrors = true;
  }

  if (invalid.length) {
    hasErrors = true;
    console.error(`i18n: ${lang} has ${invalid.length} non-string/non-string[] values`);
    console.error(invalid.slice(0, 40).map(([k]) => `  - ${k}`).join("\n"));
    if (invalid.length > 40) console.error(`  ... +${invalid.length - 40} more`);
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`i18n: OK (${languages.length} languages, base=${fallbackLanguage}, keys=${baseKeys.length})`);
