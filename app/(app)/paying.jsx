import React from 'react';
import { View, Text,  ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ActionCard from '../../components/core/ActionCard';
import { router } from 'expo-router';

const HandlepaySystem = () => {
    return (
        <View className="flex-1 bg-gray-100">
            <StatusBar style="dark" />
            <ScrollView className="p-4">
                <Text className="text-2xl font-bold mb-4">Payment Options</Text>
                <ActionCard
                    title="Credit/Debit Card"
                    desc="Pay securely using your credit or debit card."
                    icon="💳"
                    onPress={() => router.push('/payment/card')}
                />
                <ActionCard
                    title="Mobile Money"
                    desc="Pay using your mobile money account."
                    icon="📱"
                    onPress={() => router.push('/payment/mobile')}
                />
                <ActionCard
                    title="Bank Transfer"
                    desc="Pay directly from your bank account."
                    icon="🏦"
                    onPress={() => router.push('/payment/bank')}
                />
            </ScrollView>
        </View>
    );
};
export default HandlepaySystem;