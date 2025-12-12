import React from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";

interface SettingsItemProps {
  label: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  description?: string;
  iconSource?: any;
}

// Generic settings row (see docs/04-navigation-and-screens.md)
const SettingsItem: React.FC<SettingsItemProps> = ({ label, onPress, hasSwitch, value, onToggle, description, iconSource }) => {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label}>
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-3 flex-1">
          {iconSource ? <Image source={iconSource} style={{ width: 18, height: 18 }} /> : null}
          <View className="flex-1">
            <Text className="text-base font-semibold text-[#1f1a14]">{label}</Text>
            {description ? <Text className="text-sm text-[#6b6052] mt-0.5">{description}</Text> : null}
          </View>
        </View>
        {hasSwitch ? (
          <Switch value={!!value} onValueChange={onToggle} trackColor={{ false: "#d4d4d4", true: "#2fb061" }} thumbColor="#ffffff" />
        ) : (
          <Text className="text-lg text-[#6b6052]">{">"}</Text>
        )}
      </View>
    </Pressable>
  );
};

export default SettingsItem;
