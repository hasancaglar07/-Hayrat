import React from "react";
import { Pressable, Text } from "react-native";
import { colors, radii } from "../theme/designTokens";

interface SecondaryButtonProps {
  title: string;
  onPress?: () => void;
}

// Outline-styled secondary action
const SecondaryButton: React.FC<SecondaryButtonProps> = ({ title, onPress }) => (
  <Pressable
    onPress={onPress}
    className="items-center justify-center"
    style={{
      minHeight: 56,
      paddingHorizontal: 18,
      borderRadius: radii.pill,
      borderColor: colors.accent,
      borderWidth: 1.5,
      backgroundColor: "#ffffff",
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    }}
  >
    <Text className="text-lg font-semibold tracking-[0.01em]" style={{ color: colors.accent }}>
      {title}
    </Text>
  </Pressable>
);

export default SecondaryButton;
