import React from "react";
import { Text, View, Image } from "react-native";
import { useStats } from "../hooks/useStats";
import { useTranslation } from "react-i18next";
import { colors } from "../theme/designTokens";

// Compact streak + points pill for top bar
const RankingTopBarWidget: React.FC = () => {
  const { stats } = useStats();
  const { t } = useTranslation();

  return (
    <View
      className="flex-row items-center rounded-full px-3 py-2"
      style={{ backgroundColor: "#e0f5e8", borderColor: "#cbe9d7", borderWidth: 1 }}
    >
      <View className="flex-row items-center gap-1">
        <Image source={require("../../assets/icons/custom/Animal_Crossing_Leaf_animal-crossing-leaf.png")} style={{ width: 16, height: 16, tintColor: colors.accent }} />
        <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          {t("screen.home.stats.streak", { days: stats.currentStreakDays })}
        </Text>
      </View>
      <View className="mx-2 h-4 w-px bg-[#c9e9d5]" />
      <View className="flex-row items-center gap-1">
        <Image source={require("../../assets/icons/custom/Star_star.png")} style={{ width: 16, height: 16, tintColor: colors.accent }} />
        <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          {t("screen.home.stats.points", { points: stats.totalPoints })}
        </Text>
      </View>
    </View>
  );
};

export default RankingTopBarWidget;
