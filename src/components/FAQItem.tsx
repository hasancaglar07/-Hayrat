import React, { useState } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { colors } from "../theme/designTokens";

interface FAQItemProps {
  question: string;
  answer: string;
}

// Simple accordion item (see docs/04-navigation-and-screens.md)
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="py-4 border-b" style={{ borderColor: colors.borderMuted }}>
      <Pressable className="flex-row items-center justify-between" onPress={() => setOpen((prev) => !prev)}>
        <Text className="text-lg font-semibold flex-1 mr-3" style={{ color: colors.textPrimary, lineHeight: 26 }}>
          {question}
        </Text>
        <Image
          source={require("../../assets/icons/custom/Arrow_Down_arrow-down.png")}
          style={{ width: 18, height: 18, tintColor: colors.accent, transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
     </Pressable>
     {open ? (
        <Text className="text-base mt-3" style={{ color: colors.textSecondary, lineHeight: 24 }}>
          {answer}
        </Text>
      ) : null}
    </View>
  );
};

export default FAQItem;
