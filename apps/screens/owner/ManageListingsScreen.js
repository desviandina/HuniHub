import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Image, Platform } from 'react-native';
import {
  Text,
  Button,
  IconButton,
  FAB,
  Dialog,
  Portal,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import { getListingsByOwner, deleteListing } from '../../services/listingService';
import { formatRupiah } from '../../utils/formatters';
import { LISTING_TYPES, AVAILABILITY_STATUS } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

export default function ManageListingsScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [snackbar, setSnackbar] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setListings([]);
      setLoading(false);
      return;
    }
    try {
      setListings(await getListingsByOwner(user.uid));
    } catch (err) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      const deletedTitle = target.title;
      await deleteListing(target.id, user?.uid);
      setSnackbar(`"${deletedTitle}" berhasil dihapus.`);
      setTarget(null);
      await load();
    } catch (err) {
      setSnackbar(err.message || 'Gagal menghapus hunian.');
    } finally {
      setDeleting(false);
    }
  };

  const keyExtractor = useCallback((item) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }) => {
      const typeLabel =
        LISTING_TYPES.find((type) => type.value === item.type)?.label || item.type;
      const thumb = item.images?.[0];
      const statusText = item.availabilityStatus || (item.available !== false ? AVAILABILITY_STATUS.AVAILABLE : AVAILABILITY_STATUS.UNAVAILABLE);
      const isAvailable = statusText === AVAILABILITY_STATUS.AVAILABLE;
      const isRenting = statusText === AVAILABILITY_STATUS.RENTING_PROCESS;

      return (
        <View style={styles.card}>
          <View style={styles.cardRow}>
            {thumb ? (
              <Image source={{ uri: thumb }} style={styles.thumbnail} resizeMode="cover" />
            ) : (
              <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
                <MaterialCommunityIcons name="home-outline" size={24} color="#94A3B8" />
              </View>
            )}

            <View style={styles.cardDetails}>
              <View style={styles.badgeRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{typeLabel}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isAvailable
                      ? styles.statusBadgeAvailable
                      : isRenting
                      ? styles.statusBadgeRenting
                      : styles.statusBadgeUnavailable,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isAvailable
                        ? { color: '#15803D' }
                        : isRenting
                        ? { color: '#B45309' }
                        : { color: '#DC2626' },
                    ]}
                  >
                    {statusText}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>
                {formatRupiah(item.price)}
                <Text style={styles.itemMonth}>
                  {' '}
                  /{item.rentalDuration === 'tahun' ? 'tahun' : item.rentalDuration === 'hari' ? 'hari' : 'bulan'}
                </Text>
              </Text>
              <Text style={styles.itemLocation} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <Button
              mode="contained-tonal"
              icon="pencil"
              buttonColor="#F0FDFA"
              textColor="#0D9488"
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('AddEditListing', { listingId: item.id })
              }
            >
              Edit
            </Button>
            <IconButton
              icon="delete-outline"
              iconColor="#EF4444"
              size={20}
              onPress={() => setTarget(item)}
            />
          </View>
        </View>
      );
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
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
            <Text style={{ textAlign: 'center', paddingVertical: 36, color: '#64748B' }}>
              Memuat data hunian Anda...
            </Text>
          ) : (
            <EmptyState
              icon="office-building-outline"
              title="Anda Belum Memiliki Hunian"
              subtitle="Mulai daftarkan hunian Anda dan temukan calon penyewa melalui HuniHub."
              actionLabel="Tambah Hunian"
              onAction={() => navigation.navigate('AddEditListing')}
            />
          )
        }
      />

      <FAB
        icon="plus"
        color="#FFFFFF"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditListing')}
      />

      <Portal>
        <Dialog
          visible={Boolean(target)}
          onDismiss={() => setTarget(null)}
          style={{ backgroundColor: '#FFFFFF', borderRadius: 16 }}
        >
          <Dialog.Title style={{ color: '#0F172A', fontWeight: '700' }}>
            Hapus Hunian
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: '#475569' }}>
              Apakah Anda yakin ingin menghapus "{target?.title}"? Tindakan ini tidak dapat dibatalkan.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTarget(null)} textColor="#64748B" disabled={deleting}>
              Batal
            </Button>
            <Button textColor="#EF4444" onPress={handleDelete} loading={deleting} disabled={deleting}>
              Hapus
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar('')} duration={3000}>
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
    paddingBottom: Platform.OS === 'ios' ? 100 : 96,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeAvailable: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  statusBadgeRenting: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  statusBadgeUnavailable: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D9488',
  },
  itemMonth: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
  itemLocation: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    gap: 6,
  },
  actionBtn: {
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'ios' ? 84 : 76,
    backgroundColor: '#0D9488',
    borderRadius: 16,
  },
});
