import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function CancelTicket() {
  const [ticketId, setTicketId] = useState('');

  const handleCancel = () => {
    if (!ticketId.trim()) {
      Alert.alert('⚠️ Error', 'Please enter your Ticket ID.');
      return;
    }

    Alert.alert(
      'Cancel Confirmation',
      `Are you sure you want to cancel ticket: ${ticketId}?`,
      [
        { text: 'No ❌' },
        {
          text: 'Yes ✅',
          onPress: () => {
            console.log(`Ticket ${ticketId} cancelled.`);
            Alert.alert('✅ Cancelled', `Ticket ${ticketId} has been cancelled.`);
            setTicketId('');
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>🎫 Cancel Ticket</Text>
        <Text style={styles.description}>Please enter your ticket ID below:</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Ticket ID"
          value={ticketId}
          onChangeText={setTicketId}
        />

        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}> Cancel Ticket</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6789E0FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
