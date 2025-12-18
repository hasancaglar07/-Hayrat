/* eslint-disable import/no-named-as-default-member */
// Minimal i18n setup placeholder (see docs/07-i18n-and-content.md)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getDefaultAppLanguage } from "../utils/deviceLanguage";
import { fallbackLanguage, translations } from "@delail/i18n";

const initialLanguage = getDefaultAppLanguage();

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  resources: Object.fromEntries(Object.entries(translations).map(([lng, dict]) => [lng, { translation: dict }])),
});

export default i18n;
