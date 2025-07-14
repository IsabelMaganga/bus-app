import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking, Modal, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AirtelPayment() {
  const [phone, setPhone] = useState('');
  // Removed businessCode
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      const data = await AsyncStorage.getItem('bookingResult');
      if (data) {
        const parsedData = JSON.parse(data);
        setBookingData(parsedData);
        // Removed setBusinessCode(parsedData.payment.business_code || '123456');
        setPhone(parsedData.booking.passenger_phone);
      } else {
        Alert.alert('Error', 'No booking data found. Please start over.');
        router.push('/Book');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking data.');
      router.push('/Book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your Airtel phone number');
      return;
    }
    Alert.alert(
      'Make Payment',
      'Please use your phone to make the payment now using Airtel Money. Once you have completed the payment, tap OK to continue.',
      [
        {
          text: 'OK',
          onPress: () => setStep(2),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const sendSmsWithPin = async () => {
    setShowPinModal(false);
    if (!pin) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }
    // Create SMS message with payment instructions including PIN
    const smsMessage = `Bus Reservation Payment Instructions:\n\nBooking Reference: ${bookingData.booking.booking_reference}\nPassenger: ${bookingData.booking.passenger_name}\nRoute: ${bookingData.booking.from_location} → ${bookingData.booking.to_location}\nAmount: MWK ${bookingData.payment.amount?.toLocaleString()}\n\nTo complete payment:\n1. Dial *150# on your phone\n2. Select \"Send Money\"\n3. Enter business code: ${businessCode}\n4. Enter amount: MWK ${bookingData.payment.amount?.toLocaleString()}\n5. Enter your PIN: ${pin} to confirm\n\nThank you for using our service!`;
    try {
      const smsUrl = `sms:${phone}?body=${encodeURIComponent(smsMessage)}`;
      const supported = await Linking.canOpenURL(smsUrl);
      if (supported) {
        await Linking.openURL(smsUrl);
        Alert.alert(
          'SMS Sent!',
          'Payment instructions have been sent to your phone. Please check your SMS app and complete the payment.',
          [
            {
              text: 'OK',
              onPress: () => {
                setStep(2);
                setTimeout(() => setStep(3), 3000);
                setPin('');
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Payment Instructions',
          smsMessage,
          [
            {
              text: 'Copy Instructions',
              onPress: () => {
                setStep(2);
                setTimeout(() => setStep(3), 3000);
                setPin('');
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      Alert.alert(
        'Error',
        'Could not send SMS. Please note down the payment instructions manually.',
        [
          {
            text: 'OK',
            onPress: () => {
              setStep(2);
              setTimeout(() => setStep(3), 3000);
              setPin('');
            }
          }
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#629BD5FF" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!bookingData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No booking data found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.push('/Book')}>
          <Text style={styles.retryButtonText}>Start New Booking</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.formBox}>
          <Image source={require('../assets/images/airtel.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Airtel Payment</Text>

          {/* Booking Details */}
          {bookingData && (
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>Booking Details</Text>
              <Text style={styles.bookingText}>Reference: {bookingData.booking.booking_reference}</Text>
              <Text style={styles.bookingText}>Passenger: {bookingData.booking.passenger_name}</Text>
              <Text style={styles.bookingText}>Route: {bookingData.booking.from_location} → {bookingData.booking.to_location}</Text>
              <Text style={styles.bookingText}>Amount: MWK {bookingData.payment.amount?.toLocaleString()}</Text>
            </View>
          )}

          <Text style={styles.label}>Airtel Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 0991xxxxxx"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#629BD5FF" />
          <Text style={styles.info}>Sending payment instructions...</Text>
          <Text style={styles.info}>Please check your SMS app</Text>
        </View>
      )}

      {step === 3 && (
        <View style={styles.centered}>
          <Text style={styles.success}>Payment Instructions Sent!</Text>
          <Text style={styles.info}>Check your SMS for complete payment instructions.</Text>
          <Text style={styles.info}>Complete the payment to confirm your booking.</Text>

          <TouchableOpacity style={styles.button} onPress={() => {
            // Pass all booking credentials to /invoice
            const params = {
              name: bookingData.booking.passenger_name,
              phone: bookingData.booking.passenger_phone,
              nextOfKinPhone: bookingData.booking.next_of_kin_phone,
              paymentMethod: bookingData.booking.payment_method,
              from: bookingData.booking.from_location,
              to: bookingData.booking.to_location,
              travelDate: bookingData.booking.travel_date,
              seats: JSON.stringify(bookingData.booking.selected_seats),
              amount: bookingData.payment.amount,
              billNo: bookingData.booking.booking_reference,
              phonee: bookingData.booking.next_of_kin_phone,
              totalPassengers: bookingData.booking.selected_seats.length,
              date: bookingData.booking.travel_date,
              busName: bookingData.booking.bus_name || 'SOSOSO',
            };
            router.push({ pathname: '/invoice', params });
          }}>
            <Text style={styles.buttonText}>View Ticket</Text>
          </TouchableOpacity>
          
        </View>
      )}
      {showPinModal && (
        <Modal visible={showPinModal} transparent animationType="slide">
          <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor:'#fff', padding:20, borderRadius:10, width:300 }}>
              <Text style={{ fontWeight:'bold', fontSize:16, marginBottom:10 }}>Enter your PIN to continue:</Text>
              <TextInput
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                secureTextEntry
                style={{ borderBottomWidth:1, marginVertical:10, fontSize:18, letterSpacing:8, textAlign:'center' }}
                placeholder="PIN"
                maxLength={6}
              />
              <Button title="Continue" onPress={sendSmsWithPin} />
              <Button title="Cancel" color="#888" onPress={() => setShowPinModal(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Changed from black to white
    justifyContent: 'center',
    padding: 24,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#629BD5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#629BD5FF',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  label: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#629BD5FF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#E53935', // Red
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#b71c1c', // Darker red
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1.1,
  },
  info: {
    color: '#555',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  success: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090707FF',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090707FF',
    padding: 24,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#629BD5FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeft: 4,
    borderLeftColor: '#629BD5FF',
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#629BD5FF',
    marginBottom: 8,
  },
  bookingText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 45, // Make the image round
    borderWidth: 2,
    borderColor: '#E53935', // Optional: add a red border for style
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});