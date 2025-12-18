import type { ThemeMode } from "../data/types";
import type { ColorSchemeName } from "react-native";

type ThemePreference = "system" | ThemeMode;

export const resolveTheme = (
  themePreference: ThemePreference | undefined,
  readingTheme: ThemeMode | undefined,
  colorScheme: ColorSchemeName
): ThemeMode => {
  if (themePreference && themePreference !== "system") return themePreference;
  if (themePreference === "system") return colorScheme === "dark" ? "dark" : "light";
  return readingTheme || "light";
};
