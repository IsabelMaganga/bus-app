import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const mockBuses = [
  { id: '1', name: 'Sososo', time: '07:00 AM', price: 40000, from: 'Mzuzu', to: 'Lilongwe', route: 'Zalewa' },
  { id: '1', name: 'Sososo', time: '07:00 AM', price: 60000, from: 'Mzuzu', to: 'Blantyre', route: 'Lake shore' },
  { id: '1', name: 'Sososo', time: '07:00 AM', price: 50000, from: 'Mzuzu', to: 'Dedza', route: 'Zalewa' },
  { id: '2', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Lilongwe', route: 'Lilongwe' },
  { id: '3', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Lilongwe', route: 'Zalewa' },
  { id: '4', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Blantyre', route: 'Lake shore' },
  { id: '5', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Lilongwe', to: 'Blantyre', route: 'Lilongwe' },
  { id: '6', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Mzuzu', route: 'Lilongwe' },
  { id: '7', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Dedza', route: 'Lilongwe' },
  { id: '8', name: 'Post Coach', time: '06:00 PM', price: 50000, from: 'Blantyre', to: 'Nsanje', route: 'Zalewa' },
  


  // Add more buses as needed
];

const SearchBuses = () => {
  const { origin, destination, date } = useLocalSearchParams();
  const router = useRouter();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);

  useEffect(() => {
    // Only show buses if both fields are filled
    if (!from.trim() || !to.trim()) {
      setFilteredBuses([]);
      return;
    }
    const fromValue = from.trim().toLowerCase();
    const toValue = to.trim().toLowerCase();
    setFilteredBuses(
      mockBuses.filter((bus) =>
        bus.from.trim().toLowerCase() === fromValue &&
        bus.to.trim().toLowerCase() === toValue
      )
    );
  }, [from, to]);

  const handleSelect = (bus) => {
    // Navigate based on bus name
    if (bus.name === 'Sososo') {
      router.push('/Book');
    } else if (bus.name === 'Post Coach') {
      router.push('/BookPost');
    } else {
      // fallback or default route
      router.push({
        pathname: '/Book',
        params: {
          busId: bus.id,
          origin,
          destination,
          date,
        },
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Departure: {item.time}</Text>
      <Text style={styles.details}>Route: {item.route}</Text>
      <Text style={styles.price}>Mkw {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Buses</Text>

      <TextInput
        placeholder="From (e.g. Mzuzu)"
        value={from}
        onChangeText={setFrom}
        style={styles.input}
      />
      <TextInput
        placeholder="To (e.g. Lilongwe)"
        value={to}
        onChangeText={setTo}
        style={styles.input}
      />

      <FlatList
        data={filteredBuses}
        keyExtractor={(item) => item.id + item.from + item.to + item.route}
        renderItem={renderItem}
        ListEmptyComponent={
          (from.trim() && to.trim()) ? (
            <Text style={styles.emptyText}>No buses found for the selected route.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#aaa',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});

export default SearchBuses;
