import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TripCardProps {
  date: string;
  time: string;
  from: string;
  to: string;
  seats: string;
  onDetailsPress?: () => void;
  onViewTicketPress?: () => void;
}

const TripCard = ({
  date,
  time,
  from,
  to,
  seats,
  onDetailsPress,
  onViewTicketPress,
}: TripCardProps) => {
  return (
    <View 
      className="bg-white p-4 rounded-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Text className="text-gray-500">{date}</Text>
      <View className="flex-row items-center mt-2">
        <View className="bg-blue-100 p-2 rounded-full mr-3">
          <Text className="text-blue-600">🚌</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-800">{time}</Text>
          <Text className="text-gray-800">{from} to {to}</Text>
        </View>
        <Text className="text-gray-500">{seats}</Text>
      </View>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity 
          className="border border-gray-300 py-2 px-4 rounded-full"
          onPress={onDetailsPress}
        >
          <Text className="text-gray-800">Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-blue-600 py-2 px-4 rounded-full"
          onPress={onViewTicketPress}
        >
          <Text className="text-white">View Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripCard;