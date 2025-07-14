import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ActionCard from '../../../components/core/ActionCard';
import RouteCard from '../../../components/core/RouteCard';
import { router } from 'expo-router';

const BusReservationSystem = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <ActionCard
              title="Book a bus"
              desc="Find and book your next bus journey"
              icon="🚌"
              onPress={() => router.push('../SearchBuses')}
            />
            <ActionCard
              title="My Tickets"
              desc="View your upcoming and past trips"
              icon="🎫"
              onPress={() => router.push('/tickets')}
            />
            <ActionCard
              title="Announcement"
              desc="Check for updates and alerts"
              icon="🧰"
              onPress={() => router.push('/Announcements')}
            />
            <ActionCard
              title="Complaints"
              desc="Make a complaint or report an issue"
              icon="📞"
              onPress={() => router.push('/complaints')}
            />
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RouteCard from="Lilongwe" to="Mzuzu" price="mkw 50000" duration="5hr" />
            <RouteCard from="Blantyre" to="Zomba" price="mkw 30000" duration="2hr" />
            <RouteCard from="Mzuzu" to="Karonga" price="mkw 40000" duration="3hr" />
            <RouteCard from="Lilongwe" to="Zomba" price="mkw 60000" duration="4hr" />
          </ScrollView>

          <View style={styles.viewAllContainer}>
            <TouchableOpacity onPress={() => router.push('/all-bookings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

           <View style={styles.promoSection}>
                  <Text style={styles.promoTitle}>🎉 Promotions</Text>
                  <View style={styles.promoBox}>
                    <Text style={styles.promoText}>
                      Get <Text style={{fontWeight: 'bold', color: '#60a5fa'}}>10% OFF</Text> your first booking! Use code <Text style={{fontWeight: 'bold'}}>WELCOME10</Text> at checkout.
                    </Text>
                  </View>
                  </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Bus Reservation System</Text>
          </View>
        </View>
      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
  },
  header: {
    backgroundColor: '#60a5fa', // blue-400
    padding: 16,
    paddingTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  viewAllContainer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  viewAllText: {
    color: '#3b82f6', // blue-500
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280', // gray-600
    fontSize: 14,
    textAlign: 'center',
  },
  promoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 20,
    elevation: 25,
     
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center'
  },
  promoBox: {
    backgroundColor: '#f9f9f9',
    shadowColor:'black',
    borderRadius: 8,
     elevation: 25,
    padding: 12,
    
  },
  promoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  }
});

export default BusReservationSystem;
