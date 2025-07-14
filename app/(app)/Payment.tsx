
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');

  const handlePayment = () => {
    if (!cardNumber) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

   
    Alert.alert('Payment Successful', 'Your booking has been confirmed!');
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center mb-8">Payment Details</Text>

      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Card Number</Text>
        <TextInput
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          maxLength={16}
          placeholder="1234 5678 9012 3456"
          className="border border-gray-300 rounded px-4 py-3 text-base"
        />
      </View>

     

      <TouchableOpacity
        onPress={handlePayment}
        className="bg-blue-400 py-4 rounded-lg mt-6 items-center"
      >
        <Text className="text-white text-base font-semibold">Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
