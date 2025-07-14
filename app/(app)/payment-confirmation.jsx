import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';

export default function PaymentConfirmation() {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      const data = await AsyncStorage.getItem('bookingResult');
      if (data) {
        setBookingData(JSON.parse(data));
      } else {
        Alert.alert('Error', 'No booking data found.');
        router.push('/Book');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking data.');
      router.push('/Book');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!bookingData?.payment?.reference) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${getApiUrl(API_ENDPOINTS.VERIFY_PAYMENT(bookingData.payment.reference))}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setPaymentStatus(result.data.status);
        if (result.data.status === 'success') {
          Alert.alert(
            'Payment Successful!',
            'Your booking has been confirmed. You will receive your ticket details shortly.',
            [
              {
                text: 'View Booking',
                onPress: () => router.push('/tickets'),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentInstructions = () => {
    if (!bookingData?.payment?.payment_method) return '';

    const instructions = {
      mpamba: `1. Dial *444# on your phone
2. Select "Send Money"
3. Enter business code: ${bookingData.payment.business_code || '123456'}
4. Enter amount: MWK ${bookingData.payment.amount?.toLocaleString()}
5. Enter your PIN to confirm`,
      airtel: `1. Dial *247# on your phone
2. Select "Send Money"
3. Enter business code: ${bookingData.payment.business_code || '789012'}
4. Enter amount: MWK ${bookingData.payment.amount?.toLocaleString()}
5. Enter your PIN to confirm`,
      tnm: `1. Dial *151# on your phone
2. Select "Send Money"
3. Enter business code: ${bookingData.payment.business_code || '345678'}
4. Enter amount: MWK ${bookingData.payment.amount?.toLocaleString()}
5. Enter your PIN to confirm`,
      card: 'You will be redirected to a secure payment page to complete your card payment.',
    };

    return instructions[bookingData.payment.payment_method] || '';
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      case 'pending':
      default:
        return '#F59E0B';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
      default:
        return 'Payment Pending';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34BAEFFF" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!bookingData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No booking data found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.push('/Book')}>
          <Text style={styles.retryButtonText}>Start New Booking</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Please complete your payment</Text>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="document-text" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Reference:</Text>
          <Text style={styles.detailValue}>{bookingData.booking.booking_reference}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Passenger:</Text>
          <Text style={styles.detailValue}>{bookingData.booking.passenger_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Route:</Text>
          <Text style={styles.detailValue}>
            {bookingData.booking.from_location} → {bookingData.booking.to_location}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{bookingData.booking.travel_date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="seat" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Seats:</Text>
          <Text style={styles.detailValue}>{bookingData.booking.selected_seats.join(', ')}</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="card" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{bookingData.payment.payment_method.toUpperCase()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>MWK {bookingData.payment.amount?.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color="#34BAEFFF" />
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
      </View>

      {/* Payment Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Instructions</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>{getPaymentInstructions()}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkPaymentStatus}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#34BAEFFF', '#34BAEFFF']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check Payment Status</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/tickets')}
        >
          <Text style={styles.secondaryButtonText}>View My Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#34BAEFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  checkButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
}); 