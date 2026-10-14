import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Platform } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ListingCard from '../../components/ListingCard';
import EmptyState from '../../components/EmptyState';
import { getListingsByOwner } from '../../services/listingService';
import { getRequestsByOwner } from '../../services/rentalService';
import { useAuth } from '../../context/AuthContext';
import { RENTAL_STATUS } from '../../constants/listing';

export default function DashboardScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isPullToRefresh = false) => {
      if (!isPullToRefresh) setLoading(true);
      try {
        const [listingData, requestData] = await Promise.all([
          getListingsByOwner(user.uid),
          getRequestsByOwner(user.uid),
        ]);
        setListings(listingData);
        setRequests(requestData);
      } catch (err) {
        setListings([]);
        setRequests([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user.uid]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ListingCard
        listing={item}
        onPress={() =>
          navigation.navigate('AddEditListing', { listingId: item.id })
        }
      />
    ),
    [navigation]
  );

  const pendingCount = requests.filter(
    (item) => item.status === RENTAL_STATUS.PENDING
  ).length;
  const activeCount = requests.filter(
    (item) => item.status === RENTAL_STATUS.ACCEPTED
  ).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0D9488']}
            tintColor="#0D9488"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.welcomeBanner}>
              <View>
                <Text style={styles.subGreeting}>Dashboard Pemilik</Text>
                <Text style={styles.greeting}>Halo, {user?.name || 'Mitra'}</Text>
              </View>
              <Button
                mode="contained"
                icon="plus"
                buttonColor="#0D9488"
                textColor="#FFFFFF"
                style={styles.addButton}
                onPress={() => navigation.navigate('AddEditListing')}
              >
                Tambah
              </Button>
            </View>

            {/* Statistics Cards */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' }]}>
                <MaterialCommunityIcons name="office-building" size={22} color="#0D9488" />
                <Text style={[styles.statValue, { color: '#0F766E' }]}>{listings.length}</Text>
                <Text style={styles.statLabel}>Total Hunian</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="clock-outline" size={22} color="#D97706" />
                <Text style={[styles.statValue, { color: '#B45309' }]}>{pendingCount}</Text>
                <Text style={styles.statLabel}>Menunggu</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={22} color="#16A34A" />
                <Text style={[styles.statValue, { color: '#15803D' }]}>{activeCount}</Text>
                <Text style={styles.statLabel}>Disetujui</Text>
              </View>
            </View>

            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>Daftar Hunian Saya</Text>
              <Text style={styles.countBadge}>{listings.length} Hunian</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <Text style={{ textAlign: 'center', paddingVertical: 32, color: '#64748B' }}>
              Memuat data hunian...
            </Text>
          ) : (
            <EmptyState
              icon="office-building-outline"
              title="Belum ada hunian terdaftar"
              subtitle="Unggah hunian pertama Anda untuk mulai menerima calon penyewa."
              actionLabel="Tambah Hunian Sekarang"
              onAction={() => navigation.navigate('AddEditListing')}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subGreeting: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  addButton: {
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  countBadge: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});