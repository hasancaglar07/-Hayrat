import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabParamList, HomeStackParamList, ReadingStackParamList, RankingStackParamList, DonateStackParamList } from "./types";
import HomeScreen from "../screens/Home/HomeScreen";
import MissedDaysScreen from "../screens/Home/MissedDaysScreen";
import ReadingScreen from "../screens/Reading/ReadingScreen";
import ReadingSettingsModal from "../screens/Reading/ReadingSettingsModal";
import RankingScreen from "../screens/Ranking/RankingScreen";
import ProfileScreen from "../screens/Ranking/ProfileScreen";
import BenefitsScreen from "../screens/Info/BenefitsScreen";
import FAQScreen from "../screens/Info/FAQScreen";
import AboutScreen from "../screens/More/AboutScreen";
import DonateScreen from "../screens/More/DonateScreen";
import AppSettingsScreen from "../screens/More/AppSettingsScreen";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/designTokens";

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ReadingStack = createNativeStackNavigator<ReadingStackParamList>();
const RankingStack = createNativeStackNavigator<RankingStackParamList>();
const DonateStack = createNativeStackNavigator<DonateStackParamList>();

// Stacks inside main tabs (see docs/04-navigation-and-screens.md)
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="MissedDays" component={MissedDaysScreen} />
  </HomeStack.Navigator>
);

const ReadingStackNavigator = () => (
  <ReadingStack.Navigator screenOptions={{ headerShown: false }}>
    <ReadingStack.Screen name="Reading" component={ReadingScreen} />
    <ReadingStack.Screen name="ReadingSettingsModal" component={ReadingSettingsModal} options={{ presentation: "modal" }} />
  </ReadingStack.Navigator>
);

const RankingStackNavigator = () => (
  <RankingStack.Navigator screenOptions={{ headerShown: false }}>
    <RankingStack.Screen name="Ranking" component={RankingScreen} />
    <RankingStack.Screen name="Profile" component={ProfileScreen} />
  </RankingStack.Navigator>
);

const DonateStackNavigator = () => (
  <DonateStack.Navigator screenOptions={{ headerShown: false }}>
    <DonateStack.Screen name="Donate" component={DonateScreen} />
    <DonateStack.Screen name="Benefits" component={BenefitsScreen} />
    <DonateStack.Screen name="FAQ" component={FAQScreen} />
    <DonateStack.Screen name="About" component={AboutScreen} />
    <DonateStack.Screen name="AppSettings" component={AppSettingsScreen} />
  </DonateStack.Navigator>
);

const MainTabsNavigator = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const iconMap: Record<string, any> = {
    HomeStack: require("../../assets/icons/custom/Home_home.png"),
    ReadingStack: require("../../assets/icons/custom/Book_book.png"),
    RankingStack: require("../../assets/icons/custom/Trophy_trophy.png"),
    DonateStack: require("../../assets/icons/custom/Heart_heart.png"),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const source = iconMap[route.name];
          return (
            <Image
              source={source}
              style={{ width: (size || 22) + 6, height: (size || 22) + 6, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.borderMuted,
          paddingTop: 4,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarItemStyle: { paddingVertical: 2 },
      })}
      initialRouteName="HomeStack"
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ tabBarLabel: t("screen.home.tabLabel") }} />
      <Tab.Screen name="ReadingStack" component={ReadingStackNavigator} options={{ tabBarLabel: t("screen.reading.tabLabel") }} />
      <Tab.Screen name="RankingStack" component={RankingStackNavigator} options={{ tabBarLabel: t("screen.ranking.tabLabel") }} />
      <Tab.Screen name="DonateStack" component={DonateStackNavigator} options={{ tabBarLabel: t("screen.donate.title") }} />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
