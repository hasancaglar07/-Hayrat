import { NavigatorScreenParams } from "@react-navigation/native";
import { ReadingMode, Weekday } from "../data/types";

// Route param lists derived from docs/04-navigation-and-screens.md
export type OnboardingStackParamList = {
  Welcome: undefined;
  IntentSetup: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MissedDays: undefined;
};

export type ReadingStackParamList = {
  Reading: { dayId: Weekday; mode: ReadingMode; date?: string };
  ReadingSettingsModal: undefined;
};

export type RankingStackParamList = {
  Ranking: undefined;
  Profile: undefined;
};

export type InfoStackParamList = {
  Benefits: undefined;
  FAQ: undefined;
};

export type DonateStackParamList = {
  About: undefined;
  Donate: undefined;
  AppSettings: undefined;
  Benefits: undefined;
  FAQ: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ReadingStack: NavigatorScreenParams<ReadingStackParamList>;
  RankingStack: NavigatorScreenParams<RankingStackParamList>;
  DonateStack: NavigatorScreenParams<DonateStackParamList>;
};

export type RootStackParamList = {
  OnboardingStack: NavigatorScreenParams<OnboardingStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};
