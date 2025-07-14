import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Input } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { router } from 'expo-router';

const BookBusSystem = () => {
    return(
        <View className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <ScrollView className="p-4">
                <TextInput className="text-2xl font-bold mb-4">Book a Bus Ticket</TextInput>
                <TextInput placeholder="Enter your destination" />
                <TextInput placeholder="Select date and time" />
                <TextInput placeholder="Number of passengers" keyboardType="numeric" />

                <TextInput placeholder="Select bus type" />
                <TextInput placeholder="Enter your budget" keyboardType="numeric" />
                <Input placeholder="Enter your contact details" />
                <Input placeholder="Any special requests" multiline numberOfLines={4} />

           
                <TouchableOpacity 
                    className="bg-blue-500 p-4 rounded-lg shadow-md mb-4"
                    onPress={() => router.push('/SearchBuses')}
                >
                    <TextInput className="text-white text-lg font-semibold">Search Buses</TextInput>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="bg-green-500 p-4 rounded-lg shadow-md"
                    onPress={() => router.push('/paying')}
                >
                    <TextInput className="text-white text-lg font-semibold">Proceed to Payment</TextInput>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
export default  BookBusSystem;
