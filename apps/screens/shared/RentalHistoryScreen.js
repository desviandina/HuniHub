import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import { Text, useTheme, Button, Snackbar, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import { getRequestsBySeeker, cancelRequest } from '../../services/rentalService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { RENTAL_STATUS } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

const STATUS_FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: RENTAL_STATUS.PENDING, label: 'Menunggu' },
  { key: RENTAL_STATUS.ACCEPTED, label: 'Disetujui' },
  { key: RENTAL_STATUS.REJECTED, label: 'Ditolak' },
  { key: RENTAL_STATUS.COMPLETED, label: 'Selesai' },
  { key: RENTAL_STATUS.CANCELED, label: 'Dibatalkan' },
];

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
  if (status === RENTAL_STATUS.COMPLETED) {
    return (
      <View style={[styles.badge, styles.badgeCompleted]}>
        <MaterialCommunityIcons name="check-all" size={13} color="#2563EB" />
        <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>Selesai</Text>
      </View>
    );
  }
  if (status === RENTAL_STATUS.CANCELED) {
    return (
      <View style={[styles.badge, styles.badgeCanceled]}>
        <MaterialCommunityIcons name="cancel" size={13} color="#6B7280" />
        <Text style={[styles.badgeText, { color: '#4B5563' }]}>Dibatalkan</Text>
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [snackbar, setSnackbar] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [canceling, setCanceling] = useState(false);

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

  const filteredRequests =
    activeFilter === 'all'
      ? requests
      : requests.filter((item) => item.status === activeFilter);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCanceling(true);
    try {
      await cancelRequest(cancelTarget.id);
      setCancelTarget(null);
      setSnackbar('Permintaan sewa berhasil dibatalkan.');
      await load();
    } catch (err) {
      setSnackbar('Gagal membatalkan permintaan. Coba lagi.');
    } finally {
      setCanceling(false);
    }
  };

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
            {item.endDate
              ? `${formatDate(item.startDate)} s/d ${formatDate(item.endDate)}`
              : `Mulai ${formatDate(item.startDate)} • Durasi ${item.durationDays} hari`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Biaya Sewa:</Text>
          <Text style={styles.priceValue}>{formatRupiah(item.totalPrice)}</Text>
        </View>

        {/* Tombol batalkan — hanya tampil saat status PENDING */}
        {item.status === RENTAL_STATUS.PENDING && (
          <View style={styles.cancelRow}>
            <Button
              mode="outlined"
              textColor="#DC2626"
              style={styles.cancelBtn}
              labelStyle={{ fontSize: 13, fontWeight: '700' }}
              onPress={() => setCancelTarget(item)}
            >
              Batalkan Pengajuan
            </Button>
          </View>
        )}
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredRequests}
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
              subtitle={
                activeFilter === 'all'
                  ? 'Ajukan sewa pada hunian pilihan Anda untuk melihat status prosesnya di sini.'
                  : `Tidak ada pengajuan dengan status "${STATUS_FILTERS.find((f) => f.key === activeFilter)?.label}".`
              }
              actionLabel={activeFilter === 'all' ? 'Cari Hunian Sekarang' : undefined}
              onAction={activeFilter === 'all' ? () => navigation.navigate('Beranda') : undefined}
            />
          )
        }
      />

      {/* Dialog Konfirmasi Pembatalan */}
      <Portal>
        <Dialog visible={Boolean(cancelTarget)} onDismiss={() => setCancelTarget(null)}>
          <Dialog.Title>Batalkan Pengajuan?</Dialog.Title>
          <Dialog.Content>
            <Text>
              Anda yakin ingin membatalkan pengajuan sewa untuk{' '}
              <Text style={{ fontWeight: '700' }}>{cancelTarget?.listingTitle}</Text>? Tindakan ini
              tidak dapat dibatalkan.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelTarget(null)} textColor="#64748B">
              Tidak
            </Button>
            <Button
              mode="contained"
              buttonColor="#DC2626"
              textColor="#FFFFFF"
              loading={canceling}
              onPress={handleConfirmCancel}
              style={{ borderRadius: 10 }}
            >
              Ya, Batalkan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar('')}>
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  badgeCompleted: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeCanceled: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  cancelRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },
});
