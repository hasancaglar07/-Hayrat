import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import OnboardingStackNavigator from "./OnboardingStack";
import MainTabsNavigator from "./MainTabs";
import { useUser } from "../hooks/useUser";
import Constants from "expo-constants";

const isTruthy = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Root stack (see docs/04-navigation-and-screens.md)
const RootStackNavigator = () => {
  const { profile } = useUser();
  const forceOnboardingInDev =
    __DEV__ &&
    (isTruthy(process.env.EXPO_PUBLIC_FORCE_ONBOARDING ?? "false") ||
      isTruthy((Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.forceOnboardingInDev));
  const shouldShowOnboarding = forceOnboardingInDev || !profile?.onboardingCompleted;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={shouldShowOnboarding ? "OnboardingStack" : "MainTabs"}
    >
      <Stack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
