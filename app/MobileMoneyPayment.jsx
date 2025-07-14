import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const logos = {
  airtel: require('../assets/images/airtel.png'),
  mpamba: require('../assets/images/mpamba.png'),
};

const titles = {
  airtel: 'Airtel Money Payment',
  mpamba: 'Mpamba Payment',
};

export default function MobileMoneyPayment() {
  const router = useRouter();
  const { method } = useLocalSearchParams(); // 'airtel' or 'mpamba'
  const [phone, setPhone] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

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
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    Alert.alert(
      'Make Payment',
      `Please use your phone to make the payment now using ${method === 'mpamba' ? 'Mpamba' : 'Airtel Money'}. Once you have completed the payment, tap OK to continue.`,
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

  if (isLoading || !bookingData) {
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logos[method]} style={styles.logo} />
      <Text style={styles.title}>{titles[method]}</Text>
      <Text style={styles.label}>Phone Number</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="e.g. 0991xxxxxx"
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
          <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>
            {isEditingPhone ? 'Save' : 'Change'}
          </Text>
        </TouchableOpacity>
      </View>
      {step === 1 && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: '100%', marginBottom: 20 },
  button: { backgroundColor: '#1976D2', padding: 16, borderRadius: 8, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  centered: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  success: { color: '#27ae60', fontWeight: 'bold', fontSize: 22, marginTop: 20, textAlign: 'center' },
  info: { color: '#555', fontSize: 17, marginTop: 24, textAlign: 'center', lineHeight: 24 },
  viewButton: { marginTop: 28, backgroundColor: '#e67e22', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 12, elevation: 4 },
  viewButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
}); 