import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  useTheme,
  ActivityIndicator,
  Avatar,
  Portal,
  Dialog,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getListingById, updateListingRating } from '../../services/listingService';
import { getReviewsForListing, addReview } from '../../services/reviewService';
import { checkDuplicateRequest } from '../../services/rentalService';
import { haversineDistanceKm } from '../../services/locationService';
import { formatRupiah, formatDistance, formatDate } from '../../utils/formatters';
import { LISTING_TYPES, AVAILABILITY_STATUS } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const { width } = Dimensions.get('window');

// Top landmarks in Aceh Barat / Meulaboh
const KEY_DESTINATIONS = [
  { id: 'utu', name: 'Kampus UTU', desc: 'Universitas Teuku Umar', lat: 4.1352, lng: 96.1687, icon: 'school' },
  { id: 'masjid', name: 'Masjid Baitul Makmur', desc: 'Pusat Kota Meulaboh', lat: 4.1458, lng: 96.1285, icon: 'mosque' },
  { id: 'rsud', name: 'RSUD Cut Nyak Dhien', desc: 'Fasilitas Kesehatan Utama', lat: 4.1495, lng: 96.1340, icon: 'hospital-building' },
  { id: 'pantai', name: 'Pantai Ujong Karang', desc: 'Wisata Sunset & Ikan Bakar', lat: 4.1294, lng: 96.1158, icon: 'waves' },
  { id: 'stain', name: 'STAIN Meulaboh', desc: 'Kawasan Kampus Meureubo', lat: 4.1310, lng: 96.1620, icon: 'school' },
  { id: 'pasar', name: 'Pasar Bina Usaha', desc: 'Pusat Pasar Meulaboh', lat: 4.1420, lng: 96.1270, icon: 'store' },
];

function getFacilityIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('wifi')) return 'wifi';
  if (lower.includes('ac')) return 'air-conditioner';
  if (lower.includes('parkir') || lower.includes('garasi')) return 'car';
  if (lower.includes('dapur')) return 'silverware-fork-knife';
  if (lower.includes('kamar mandi') || lower.includes('shower')) return 'shower';
  if (lower.includes('laundry')) return 'washing-machine';
  if (lower.includes('sarapan') || lower.includes('kopi')) return 'coffee';
  if (lower.includes('listrik') || lower.includes('air')) return 'flash-outline';
  if (lower.includes('tv')) return 'television';
  if (lower.includes('kasur') || lower.includes('springbed')) return 'bed';
  if (lower.includes('meja')) return 'desk';
  return 'check-circle-outline';
}

