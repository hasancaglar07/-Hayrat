import React from "react";
import { Pressable, Text } from "react-native";
import { colors, radii } from "../theme/designTokens";

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

// Primary action button with NativeWind classes
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, disabled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className="items-center justify-center"
    style={{
      minHeight: 56,
      paddingHorizontal: 18,
      backgroundColor: colors.accent,
      borderRadius: radii.pill,
      shadowColor: colors.accent,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      opacity: disabled ? 0.65 : 1,
    }}
  >
    <Text className="text-white text-lg font-semibold tracking-[0.01em]">{title}</Text>
  </Pressable>
);

export default PrimaryButton;
