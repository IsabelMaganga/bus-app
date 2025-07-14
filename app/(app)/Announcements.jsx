import React from 'react';
import { View, Text, FlatList } from 'react-native';

const mockAnnouncements = [
  {
    id: '1',
    title: 'Disccount Update',
    message: 'We are adding a disccount on Lake shore route of 10%',
    name: 'Sososo',
    date: '2025-07-08',
  },

];

const Announcements = () => {
  return (
    <View className="flex-1 bg-white p-4">


      <FlatList
        data={mockAnnouncements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-lg ">{item.name}</Text>
            <Text className="text-gray-600 mt-1">{item.message}</Text>
            <Text className="text-xs text-gray-400 mt-2">
              {new Date(item.date).toDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No announcements available.</Text>
        }
      />
    </View>
  );
};

export default Announcements;
