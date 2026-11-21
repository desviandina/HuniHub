import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import { Text, Button, useTheme, Snackbar, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import {
  getRequestsByOwner,
  updateRequestStatus,
} from '../../services/rentalService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { RENTAL_STATUS, RENTAL_STATUS_LABEL } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

const STATUS_FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: RENTAL_STATUS.PENDING, label: 'Menunggu' },
  { key: RENTAL_STATUS.ACCEPTED, label: 'Disetujui' },
  { key: RENTAL_STATUS.REJECTED, label: 'Ditolak' },
  { key: RENTAL_STATUS.COMPLETED, label: 'Selesai' },
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
      <Text style={[styles.badgeText, { color: '#B45309' }]}>Menunggu</Text>
    </View>
  );
}

export default function RentalRequestsScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  const load = useCallback(async () => {
    try {
      setRequests(await getRequestsByOwner(user?.uid || 'o1'));
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleAccept = async (request) => {
    await updateRequestStatus(request.id, RENTAL_STATUS.ACCEPTED);
    setSnackbar('Permintaan sewa berhasil disetujui.');
    await load();
  };

  const handleComplete = async (request) => {
    await updateRequestStatus(request.id, RENTAL_STATUS.COMPLETED);
    setSnackbar('Masa sewa telah ditandai selesai.');
    await load();
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      await updateRequestStatus(rejectTarget.id, RENTAL_STATUS.REJECTED);
      setRejectTarget(null);
      setSnackbar('Permintaan sewa ditolak.');
      await load();
    } catch (err) {
      setSnackbar('Gagal menolak permintaan. Coba lagi.');
    } finally {
      setRejecting(false);
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

        {/* Nama Penyewa */}
        {item.seekerName ? (
          <View style={styles.seekerRow}>
            <MaterialCommunityIcons name="account-outline" size={15} color="#0D9488" />
            <Text style={styles.seekerName}>{item.seekerName}</Text>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-clock" size={15} color="#64748B" />
          <Text style={styles.infoText}>
            {item.endDate
              ? `${formatDate(item.startDate)} s/d ${formatDate(item.endDate)}`
              : `Mulai ${formatDate(item.startDate)} • Durasi ${item.durationDays} hari`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Biaya:</Text>
          <Text style={styles.priceValue}>{formatRupiah(item.totalPrice)}</Text>
        </View>

        {item.status === RENTAL_STATUS.PENDING && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              buttonColor="#0D9488"
              textColor="#FFFFFF"
              style={styles.actionBtn}
              onPress={() => handleAccept(item)}
            >
              Terima
            </Button>
            <Button
              mode="outlined"
              textColor="#DC2626"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => setRejectTarget(item)}
            >
              Tolak
            </Button>
          </View>
        )}

        {item.status === RENTAL_STATUS.ACCEPTED && (
          <View style={styles.actions}>
            <Button
              mode="contained-tonal"
              buttonColor="#CCFBF1"
              textColor="#0F766E"
              icon="check-circle-outline"
              style={styles.actionBtn}
              onPress={() => handleComplete(item)}
            >
              Tandai Sewa Selesai
            </Button>
          </View>
        )}
      </View>
    ),
    []
  );

  const filteredRequests =
    activeFilter === 'all'
      ? requests
      : requests.filter((item) => item.status === activeFilter);

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
              Memuat permintaan...
            </Text>
          ) : (
            <EmptyState
              icon="clipboard-text-outline"
              title="Belum ada permintaan sewa"
              subtitle="Permintaan dari calon penyewa hunian Anda akan otomatis masuk di sini."
            />
          )
        }
      />

      {/* Dialog Konfirmasi Penolakan */}
      <Portal>
        <Dialog visible={Boolean(rejectTarget)} onDismiss={() => setRejectTarget(null)}>
          <Dialog.Title>Tolak Permintaan?</Dialog.Title>
          <Dialog.Content>
            <Text>
              Anda yakin ingin menolak permintaan sewa{' '}
              {rejectTarget?.seekerName ? (
                <>
                  dari <Text style={{ fontWeight: '700' }}>{rejectTarget.seekerName}</Text>{' '}
                </>
              ) : null}
              untuk <Text style={{ fontWeight: '700' }}>{rejectTarget?.listingTitle}</Text>?
              Penyewa akan mendapatkan notifikasi penolakan.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRejectTarget(null)} textColor="#64748B">
              Batal
            </Button>
            <Button
              mode="contained"
              buttonColor="#DC2626"
              textColor="#FFFFFF"
              loading={rejecting}
              onPress={handleConfirmReject}
              style={{ borderRadius: 10 }}
            >
              Ya, Tolak
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
    marginBottom: 6,
    gap: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  seekerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  seekerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
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
    paddingTop: 6,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    borderRadius: 10,
    minWidth: 84,
  },
  rejectBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
});
