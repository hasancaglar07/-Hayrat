// Central place for configurable values (IBAN, donation URL, metrics)
export const DONATION_IBAN = process.env.EXPO_PUBLIC_IBAN || "TR00 0000 0000 0000 0000 0000";
export const DONATION_URL = process.env.EXPO_PUBLIC_DONATION_URL || "";
export const DONATION_METRICS = {
  countries: process.env.EXPO_PUBLIC_METRIC_COUNTRIES || "80+",
  readings: process.env.EXPO_PUBLIC_METRIC_READINGS || "500k+",
};
export const PRIVACY_POLICY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL || "https://delail.app/privacy";
export const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL || "https://delail.app/terms";
export const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || "support@delail.app";
