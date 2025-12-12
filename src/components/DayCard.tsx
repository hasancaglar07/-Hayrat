import React from "react";
import { Pressable, Text, View, Image } from "react-native";
import { Weekday } from "../data/types";
import { useTranslation } from "react-i18next";
import { colors, radii } from "../theme/designTokens";

interface DayCardProps {
  weekday: Weekday;
  status?: "completed" | "missed" | "pending" | "today" | "upcoming" | "makeup";
  isToday?: boolean;
  isFuture?: boolean;
  onPress?: () => void;
}

// Day card styled to mirror the weekly overview mock (pill shape, status colors)
const DayCard: React.FC<DayCardProps> = ({ weekday, status = "pending", onPress, isToday, isFuture }) => {
  const { t } = useTranslation();
  const statusKey = status === "pending" && isFuture ? "upcoming" : status;
  const statusLabel = t(`component.dayCard.status.${statusKey}`, { defaultValue: t("component.dayCard.status.pending") });
  const dayLabel = t(`weekday.${weekday}`);
  const helperText = t(`component.dayCard.helper.${statusKey}`, { defaultValue: t("screen.home.subtitle") });

  const statusPalette: Record<
    string,
    { border: string; bg: string; chipBg: string; chipText: string; icon: any; helperColor: string; iconBg: string }
  > = {
    completed: {
      border: "#d6e8dc",
      bg: "#f7fbf8",
      chipBg: "#e0efe5",
      chipText: colors.accentDark,
      icon: require("../../assets/icons/custom/Checkmark_checkmark.png"),
      helperColor: colors.accentDark,
      iconBg: "#eaf4ed",
    },
    makeup: {
      border: colors.accent,
      bg: colors.accentSoft,
      chipBg: colors.accent,
      chipText: "#ffffff",
      icon: require("../../assets/icons/custom/Bookmark_bookmark.png"),
      helperColor: colors.accentDark,
      iconBg: colors.accentSoft,
    },
    missed: {
      border: colors.warningBorder,
      bg: colors.warningSoft,
      chipBg: colors.warningBorder,
      chipText: "#c26d20",
      icon: require("../../assets/icons/custom/Alert_alert.png"),
      helperColor: "#c26d20",
      iconBg: "#fff0df",
    },
    today: {
      border: colors.accent,
      bg: "#cfece0",
      chipBg: colors.accent,
      chipText: "#fff",
      icon: require("../../assets/icons/custom/Target_target.png"),
      helperColor: colors.accentDark,
      iconBg: colors.accentSoft,
    },
    upcoming: {
      border: "#e8ecea",
      bg: "#f7f9f8",
      chipBg: "#e8ecea",
      chipText: colors.textSecondary,
      icon: require("../../assets/icons/custom/Calendar_calendar.png"),
      helperColor: colors.textSecondary,
      iconBg: "#eef1ef",
    },
    pending: {
      border: "#e8ecea",
      bg: "#f7f9f8",
      chipBg: "#e8ecea",
      chipText: colors.textSecondary,
      icon: require("../../assets/icons/custom/Calendar_calendar.png"),
      helperColor: colors.textSecondary,
      iconBg: "#eef1ef",
    },
  };

  const palette = statusPalette[statusKey] || statusPalette.pending;

  return (
    <Pressable onPress={onPress} accessibilityLabel={dayLabel} style={{ opacity: isFuture && statusKey === "upcoming" ? 0.7 : 1 }}>
      <View
        className="flex-row items-center gap-4 p-4"
        style={{
          backgroundColor: palette.bg,
          borderRadius: radii.lg + 6,
          borderWidth: statusKey === "today" ? 2 : 1,
          borderColor: palette.border,
          shadowColor: "#000",
          shadowOpacity: statusKey === "today" ? 0.08 : 0.02,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        }}
      >
        <View className="h-12 w-12 rounded-xl items-center justify-center" style={{ backgroundColor: palette.iconBg }}>
          <Image source={palette.icon} style={{ width: 22, height: 22, tintColor: statusKey === "makeup" ? colors.accentDark : colors.textPrimary }} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }} numberOfLines={1}>
            {dayLabel}
          </Text>
          <Text className="text-base" style={{ color: palette.helperColor, lineHeight: 22 }}>
            {statusKey === "today" ? t("screen.home.todayLabel") : helperText}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: palette.chipBg }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: palette.chipText }}
            >
              {statusLabel}
            </Text>
          </View>
          <Image source={require("../../assets/icons/custom/Arrow_Down_arrow-down.png")} style={{ width: 14, height: 14, tintColor: colors.textSecondary, transform: [{ rotate: "-90deg" }] }} />
        </View>
      </View>
    </Pressable>
  );
};

export default DayCard;
