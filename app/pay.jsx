import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import mpamba from '../assets/images/mpamba.png';
import airtel from '../assets/images/airtel.png';
import card from '../assets/images/card.png';

const { width } = Dimensions.get('window');

export default function Payment() {
  const [selected, setSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const images = [mpamba, airtel, card];

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const animate = () => {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted) return;
        setCurrentIndex(prev => (prev + 1) % images.length);
        slideAnim.setValue(width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          if (!isMounted) return;
          timeoutId = setTimeout(animate, 2000);
        });
      });
    };

    slideAnim.setValue(0);
    timeoutId = setTimeout(animate, 2000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      slideAnim.stopAnimation();
    };
  }, [images.length, slideAnim]);

  const paymentOptions = [
    { key: 'mpamba', label: 'Mpamba' },
    { key: 'airtel', label: 'Airtel Money' },
    { key: 'credit', label: 'Credit Card' },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.View style={[styles.animatedImage, { transform: [{ translateX: slideAnim }] }]}>
          <Image source={images[currentIndex]} style={styles.image} />
        </Animated.View>
      </View>
      <Text style={styles.title}>Choose Payment Method</Text>

      <View style={styles.optionsBox}>
        {paymentOptions.map(option => (
          <TouchableOpacity key={option.key}style={[ styles.optionRow,selected === option.key && styles.selectedOptionRow
            ]}onPress={() => setSelected(option.key)}activeOpacity={0.8} >

            <Ionicons
              name={selected === option.key ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selected === option.key ? '#1976D2' : '#aaa'}
              style={styles.radioIcon}
            />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selected && { backgroundColor: '#ccc' }
        ]}
        disabled={!selected}
        onPress={() => {
          if (selected === 'mpamba') {
            router.push('/mpamba');
          } else if (selected === 'airtel') {
            router.push('/airtel');
          } else if (selected === 'credit') {
            router.push('/paying');
          }
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'flex-start',
    width: '100%',
  },
  sliderContainer: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    marginBottom: 28,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  animatedImage: {
    position: 'absolute',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#072A4EFF',
    marginBottom: 18,
    textAlign: 'center',
  },
  optionsBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#629BD5FF',
    marginBottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  selectedOptionRow: {
    backgroundColor: '#e3f2fd',
  },
  radioIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#232526FF',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#629BD5FF',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});