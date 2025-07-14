import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const booking = require('../../assets/images/post.png');

const screenWidth = Dimensions.get('window').width;

export default function BookTicket() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');
  const [buttonScale] = useState(new Animated.Value(1));

  const handleBooking = () => {
    if (!from || !to || !name || !nextOfKinPhone) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    router.push('/SelectSeats');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
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
      <Text style={styles.companyTitle}>Post Coach Bus Company</Text>
      <Text style={styles.subtitle}>Fast, easy, and secure bus ticket booking</Text>
      <View style={styles.smartCard}>
        <View style={styles.formRow}>
          {/* Form section */}
          <View style={styles.formSection}>
            <Text style={styles.title}>Book Your Bus Ticket</Text>
            <FormInput
              icon="person-outline"
              placeholder="Passenger Full Name"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.row}>
              <View style={styles.col}>
                <FormInput
                  icon="location-outline"
                  placeholder="From"
                  value={from}
                  onChangeText={setFrom}
                />
              </View>
              <View style={styles.col}>
                <FormInput
                  icon="location-outline"
                  placeholder="To"
                  value={to}
                  onChangeText={setTo}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={SECONDARY_BLUE}
                style={styles.inputIcon}
              />
              <Text style={styles.dateTextBox}>
                {date.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={SECONDARY_BLUE}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={{ backgroundColor: 'white' }}
              />
            )}
            <FormInput
              icon="call-outline"
              placeholder="Next of Kin Phone"
              value={nextOfKinPhone}
              onChangeText={setNextOfKinPhone}
              keyboardType="phone-pad"
            />
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleBooking}
                activeOpacity={0.9}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
              >
                <LinearGradient
                  colors={[ PRIMARY_BLUE, SECONDARY_BLUE ]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>Continue to Seat Selection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
          {/* Divider for large screens */}
          <View style={styles.smartDivider} />
          {/* Image section */}
          <View style={styles.smartImageSection}>
            <Image source={booking} style={styles.smartBannerImage} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function FormInput({ icon, placeholder, value, onChangeText, keyboardType = 'default' }) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#D86F5AFF" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        selectionColor="#D86F5AFF"
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
    color: '#D86F5AFF',
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
    color: '#D86F5AFF',
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
    shadowColor: '#D86F5AFF',
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
    borderColor: '#D86F5AFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 18,
    shadowColor: '#D86F5AFF',
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
});
