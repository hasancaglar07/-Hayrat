import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../hooks/useSettings";
import { colors } from "../theme/designTokens";

// Layout wrapper applying a calm background per current reading theme
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { readingSettings, appSettings } = useSettings();
  const preference = appSettings.themePreference;
  const theme = preference && preference !== "system" ? preference : readingSettings.theme || "light";

  const backgroundClass =
    theme === "dark" ? "bg-neutral-900" : theme === "sepia" ? "bg-[#f5ecd3]" : "";

  return (
    <SafeAreaView
      // Bottom safe area keeps tab bar clear; top is handled in headers
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: theme === "light" ? colors.background : undefined }}
    >
      <View className={`flex-1 ${backgroundClass}`} style={theme === "light" ? { backgroundColor: colors.background } : undefined}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default AppShell;
