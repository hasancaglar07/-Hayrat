import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RankingTopBarWidget from "./RankingTopBarWidget";
import { useTranslation } from "react-i18next";
import { colors } from "../theme/designTokens";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
  showRankingWidget?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

// Minimal header using NativeWind classes
const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack,
  rightContent,
  showRankingWidget = true,
  backgroundColor,
  borderColor,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerBg = backgroundColor || colors.background;
  const headerBorder = borderColor || colors.borderMuted;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: headerBg }}>
      <View
        className="flex-row items-center justify-between border-b"
        style={{
          borderColor: headerBorder,
          backgroundColor: headerBg,
          paddingTop: Math.max(insets.top ? 10 : 6, 10),
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <View className="flex-row items-center gap-3">
          {showBack ? (
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityLabel={t("action.back")}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.card, borderColor: colors.borderMuted, borderWidth: 1, shadowColor: colors.shadow, shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </Pressable>
          ) : (
            <View className="w-10 h-10" />
          )}
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {title || ""}
          </Text>
        </View>
        <View style={{ minWidth: 44, alignItems: "flex-end" }}>
          {showRankingWidget ? (
            rightContent ?? <RankingTopBarWidget />
          ) : rightContent ? (
            rightContent
          ) : (
            <View className="w-10 h-10" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;
