import { TouchableOpacity } from "react-native";
import React from "react";
import { View, Text } from "react-native";

interface RouteCardProps {
  from: string;
  to: string;
  price: string;
  duration: string;
  onPress?: () => void;
  onBookPress?: () => void;
}

const RouteCard = ({
  from,
  to,
  price,
  duration,

}: RouteCardProps) => {
  return (
    <TouchableOpacity
      className="bg-white mr-4 p-4 rounded-lg w-64"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    
    >
      <Text className="font-bold text-gray-800">{from} to {to}</Text>
      <View className="flex-row justify-between mt-4">
        <View>
          <Text className="text-gray-500">Price</Text>
          <Text className="font-bold text-blue-600">{price}</Text>
        </View>
        <View>
          <Text className="text-gray-500">Duration</Text>
          <Text className="font-bold text-gray-800">{duration}</Text>
        </View>
      </View>
     
    </TouchableOpacity>
  );
};

export default RouteCard;