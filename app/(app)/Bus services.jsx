import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function ViewScreen() {
  const router = useRouter();
  return (
    <>
      <TouchableOpacity
        style={styles.refundBox}
        onPress={() => router.push('/refund')}
        activeOpacity={0.85}
      >
        <View style={styles.refundContent}>
          <Ionicons name="wallet-outline" size={32} color="#00796B" style={styles.refundIcon} />
          <Text style={styles.refundTitle}>Refund Policy</Text>
          <Text style={styles.refundText}>
            If your trip is cancelled or rescheduled, you are eligible for a full refund according to our policy.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={28} color="#748583FF" style={styles.chevron} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.supportBox}
        onPress={() => router.push('/support')}
        activeOpacity={0.85}
      >
        <View style={styles.supportContent}>
          <Ionicons name="headset-outline" size={32} color="#1976D2" style={styles.supportIcon} />
          <Text style={styles.supportTitle}>24/7 Support</Text>
          <Text style={styles.supportText}>
            Our customer support team is available 24/7 to assist you with your bookings and inquiries.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={28} color="#53687DFF" style={styles.chevron} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  refundBox: {
    backgroundColor: '#E0F2F1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refundContent: {
    flex: 1,
    alignItems: 'center',
  },
  refundIcon: {
    marginBottom: 8,
  },
  refundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 4,
  },
  refundText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  chevron: {
    marginLeft: 12,
  },
  supportBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportContent: {
    flex: 1,
    alignItems: 'center',
  },
  supportIcon: {
    marginBottom: 8,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  supportText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});