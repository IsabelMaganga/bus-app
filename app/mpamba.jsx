import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Image, 
  ScrollView,
  Linking,
  Modal,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/context/AuthContext';

export default function MpambaPayment() {
  const { user } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [step, setStep] = useState(1);
  const [buttonScale] = useState(new Animated.Value(1));
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
      Alert.alert('Error', 'Please enter your Mpamba phone number');
      return;
    }
    Alert.alert(
      'Make Payment',
      'Please use your phone to make the payment now using Mpamba. Once you have completed the payment, tap OK to continue.',
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
    const smsMessage = `Bus Reservation Payment Instructions:\n\nBooking Reference: ${bookingData.booking.booking_reference}\nPassenger: ${bookingData.booking.passenger_name}\nRoute: ${bookingData.booking.from_location} → ${bookingData.booking.to_location}\nAmount: MWK ${bookingData.payment.amount?.toLocaleString()}\n\nTo complete payment:\n1. Dial *444# on your phone\n2. Select \"Send Money\"\n3. Enter amount: MWK ${bookingData.payment.amount?.toLocaleString()}\n4. Enter your PIN: ${pin} to confirm\n\nThank you for using our service!`;
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

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#318D54FF" />
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
      {step === 1 && (
        <View style={styles.formBox}>
          <Image
            source={require('../assets/images/mpamba.png')} 
            style={styles.logo}
          />

          <Text style={styles.title}>Mpamba Payment</Text>

          {/* Booking Details */}
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>Booking Details</Text>
            <View style={styles.bookingRow}>
              <Ionicons name="document-text" size={16} color="#318D54FF" />
              <Text style={styles.bookingLabel}>Reference:</Text>
              <Text style={styles.bookingValue}>{bookingData.booking.booking_reference}</Text>
            </View>
            <View style={styles.bookingRow}>
              <Ionicons name="person" size={16} color="#318D54FF" />
              <Text style={styles.bookingLabel}>Passenger:</Text>
              <Text style={styles.bookingValue}>{user?.name || bookingData.booking.passenger_name}</Text>
            </View>
            <View style={styles.bookingRow}>
              <Ionicons name="location" size={16} color="#318D54FF" />
              <Text style={styles.bookingLabel}>Route:</Text>
              <Text style={styles.bookingValue}>
                {bookingData.booking.from_location} → {bookingData.booking.to_location}
              </Text>
            </View>
            <View style={styles.bookingRow}>
              <Ionicons name="cash" size={16} color="#318D54FF" />
              <Text style={styles.bookingLabel}>Amount:</Text>
              <Text style={styles.bookingValue}>MWK {bookingData.payment.amount?.toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.label}>Mpamba Phone Number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
              style={[styles.input, { flex: 1 }]}
            placeholder="e.g. 0881xxxxxx"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#bbb"
              editable={isEditingPhone}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => setIsEditingPhone((prev) => !prev)}
            >
              <Text style={{ color: '#318D54FF', fontWeight: 'bold' }}>
                {isEditingPhone ? 'Save' : 'Change'}
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              activeOpacity={0.9}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.centered}>
          <Text style={styles.success}>Payment Prompted!</Text>
          <Text style={styles.info}>If you have completed your payment, you can proceed to view your ticket.</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              // Pass all booking credentials to /invoice
              const params = {
                name: user?.name || bookingData.booking.passenger_name,
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
            }}
          >
            <Text style={styles.viewButtonText}>View Ticket</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.centered}>
          <Text style={styles.success}>Payment Instructions Sent!</Text>
          <Text style={styles.info}>
            Check your SMS for complete payment instructions.
          </Text>
          <Text style={styles.info}>Complete the payment to confirm your booking.</Text>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
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
            }}
          >
            <Text style={styles.viewButtonText}>View Ticket</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff9f0',
    justifyContent: 'center',
    padding: 24,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#22201FFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFFFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#318D54FF',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fef6e4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A4632FF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#444',
    shadowColor: '#FFFFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: '#318D54FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#d96a0a',
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
    fontSize: 17,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  success: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 20,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  viewButton: {
    marginTop: 28,
    backgroundColor: '#e67e22',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#d96a0a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff9f0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff9f0',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#318D54FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#318D54FF',
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#318D54FF',
    marginBottom: 12,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  bookingValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  instructionsBox: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#318D54FF',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#318D54FF',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
});
