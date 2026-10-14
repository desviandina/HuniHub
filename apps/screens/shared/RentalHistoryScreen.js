import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import { getRequestsBySeeker } from '../../services/rentalService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { RENTAL_STATUS } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

function StatusBadge({ status }) {
  if (status === RENTAL_STATUS.ACCEPTED) {
    return (
      <View style={[styles.badge, styles.badgeAccepted]}>
        <MaterialCommunityIcons name="check-circle" size={13} color="#16A34A" />
        <Text style={[styles.badgeText, { color: '#15803D' }]}>Disetujui</Text>
      </View>
    );
  }
  if (status === RENTAL_STATUS.REJECTED) {
    return (
      <View style={[styles.badge, styles.badgeRejected]}>
        <MaterialCommunityIcons name="close-circle" size={13} color="#DC2626" />
        <Text style={[styles.badgeText, { color: '#B91C1C' }]}>Ditolak</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, styles.badgePending]}>
      <MaterialCommunityIcons name="clock-outline" size={13} color="#D97706" />
      <Text style={[styles.badgeText, { color: '#B45309' }]}>Menunggu Konfirmasi</Text>
    </View>
  );
}

export default function RentalHistoryScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setRequests(await getRequestsBySeeker(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {item.listingTitle}
          </Text>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-range" size={15} color="#64748B" />
          <Text style={styles.infoText}>
            Mulai {formatDate(item.startDate)} • Durasi {item.durationDays} bulan
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Biaya Sewa:</Text>
          <Text style={styles.priceValue}>{formatRupiah(item.totalPrice)}</Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={
          loading ? (
            <Text style={{ textAlign: 'center', paddingVertical: 32, color: '#64748B' }}>
              Memuat riwayat pengajuan...
            </Text>
          ) : (
            <EmptyState
              icon="history"
              title="Belum ada riwayat pengajuan"
              subtitle="Ajukan sewa pada hunian pilihan Anda untuk melihat status prosesnya di sini."
              actionLabel="Cari Hunian Sekarang"
              onAction={() => navigation.navigate('Beranda')}
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
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  badgeAccepted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  badgeRejected: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  badgePending: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D9488',
  },
});