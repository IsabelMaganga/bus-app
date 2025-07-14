import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { useSession } from '@/context/AuthContext';


const seatRows = [
  [{ id: '1A', booked: false }, { id: '1B', booked: true }, null, { id: '1C', booked: false }, { id: '1D', booked: false }],
  [{ id: '2A', booked: false }, { id: '2B', booked: false }, null, { id: '2C', booked: false }, { id: '2D', booked: true }],
  [{ id: '3A', booked: false }, { id: '3B', booked: false }, null, { id: '3C', booked: false }, { id: '3D', booked: false }],
  [{ id: '4A', booked: false }, { id: '4B', booked: false }, null, { id: '4C', booked: true }, { id: '4D', booked: false }],
  [{ id: '5A', booked: false }, { id: '5B', booked: false }, null, { id: '5C', booked: false }, { id: '5D', booked: false }],
];

const BusSeatSelectionScreen = () => {
  const { user } = useSession();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      const data = await AsyncStorage.getItem('bookingData');
      if (data) {
        setBookingData(JSON.parse(data));
      } else {
        Alert.alert('Error', 'No booking data found. Please start over.');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking data.');
      router.back();
    }
  };

  const handleSeatPress = (seatId, booked) => {
    if (booked) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    if (!bookingData) {
      Alert.alert('Error', 'Booking data not found. Please start over.');
      return;
    }

    setIsLoading(true);
    console.log('Starting booking process...');

    // Mock backend simulation for testing
    const useMockBackend = true; // Set to false when real backend is ready

    if (useMockBackend) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Create mock booking result
        const mockBookingResult = {
          booking: {
            id: Math.floor(Math.random() * 1000),
            booking_reference: 'BK-' + Math.random().toString(36).substr(2, 8).toUpperCase() + '-' + Date.now(),
            passenger_name: bookingData.passenger_name,
            from_location: bookingData.from_location,
            to_location: bookingData.to_location,
            travel_date: new Date(bookingData.travel_date).toLocaleDateString(),
            selected_seats: selectedSeats,
            total_amount: (selectedSeats.length * 5000).toString(),
            payment_method: bookingData.payment_method,
            status: 'pending'
          },
          payment: {
            id: Math.floor(Math.random() * 1000),
            reference: 'PAY-' + Math.random().toString(36).substr(2, 8).toUpperCase() + '-' + Date.now(),
            amount: (selectedSeats.length * 5000).toString(),
            currency: 'MWK',
            payment_url: null,
            checkout_url: null,
            business_code: Math.floor(Math.random() * 900000) + 100000 // Random 6-digit code
          }
        };

        // Store booking and payment info for payment screen
        await AsyncStorage.setItem('bookingResult', JSON.stringify(mockBookingResult));
        
        // Navigate directly to the appropriate payment input page
        const paymentMethod = bookingData.payment_method;
        console.log('Payment method:', paymentMethod);
        
        if (paymentMethod === 'mpamba' || paymentMethod === 'tnm') {
          router.push('/mpamba'); // Mpamba and TNM use the same flow
        } else if (paymentMethod === 'airtel') {
          router.push('/airtel');
        } else if (paymentMethod === 'card') {
          // For card payments, go to card payment input page
          router.push('/card-payment');
        } else {
          // Fallback to payment confirmation
          router.push('/payment-confirmation');
        }
      } catch (error) {
        console.error('Mock booking error:', error);
        Alert.alert('Error', 'Failed to create booking. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token ? 'Yes' : 'No');
      
      const bookingPayload = {
        ...bookingData,
        selected_seats: selectedSeats,
      };
      
      console.log('Booking payload:', bookingPayload);
      console.log('API URL:', getApiUrl(API_ENDPOINTS.BOOKINGS));

      const response = await fetch(getApiUrl(API_ENDPOINTS.BOOKINGS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        // Store booking and payment info for payment screen
        await AsyncStorage.setItem('bookingResult', JSON.stringify(result.data));
        
        // Navigate directly to the appropriate payment input page
        const paymentMethod = bookingData.payment_method;
        console.log('Payment method:', paymentMethod);
        
        if (paymentMethod === 'mpamba' || paymentMethod === 'tnm') {
          router.push('/mpamba'); // Mpamba and TNM use the same flow
        } else if (paymentMethod === 'airtel') {
          router.push('/airtel');
        } else if (paymentMethod === 'card') {
          // For card payments, go to card payment input page
          router.push('/card-payment');
        } else {
          // Fallback to payment confirmation
          router.push('/payment-confirmation');
        }
      } else {
        Alert.alert('Booking Failed', result.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', `Failed to create booking: ${error.message}. Please check your connection and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Seat</Text>
      {user && user.name && (
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>
            <Ionicons name="person" size={16} color="#34BAEFFF" /> {user.name}
          </Text>
        </View>
      )}
      {bookingData && (
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingText}>
            <Ionicons name="person" size={16} color="#34BAEFFF" /> {bookingData.passenger_name}
          </Text>
          <Text style={styles.bookingText}>
            <Ionicons name="location" size={16} color="#34BAEFFF" /> {bookingData.from_location} → {bookingData.to_location}
          </Text>
          <Text style={styles.bookingText}>
            <Ionicons name="calendar" size={16} color="#34BAEFFF" /> {new Date(bookingData.travel_date).toLocaleDateString()}
          </Text>
          <Text style={styles.bookingText}>
            <Ionicons name="card" size={16} color="#34BAEFFF" /> {bookingData.payment_method.toUpperCase()}
          </Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.seatMapContainer}
        showsVerticalScrollIndicator={false}
      >
        {seatRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.seatRow}>
            {row.map((seat, colIndex) =>
              seat === null ? (
                <View key={colIndex} style={styles.aisle} />
              ) : (
                <TouchableOpacity
                  key={seat.id}
                  disabled={seat.booked || isLoading}
                  style={[
                    styles.seat,
                    seat.booked
                      ? styles.booked
                      : selectedSeats.includes(seat.id)
                      ? styles.selected
                      : styles.available,
                  ]}
                  onPress={() => handleSeatPress(seat.id, seat.booked)}
                >
                  <Text style={styles.seatText}>{seat.id}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        ))}
      </ScrollView>

      {selectedSeats.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected: {selectedSeats.join(', ')} ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
          </Text>
          <Text style={styles.priceText}>
            Total: MWK {(selectedSeats.length * 5000).toLocaleString()}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]} 
        onPress={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirm Selection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  seatMapContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seat: {
    width: 48,
    height: 48,
    marginHorizontal: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  aisle: {
    width: 30,
    height: 48,
  },
  booked: {
    backgroundColor: '#999',
  },
  selected: {
    backgroundColor: '#EB975BFF',
  },
  available: {
    backgroundColor: '#5FBB81FF',
  },
  confirmButton: {
    backgroundColor: '#497BE6FF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  bookingInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34BAEFFF',
  },
  bookingText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '500',
  },
  selectionInfo: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34BAEFFF',
  },
  selectionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    color: '#34BAEFFF',
    fontWeight: '700',
  },
});

export default BusSeatSelectionScreen;
