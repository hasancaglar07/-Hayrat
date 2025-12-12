import React from "react";
import { Image, Text, View } from "react-native";
import { LeaderboardEntry } from "../data/types";
import { colors } from "../theme/designTokens";

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  position: number;
}

// Leaderboard row (see docs/06-gamification-and-ranking.md)
const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ entry, position }) => {
  const avatar = entry.avatarSource || require("../../assets/icons/custom/Profile_Icon_profile-icon.png");
  const isMe = entry.userId === "me";
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
      style={{ backgroundColor: isMe ? colors.accent : "#f2f4f6", minHeight: 64 }}
    >
      <Text className="w-7 text-center text-sm font-semibold" style={{ color: isMe ? "#ffffff" : colors.textSecondary }}>
        {position}
      </Text>
      <View className="h-10 w-10 rounded-full bg-white items-center justify-center" style={{ overflow: "hidden" }}>
        <Image source={avatar} style={{ width: 40, height: 40, tintColor: isMe ? "#ffffff" : undefined }} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold" style={{ color: isMe ? "#ffffff" : colors.textPrimary }} numberOfLines={1}>
          {entry.nickname}
        </Text>
        <Text className="text-xs" style={{ color: isMe ? "#e7f7ec" : colors.textSecondary }}>
          🔥 {entry.currentStreakDays} · ⭐ {entry.totalPoints}
        </Text>
      </View>
    </View>
  );
};

export default LeaderboardItem;
