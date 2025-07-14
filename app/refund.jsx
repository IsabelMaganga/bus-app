import { Text, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';
import sososo from '../assets/images/sososo.png';

export default function Refund() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={sososo} style={styles.bannerImage} />
      <Text style={styles.title}>SOSOSO Bus Company Refund Policy</Text>
      <Text style={styles.subtitle}>
        All tickets booked are valid for up to one (1) month from the date of purchase
      </Text>
      <Text style={styles.sectionTitle}>Refund & Rescheduling Policy</Text>
      <Text style={styles.text}>
        1. Customers can reschedule their trip free of charge if the request is made within one hour of booking.{"\n\n"}
        2. If the rescheduling request is made after one hour, a 25% rescheduling fee will be deducted from the original ticket fare.{"\n\n"}
        3. If a customer requests a refund, 25% of the original ticket fare will be deducted as a cancellation fee.{"\n\n"}
        4. Refunds must be requested within the ticket validity period.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0, 
    backgroundColor: '#f5f6fa',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginBottom: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002147',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    lineHeight: 22,
    paddingHorizontal: 24,
  },
});