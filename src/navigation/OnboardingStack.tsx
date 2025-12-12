import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "./types";
import WelcomeScreen from "../screens/Onboarding/WelcomeScreen";
import IntentSetupScreen from "../screens/Onboarding/IntentSetupScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

// Onboarding stack (see docs/04-navigation-and-screens.md)
const OnboardingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="IntentSetup" component={IntentSetupScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStackNavigator;
