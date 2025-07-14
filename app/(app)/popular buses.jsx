import React from 'react';
import { View, Text, ScrollView, StyleSheet,Image, TouchableOpacity } from 'react-native';
import sososo from '../../assets/images/sososo.png'; 
import post from '../../assets/images/post.png'; 
import cap from '../../assets/images/cap.png';
import { useRouter } from 'expo-router';

const PopularBuses = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
              <Image source={sososo} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.busName}>SOSOSO</Text>
                <Text style={styles.route}>Mzuzu to Lilongwe</Text>
                <Text style={styles.price}>MWK50,000 Only</Text>
                <View style={styles.cardDivider} />
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/Book')}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>

             <View style={styles.card}>
              <Image source={post} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.busName}>Post coach</Text>
                <Text style={styles.route}>Mzuzu to Lilongwe</Text>
                <Text style={styles.price}>MWK48,000 Only</Text>
                <View style={styles.cardDivider} />
                <TouchableOpacity style={styles.bookButton} onPress={(bookButton) => router.push('/book')}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>

             <View style={styles.card}>
              <Image source={cap} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.busName}>Captain Tours</Text>
                <Text style={styles.route}>Mzuzu to Lilongwe</Text>
                <Text style={styles.price}>MWK60,000 Only</Text>
                <View style={styles.cardDivider} />
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E3E3FF',
  },
 card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom:15,
    marginTop: 10,
    elevation: 25,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  route: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: '#e67e22',
    marginBottom: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  bookButton: {
    backgroundColor: '#e67e22',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginRight: 8,
    

  }
});

export default PopularBuses;