export default function ListingDetailScreen({ route, navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { listingId } = route.params;
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Destination & Distance State
  const [selectedDest, setSelectedDest] = useState(KEY_DESTINATIONS[0]);
  const [selectedNearbyId, setSelectedNearbyId] = useState(null);

  // Review Dialog State
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await getListingById(listingId);
      setListing(data);
      if (data?.nearbyPlaces && data.nearbyPlaces.length > 0) {
        setSelectedNearbyId(data.nearbyPlaces[0].id);
      }
      const dataReviews = await getReviewsForListing(listingId);
      setReviews(dataReviews);

      if (user?.role !== ROLES.OWNER) {
        const isDup = await checkDuplicateRequest(user?.uid, listingId);
        setHasPendingRequest(isDup);
      }
    } catch (err) {
      console.warn('Gagal memuat detail hunian:', err);
      setSnackbar('Gagal memuat detail hunian. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  }, [listingId, user?.role, user?.uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleOpenGoogleMaps = () => {
    if (!listing) return;
    const lat = listing.lat || 4.1440;
    const lng = listing.lng || 96.1280;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      setSnackbar('Tidak dapat membuka Google Maps di perangkat ini.');
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      setSnackbar('Tuliskan sedikit komentar ulasan Anda.');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview({
        listingId,
        reviewerId: user?.uid || 'u1',
        reviewerName: user?.name || 'Alya Putri',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      await updateListingRating(listingId, reviewRating);
      setShowReviewDialog(false);
      setReviewComment('');
      setSnackbar('Ulasan Anda berhasil dikirim! Terima kasih.');
      await load();
    } catch (err) {
      setSnackbar('Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D9488" />
        <Text style={{ marginTop: 12, color: '#64748B' }}>Memuat detail hunian Aceh Barat...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="home-alert-outline" size={56} color="#94A3B8" />
        <Text style={{ marginTop: 12, fontSize: 16, color: '#0F172A', fontWeight: '600' }}>
          Hunian tidak ditemukan.
        </Text>
      </View>
    );
  }

  const typeLabel =
    LISTING_TYPES.find((item) => item.value === listing.type)?.label || listing.type;
  const images = listing.images?.length ? listing.images : [];

  // Calculate dynamic distance to selected destination
  const calculatedDistance =
    listing.lat && listing.lng && selectedDest
      ? haversineDistanceKm(listing.lat, listing.lng, selectedDest.lat, selectedDest.lng)
      : listing.distanceKm;

  const nearbyPlaces = listing.nearbyPlaces || [];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Gallery with Indicator */}
        <View style={styles.galleryContainer}>
          {images.length > 0 ? (
            <>
              <FlatList
                horizontal
                data={images}
                keyExtractor={(_, index) => String(index)}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveImageIndex(idx);
                }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
                )}
              />
              <View style={styles.imageIndexPill}>
                <Text style={styles.imageIndexText}>
                  {activeImageIndex + 1} / {images.length}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="image-off-outline" size={48} color="#94A3B8" />
              <Text style={{ color: '#94A3B8', marginTop: 8 }}>Belum ada foto</Text>
            </View>
          )}

          {/* Floating Category Badge */}
          <View style={styles.floatingTypeBadge}>
            <Text style={styles.floatingTypeBadgeText}>{typeLabel}</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Title & Price Header */}
          <Text style={styles.title}>{listing.title}</Text>

          <View style={styles.ratingAndLocationRow}>
            {listing.rating ? (
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {Number(listing.rating).toFixed(1)}
                  {listing.reviewCount ? ` (${listing.reviewCount} ulasan)` : ''}
                </Text>
              </View>
            ) : null}

            {calculatedDistance !== null && calculatedDistance !== undefined && (
              <View style={styles.distanceBadge}>
                <MaterialCommunityIcons name="map-marker-distance" size={14} color="#0D9488" />
                <Text style={styles.distanceText}>
                  {formatDistance(calculatedDistance)} dari {selectedDest?.name || 'Pusat Meulaboh'}
                </Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Section: Lokasi Aceh Barat & Peta */}
          <Text style={styles.sectionTitle}>Lokasi di Aceh Barat</Text>
          <View style={styles.locationCard}>
            <MaterialCommunityIcons name="map-marker" size={22} color="#0D9488" />
            <View style={{ flex: 1 }}>
              <Text style={styles.locationText}>{listing.location}</Text>
              <Text style={styles.coordsText}>
                Koordinat Meulaboh: {listing.lat?.toFixed(4) || '4.1440'}, {listing.lng?.toFixed(4) || '96.1280'}
              </Text>
            </View>
            <Button
              mode="contained-tonal"
              buttonColor="#CCFBF1"
              textColor="#0F766E"
              icon="google-maps"
              onPress={handleOpenGoogleMaps}
              style={{ borderRadius: 10 }}
              labelStyle={{ fontSize: 12, fontWeight: '700' }}
            >
              Buka Maps
            </Button>
          </View>

          {/* SECTION: Tempat Terdekat Manual dari Pemilik Hunian */}
          {nearbyPlaces.length > 0 && (
            <View style={styles.nearbyOwnerSection}>
              <View style={styles.nearbyHeaderRow}>
                <Text style={styles.sectionTitle}>Tempat Terdekat dari Hunian</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={12} color="#0D9488" />
                  <Text style={styles.verifiedBadgeText}>Info Pemilik</Text>
                </View>
              </View>
              <Text style={styles.destSubHeading}>Akses kampus, fasilitas & jalan utama terdekat:</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destScrollRow}
              >
                {nearbyPlaces.map((place) => {
                  const isSelected = selectedNearbyId === place.id;
                  return (
                    <Pressable
                      key={place.id}
                      onPress={() => setSelectedNearbyId(place.id)}
                      style={[styles.destCard, isSelected && styles.destCardActive]}
                    >
                      <MaterialCommunityIcons
                        name={place.icon || 'map-marker'}
                        size={20}
                        color={isSelected ? '#0D9488' : '#64748B'}
                      />
                      <Text style={[styles.destName, isSelected && styles.destNameActive]}>
                        {place.name}
                      </Text>
                      <Text style={[styles.destDist, isSelected && styles.destDistActive]}>
                        {place.distance}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* SECTION: Kalkulator Jarak ke Landmark Populer Aceh Barat */}
          <Text style={[styles.destSubHeading, { marginTop: 14 }]}>
            Hitung Jarak ke Landmark Aceh Barat Lainnya:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destScrollRow}
          >
            {KEY_DESTINATIONS.map((dest) => {
              const isSelected = selectedDest?.id === dest.id;
              const dist =
                listing.lat && listing.lng
                  ? haversineDistanceKm(listing.lat, listing.lng, dest.lat, dest.lng)
                  : null;
              return (
                <Pressable
                  key={dest.id}
                  onPress={() => setSelectedDest(dest)}
                  style={[styles.destCard, isSelected && styles.destCardActive]}
                >
                  <MaterialCommunityIcons
                    name={dest.icon}
                    size={18}
                    color={isSelected ? '#0D9488' : '#64748B'}
                  />
                  <Text style={[styles.destName, isSelected && styles.destNameActive]}>
                    {dest.name}
                  </Text>
                  {dist !== null && (
                    <Text style={[styles.destDist, isSelected && styles.destDistActive]}>
                      {formatDistance(dist)}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <Divider style={styles.divider} />

          {/* Facilities Grid */}
          <Text style={styles.sectionTitle}>Fasilitas Hunian</Text>
          <View style={styles.facilityGrid}>
            {(listing.facilities || []).map((fac, idx) => (
              <View key={idx} style={styles.facilityPill}>
                <MaterialCommunityIcons
                  name={getFacilityIcon(fac)}
                  size={16}
                  color="#0D9488"
                />
                <Text style={styles.facilityText}>{fac}</Text>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Tentang Hunian</Text>
          <Text style={styles.descriptionText}>
            {listing.description || 'Tidak ada deskripsi tambahan untuk hunian ini.'}
          </Text>

          <Divider style={styles.divider} />

          {/* Host / Owner Card */}
          <Text style={styles.sectionTitle}>Informasi Pemilik</Text>
          <View style={styles.ownerCard}>
            <Avatar.Text
              size={48}
              label={(listing.ownerName || 'P').slice(0, 2).toUpperCase()}
              style={{ backgroundColor: '#0D9488' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: '700' }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.ownerName}>{listing.ownerName || 'Pak Rudi'}</Text>
              <Text style={styles.ownerVerified}>
                <MaterialCommunityIcons name="check-decagram" size={14} color="#0D9488" /> Mitra Pemilik HuniHub Aceh Barat
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Rating & Reviews Section */}
          <View style={styles.reviewHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Rating & Ulasan</Text>
              <Text style={styles.reviewCountText}>{reviews.length} Ulasan Terverifikasi</Text>
            </View>

            {user?.role !== ROLES.OWNER && (
              <Button
                mode="contained"
                buttonColor="#0D9488"
                textColor="#FFFFFF"
                icon="star-plus-outline"
                onPress={() => setShowReviewDialog(true)}
                style={{ borderRadius: 10 }}
                labelStyle={{ fontSize: 12, fontWeight: '700' }}
              >
                Beri Ulasan
              </Button>
            )}
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviewBox}>
              <MaterialCommunityIcons name="comment-text-multiple-outline" size={32} color="#CBD5E1" />
              <Text style={styles.emptyReviewText}>Belum ada ulasan untuk hunian ini.</Text>
              <Text style={styles.emptyReviewSubtext}>Jadilah yang pertama memberikan penilaian pengalaman menginap!</Text>
            </View>
          ) : (
            reviews.map((rv) => (
              <Card key={rv.id} mode="outlined" style={styles.reviewCard}>
                <Card.Content>
                  <View style={styles.reviewTopRow}>
                    <View style={styles.reviewerInfo}>
                      <Avatar.Text
                        size={32}
                        label={(rv.reviewerName || 'U').slice(0, 1).toUpperCase()}
                        style={{ backgroundColor: '#CCFBF1' }}
                        labelStyle={{ color: '#0F766E', fontSize: 13, fontWeight: '700' }}
                      />
                      <Text style={styles.reviewerName}>{rv.reviewerName}</Text>
                    </View>
                    <View style={styles.starRow}>
                      <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.starText}>{rv.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{rv.comment}</Text>
                  <Text style={styles.reviewDate}>{formatDate(rv.createdAt)}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Biaya Sewa</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.bottomPriceText}>{formatRupiah(listing.price)}</Text>
            <Text style={styles.bottomPerMonth}>
              {' '}
              /{listing.rentalDuration === 'tahun' ? 'tahun' : listing.rentalDuration === 'hari' ? 'hari' : 'bulan'}
            </Text>
          </View>
        </View>

        {user?.uid && String(listing.ownerId) === String(user.uid) ? (
          <Button
            mode="contained-tonal"
            style={styles.bookButton}
            buttonColor="#F0FDFA"
            textColor="#0D9488"
            icon="pencil"
            labelStyle={styles.bookButtonLabel}
            onPress={() => navigation.navigate('AddEditListing', { listingId })}
          >
            Kelola Hunian
          </Button>
        ) : hasPendingRequest ? (
          <Button
            mode="contained-tonal"
            style={styles.bookButton}
            buttonColor="#FEF3C7"
            textColor="#B45309"
            icon="clock-outline"
            labelStyle={styles.bookButtonLabel}
            onPress={() => navigation.navigate('Main', { screen: 'Riwayat' })}
          >
            Menunggu Konfirmasi
          </Button>
        ) : listing.availabilityStatus === AVAILABILITY_STATUS.RENTING_PROCESS ? (
          <View style={[styles.unavailableBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <Text style={[styles.unavailableText, { color: '#B45309' }]}>Dalam Proses</Text>
          </View>
        ) : listing.availabilityStatus === AVAILABILITY_STATUS.UNAVAILABLE || listing.available === false ? (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Tidak Tersedia</Text>
          </View>
        ) : (
          <Button
            mode="contained"
            style={styles.bookButton}
            buttonColor="#0D9488"
            textColor="#FFFFFF"
            labelStyle={styles.bookButtonLabel}
            onPress={() => navigation.navigate('RentalRequestForm', { listingId })}
          >
            Ajukan Sewa
          </Button>
        )}
      </View>

      {/* Dialog Beri Ulasan & Rating */}
      <Portal>
        <Dialog
          visible={showReviewDialog}
          onDismiss={() => setShowReviewDialog(false)}
          style={styles.reviewDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Beri Ulasan & Rating</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSub}>Bagaimana kenyamanan menginap di {listing.title}?</Text>

            {/* Interactive 5-Star Selector */}
            <View style={styles.interactiveStarRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setReviewRating(star)}
                  style={styles.starTouchArea}
                >
                  <MaterialCommunityIcons
                    name={star <= reviewRating ? 'star' : 'star-outline'}
                    size={36}
                    color={star <= reviewRating ? '#F59E0B' : '#CBD5E1'}
                  />
                </Pressable>
              ))}
            </View>
            <Text style={styles.ratingLabelText}>{reviewRating} dari 5 Bintang</Text>

            <TextInput
              label="Tulis komentar ulasan Anda..."
              placeholder="Ceritakan kebersihan, fasilitas, dan kenyamanan di Aceh Barat..."
              value={reviewComment}
              onChangeText={setReviewComment}
              mode="outlined"
              outlineColor="#E2E8F0"
              activeOutlineColor="#0D9488"
              multiline
              numberOfLines={3}
              style={{ marginTop: 12, backgroundColor: '#FFFFFF' }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowReviewDialog(false)} textColor="#64748B">
              Batal
            </Button>
            <Button
              mode="contained"
              buttonColor="#0D9488"
              textColor="#FFFFFF"
              loading={submittingReview}
              onPress={handleSubmitReview}
              style={{ borderRadius: 10, paddingHorizontal: 12 }}
            >
              Kirim Ulasan
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
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  galleryContainer: {
    position: 'relative',
    width: '100%',
    height: 260,
    backgroundColor: '#F1F5F9',
  },
  galleryImage: {
    width,
    height: 260,
  },
  imagePlaceholder: {
    width,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIndexPill: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  imageIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingTypeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(13, 148, 136, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  floatingTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  ratingAndLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F766E',
  },
  divider: {
    marginVertical: 18,
    backgroundColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  nearbyOwnerSection: {
    marginBottom: 10,
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  destSubHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  destScrollRow: {
    gap: 8,
    paddingBottom: 4,
  },
  destCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minWidth: 100,
  },
  destCardActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  destName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  destNameActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  destDist: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 3,
  },
  destDistActive: {
    color: '#0F766E',
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  facilityText: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  ownerVerified: {
    fontSize: 12,
    color: '#0D9488',
    marginTop: 2,
    fontWeight: '500',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: -6,
  },
  emptyReviewBox: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyReviewText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 8,
  },
  emptyReviewSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  reviewCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E2E8F0',
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  starText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  reviewComment: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  bottomPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D9488',
  },
  bottomPerMonth: {
    fontSize: 12,
    color: '#94A3B8',
  },
  bookButton: {
    borderRadius: 14,
    paddingHorizontal: 8,
  },
  bookButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 2,
  },
  unavailableBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  reviewDialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  dialogTitle: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 18,
  },
  dialogSub: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 12,
  },
  interactiveStarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  starTouchArea: {
    padding: 4,
  },
  ratingLabelText: {
    textAlign: 'center',
    color: '#D97706',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 4,
  },
});
