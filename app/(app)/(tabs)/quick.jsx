
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from "expo-router";




export default function Index() {

  return (

          <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>

              <View className="items-center mt-16 mb-8">
                <Text className="text-2xl font-bold text-gray-800">Bus Reservation</Text>
                <Text className="text-lg text-gray-600 text-center mt-4 px-8">
                 
                </Text>
              </View>

 
              <View className="flex-row flex-wrap justify-center px-4">
                <View className="w-1/2 p-2">
                  <View className="bg-gray-100 rounded-xl p-6 items-center h-40 justify-center">
                    <Text className="text-lg font-semibold text-gray-800 mb-2 text-center"> Search & Book Buses</Text>
                  </View>
                </View>
                
                <View className="w-1/2 p-2">
                  <View className="bg-gray-100 rounded-xl p-6 items-center h-40 justify-center">
                    <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">View available seats</Text>
                  </View>
                </View>
                
                <View className="w-1/2 p-2">
                  <View className="bg-gray-100 rounded-xl p-6 items-center h-40 justify-center">
                    <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">View booking history</Text>
                  </View>
                </View>
                

                <View className="w-1/2 p-2">
                  <View className="bg-gray-100 rounded-xl p-6 items-center h-40 justify-center">
                    <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">Make Complaints</Text>
                  </View>
                </View>
              </View>


              <View className="mt-12 px-8">
                <TouchableOpacity 
                  className="border border-blue-400 py-4 rounded-xl items-center mb-4"
                  onPress={()=> router.push('/index')} 
                >
                  <Text className="text-blue-400 font-bold text-lg">Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="bg-blue-400 py-4 rounded-xl items-center" 
                  onPress={()=> router.push('/signup')} 
                >
                  <Text className="text-white font-bold text-lg">Create Account</Text>
                </TouchableOpacity>
                  
              </View>


              <Text className="text-center text-gray-500 mt-8">
                Book your tickets today 
              </Text>
            </ScrollView>
          </View>
        );
 }
 

