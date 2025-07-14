import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const profile = () => {
  const user = {
    name: 'Mary Johnson',
    email: 'mary.j@example.com',
    phone: '+1 (555) 123-4567',
    membership: 'Gold Member',
    points: 1250,
    tripsCompleted: 24,
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-blue-600 p-5 pb-8">
        <Text className="text-white text-2xl font-bold">My Profile</Text>
      </View>

      {/* Profile Card */}
      <View className="bg-white mx-5 p-5 rounded-xl shadow-sm -mt-6 z-10"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <View className="items-center mb-4">
          <View className="bg-blue-100 p-3 rounded-full mb-3">
            <Text className="text-blue-600 text-3xl">👩</Text>
          </View>
          <Text className="text-xl font-bold">{user.name}</Text>
          <Text className="text-gray-500">{user.membership}</Text>
        </View>

        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">{user.tripsCompleted}</Text>
            <Text className="text-gray-500">Trips</Text>
          </View>
        </View>
      </View>

      {/* Account Details */}
      <ScrollView className="mt-4 px-5 pb-5">
        <Text className="text-lg font-bold mb-3">Account Information</Text>
        
        <ProfileInfoItem icon="✉️" label="Email" value={user.email} />
        <ProfileInfoItem icon="📱" label="Phone" value={user.phone} />


        <Text className="text-lg font-bold mt-6 mb-3">Settings</Text>
        
        <ProfileAction icon="🔒" label="Change Password" />
        <ProfileAction icon="❓" label="Help Center" />

        <TouchableOpacity className="bg-red-50 p-4 rounded-lg mt-6 border border-red-100">
          <Text className="text-red-500 font-bold text-center">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const ProfileInfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="flex-row items-center py-3 border-b border-gray-100">
    <Text className="text-2xl mr-3">{icon}</Text>
    <View className="flex-1">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-gray-800">{value}</Text>
    </View>
  </View>
);


const ProfileAction = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
    <Text className="text-2xl mr-3">{icon}</Text>
    <Text className="flex-1 text-gray-800">{label}</Text>
    <Text className="text-gray-400">›</Text>
  </TouchableOpacity>
);

export default profile;