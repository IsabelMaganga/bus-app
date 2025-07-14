import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Invoice = () => {
  const data = useLocalSearchParams();
  const ticketRef = useRef();

  const busName = data?.busName || 'SOSOSO';
  const formattedDate = data?.date
    ? new Date(data.date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : 'N/A';

  const formattedSeats = data?.seats
    ? JSON.parse(data.seats).join(', ')
    : 'N/A';

  const handleDownload = async () => {
    try {
     
      const uri = await captureRef(ticketRef, {
        format: 'png',
        quality: 1,
      });
      const fileUri = FileSystem.documentDirectory + 'bus_ticket.png';
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: 'Download your bus ticket',
        UTI: 'public.png',
      });
    } catch (error) {
      Alert.alert('Download failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.ticketCard} ref={ticketRef}>
        <View style={styles.header}>
          <Text style={styles.busName}>{busName}</Text>
          <Text style={styles.ticketTitle}>🚌 Bus Ticket Invoice</Text>

          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Feather name="download" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.label}>📄 Bill No:</Text>
          <Text style={styles.value}>{data?.billNo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>👤 Passenger:</Text>
          <Text style={styles.value}>{data?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>📞 Phone:</Text>
          <Text style={styles.value}>{data?.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>📱 Alternate Phone:</Text>
          <Text style={styles.value}>{data?.phonee}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>👨‍👩‍👧 Next of Kin Phone:</Text>
          <Text style={styles.value}>{data?.nextOfKinPhone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>💳 Payment Method:</Text>
          <Text style={styles.value}>{data?.paymentMethod}</Text>
        </View>

        <View style={styles.dottedLine} />

        <View style={styles.section}>
          <Text style={styles.label}>📍 From:</Text>
          <Text style={styles.value}>{data?.from}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>🎯 To:</Text>
          <Text style={styles.value}>{data?.to}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>📅 Travel Date:</Text>
          <Text style={styles.value}>{data?.travelDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>💺 Seats:</Text>
          <Text style={styles.value}>{formattedSeats}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>👥 Total Passengers:</Text>
          <Text style={styles.value}>{data?.totalPassengers}</Text>
        </View>

        {/* TOTAL PRICE */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>MWK {data?.amount}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#f4f7fb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  ticketCard: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 700,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    backgroundColor: '#ff8c42',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  busName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  ticketTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
    letterSpacing: 1,
  },
  downloadBtn: {
    position: 'absolute',
    right: 15,
    top: 12,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#111',
    fontWeight: '500',
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 0.8,
    borderRadius: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  totalBox: {
    marginTop: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fdf2e9',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e67e22',
    marginTop: 4,
  },
});

export default Invoice;
