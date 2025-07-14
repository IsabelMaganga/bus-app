import { TouchableOpacity } from "react-native";
import React from "react";
import { View, Text } from "react-native";

interface ActionCardProps {
  icon: string;
  title: string;
  desc: string;
  onPress?: () => void;
}

const ActionCard = ({
  icon,
  title,
  desc,
  onPress,
}: ActionCardProps) => {
  return (
    <TouchableOpacity
      className="w-[48%] bg-white p-4 rounded-lg mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
      onPress={onPress}
    >
      <Text className="text-3xl mb-3">{icon}</Text>
      <Text className="font-bold text-gray-800 text-base">{title}</Text>
      <Text className="text-gray-500 text-sm mt-1">{desc}</Text>
    </TouchableOpacity>
  );
};

export default ActionCard;