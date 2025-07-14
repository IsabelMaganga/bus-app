import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const booking = require('../../assets/images/sososo.png');
const SECONDARY_BLUE = '#1976D2';
const PRIMARY_BLUE = '#34BAEFFF';

export default function BookTicket() {
  const router = useRouter();
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [buttonScale] = useState(new Animated.Value(1));

  const handleBooking = async () => {
    if (!nextOfKinPhone || !paymentMethod) {
      Alert.alert('Missing Info', 'Please fill in all required fields including payment method.');
      return;
    }

    // Store booking data for seat selection
    const bookingData = {
      next_of_kin_phone: nextOfKinPhone,
      payment_method: paymentMethod,
    };

    try {
      await AsyncStorage.setItem('bookingData', JSON.stringify(bookingData));
      router.push('/SelectSeats');
    } catch (error) {
      Alert.alert('Error', 'Failed to save booking data. Please try again.');
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.splitContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Book Your Bus Ticket</Text>

          <FormInput
            icon="call-outline"
            placeholder="Next of Kin Phone"
            value={nextOfKinPhone}
            onChangeText={setNextOfKinPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'airtel' && styles.paymentMethodSelected
              ]}
              onPress={() => setPaymentMethod('airtel')}
            >
              <Text style={styles.paymentMethodText}>Airtel Money</Text>
              {paymentMethod === 'airtel' && (
                <Ionicons name="checkmark-circle" size={20} color="#34BAEFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'tnm' && styles.paymentMethodSelected
              ]}
              onPress={() => setPaymentMethod('tnm')}
            >
              <Text style={styles.paymentMethodText}>TNM Mpamba</Text>
              {paymentMethod === 'tnm' && (
                <Ionicons name="checkmark-circle" size={20} color="#34BAEFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'card' && styles.paymentMethodSelected
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.paymentMethodText}>Card</Text>
              {paymentMethod === 'card' && (
                <Ionicons name="checkmark-circle" size={20} color="#34BAEFFF" />
              )}
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleBooking}
              activeOpacity={0.9}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <LinearGradient
                colors={['#34BAEFFF', '#34BAEFFF']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Continue to Seat Selection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
}

function FormInput({ icon, placeholder, value, onChangeText, keyboardType = 'default' }) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#34BAEFFF" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        selectionColor="#34BAEFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E0E7FF',
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  splitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
    marginRight: 15,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 300,
    borderRadius: 25,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  companyName: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#248297FF',
    letterSpacing: 1,
    
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 7,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#34BAEFFF',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#34BAEFFF',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  iconContainer: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#1E293B',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: '48%',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#34BAEFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 18,
    shadowColor: '#34BAEFFFF',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  dateText: {
    fontSize: 17,
    color: '#1E293B',
    fontWeight: '600',
    marginLeft: 10,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 5,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34BAEFFF',
    marginBottom: 15,
    marginTop: 10,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    shadowColor: '#34BAEFFF',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  paymentMethodSelected: {
    borderColor: '#34BAEFFF',
    backgroundColor: '#E0F2FE',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
});
