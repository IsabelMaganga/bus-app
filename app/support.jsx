import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import support from '../assets/images/support.png';
import sososo from '../assets/images/sososo.png';
import post from '../assets/images/post.png';
import cap from '../assets/images/cap.png';

export default function Refund() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={support} style={styles.bannerImage} />

      
      <View style={styles.headerRow}>
        <Image source={sososo} style={styles.image} />
        <Text style={styles.cardTitle}>SOSOSO Support</Text>
      </View>

      <Text style={styles.subheading}>
        Need help with your SOSOSO journey? Our team is available 24/7 to assist you.
      </Text>

      <Text style={styles.sectionHeader}>For more information:</Text>
      <Text style={styles.contact}>Please contact us at:  +265 888 337 172 or </Text>
      <Text style={styles.contact}>                                    :  +265 994 193 745</Text>
      <Text style={styles.email}>
        Email us: <Link href="mailto:support@sososo.com">support@sososo.com</Link>
      </Text>

      
      <View style={styles.headerRow}>
        <Image source={post} style={styles.image} />
        <Text style={styles.cardTitle1}>POST COACH Support</Text>
      </View>

      <Text style={styles.subheading}>
        Here for You 24 Hours a Day, 7 Days a Week.
      </Text>

      <Text style={styles.sectionHeader}>For more information:</Text>
      <Text style={styles.contact}>Please contact us at:  +265 994 168 157 or</Text>
      <Text style={styles.contact}>                                    :  +265 994 168 158</Text>
      <Text style={styles.email}>
        Email us: <Link href="mailto:postcoaches@malawiposts.com">postcoaches@malawiposts.com</Link>
      </Text>

      <View style={styles.headerRow}>
        <Image source={cap} style={styles.image} />
        <Text style={styles.cardTitle2}>CAPTAIN TOURS Support</Text>
      </View>

      <Text style={styles.subheading}>
        Always Available, Always Reliable to assist you.
      </Text>

      <Text style={styles.sectionHeader}>For more information:</Text>
      <Text style={styles.contact}>Please contact us at:  +265 888 337 172 or</Text>
      <Text style={styles.contact}>                                    :  +265 999 251 812</Text>
      <Text style={styles.email}>
        Email us: <Link href="mailto:support@sososo.com">captaintours.com.free</Link>
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  bannerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 18,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D6FCDFF',
  },
  cardTitle1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DD1B1BFF',
  },
  subheading: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  contact: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  email: {
    fontSize: 14,
    color: '#1164BCFF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    textDecorationLine: 'underline',
  },
  cardTitle2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E804DFF',
  },
});
