import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Importing the image for the landing screen
const landingImage = require('../assets/images/bel.png');

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Image source={landingImage} style={styles.image} />
      
      <Text style={styles.title}>Welcome to Bus Reservation</Text>
      <Text style={styles.subtitle}>
        Book your bus tickets easily and travel with comfort. Get started now!
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/sign-in')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: 'cover',
    borderRadius: 130,
    marginBottom: 32,
    borderWidth: 4,
    borderColor: '#2D5BA5FF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#444',
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#2D5BA5FF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
}); 