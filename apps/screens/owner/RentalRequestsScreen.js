import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Platform } from 'react-native';
import { Text, Button, useTheme, Snackbar } from 'react-native-paper';
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
      <Text style={[styles.badgeText, { color: '#B45309' }]}>Menunggu</Text>
    </View>
  );
}

export default function RentalRequestsScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');

  const load = useCallback(async () => {
    try {
      setRequests(await getRequestsByOwner(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const updateStatus = async (request, status) => {
    await updateRequestStatus(request.id, status);
    setSnackbar(
      status === RENTAL_STATUS.ACCEPTED
        ? 'Permintaan sewa berhasil disetujui.'
        : 'Permintaan sewa ditolak.'
    );
    await load();
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
          <MaterialCommunityIcons name="calendar-clock" size={15} color="#64748B" />
          <Text style={styles.infoText}>
            Mulai {formatDate(item.startDate)} • Durasi {item.durationDays} bulan
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
              onPress={() => updateStatus(item, RENTAL_STATUS.ACCEPTED)}
            >
              Terima
            </Button>
            <Button
              mode="outlined"
              textColor="#DC2626"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => updateStatus(item, RENTAL_STATUS.REJECTED)}
            >
              Tolak
            </Button>
          </View>
        )}
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