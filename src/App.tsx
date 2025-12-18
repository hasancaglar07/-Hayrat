import "react-native-gesture-handler";
import "../global.css";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TextInput } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ReadingProvider } from "./context/ReadingContext";
import { StatsProvider } from "./context/StatsContext";
import RootStackNavigator from "./navigation/RootStack";
import "./i18n/i18n";
import { useUser } from "./hooks/useUser";
import { useSettings } from "./hooks/useSettings";
import { useStats } from "./hooks/useStats";
import AppShell from "./components/AppShell";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { useLoadFonts } from "./hooks/useLoadFonts";
import { initMonitoring } from "./utils/monitoring";

const AppContent = () => {
  const { isLoading: userLoading } = useUser();
  const { isLoading: settingsLoading } = useSettings();
  const { isLoading: statsLoading } = useStats();
  const { t } = useTranslation();

  if (userLoading || settingsLoading || statsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fdfaf3]">
        <Text className="text-base text-neutral-700">{t("app.loading")}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppShell>
        <RootStackNavigator />
      </AppShell>
    </NavigationContainer>
  );
};

// Root entry (see docs/02-architecture.md)
const App = () => {
  const { loaded: fontsLoaded } = useLoadFonts();
  const { t } = useTranslation();
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN || (Constants.expoConfig?.extra as { sentryDsn?: string })?.sentryDsn;

  // Initialize monitoring once; silently skip if DSN missing
  initMonitoring(sentryDsn);

  useEffect(() => {
    if (!fontsLoaded) return;

    const TextAny = Text as unknown as { defaultProps?: { style?: unknown } };
    const TextInputAny = TextInput as unknown as { defaultProps?: { style?: unknown } };

    TextAny.defaultProps = TextAny.defaultProps || {};
    TextInputAny.defaultProps = TextInputAny.defaultProps || {};

    const baseStyle = { fontFamily: "InterVariable", letterSpacing: 0.1 };
    TextAny.defaultProps.style = Array.isArray(TextAny.defaultProps.style)
      ? [...TextAny.defaultProps.style, baseStyle]
      : [TextAny.defaultProps.style, baseStyle].filter(Boolean);
    TextInputAny.defaultProps.style = Array.isArray(TextInputAny.defaultProps.style)
      ? [...TextInputAny.defaultProps.style, baseStyle]
      : [TextInputAny.defaultProps.style, baseStyle].filter(Boolean);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fdfaf3]">
        <Text className="text-base text-neutral-700">{t("app.loading")}</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <UserProvider>
          <StatsProvider>
            <ReadingProvider>
              <AppContent />
            </ReadingProvider>
          </StatsProvider>
        </UserProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
