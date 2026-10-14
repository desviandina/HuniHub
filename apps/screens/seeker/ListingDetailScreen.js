import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  useTheme,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getListingById } from '../../services/listingService';
import { getReviewsForListing } from '../../services/reviewService';
import { formatRupiah, formatDistance, formatDate } from '../../utils/formatters';
import { LISTING_TYPES } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const { width } = Dimensions.get('window');

function getFacilityIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('wifi')) return 'wifi';
  if (lower.includes('ac')) return 'air-conditioner';
  if (lower.includes('parkir') || lower.includes('garasi')) return 'car';
  if (lower.includes('dapur')) return 'silverware-fork-knife';
  if (lower.includes('kamar mandi') || lower.includes('shower')) return 'shower';
  if (lower.includes('laundry')) return 'washing-machine';
  if (lower.includes('sarapan')) return 'coffee';
  if (lower.includes('listrik') || lower.includes('air')) return 'flash-outline';
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

  const load = useCallback(async () => {
    try {
      const data = await getListingById(listingId);
      setListing(data);
      const dataReviews = await getReviewsForListing(listingId);
      setReviews(dataReviews);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D9488" />
        <Text style={{ marginTop: 12, color: '#64748B' }}>Memuat detail hunian...</Text>
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

            {listing.distanceKm !== undefined && (
              <View style={styles.distanceBadge}>
                <MaterialCommunityIcons name="map-marker-distance" size={14} color="#0D9488" />
                <Text style={styles.distanceText}>
                  {formatDistance(listing.distanceKm)} dari tujuan
                </Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Location Details */}
          <Text style={styles.sectionTitle}>Lokasi</Text>
          <View style={styles.locationCard}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#0D9488" />
            <Text style={styles.locationText}>{listing.location}</Text>
          </View>

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
              <Text style={styles.ownerName}>{listing.ownerName || 'Pemilik Hunian'}</Text>
              <Text style={styles.ownerVerified}>
                <MaterialCommunityIcons name="check-decagram" size={14} color="#0D9488" /> Pemilik Terverifikasi
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Rating & Reviews */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.sectionTitle}>Rating & Ulasan</Text>
            <Text style={styles.reviewCountText}>{reviews.length} Ulasan</Text>
          </View>

          {reviews.length === 0 ? (
            <Text style={styles.emptyReviewText}>Belum ada ulasan untuk hunian ini.</Text>
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
            <Text style={styles.bottomPerMonth}> /bulan</Text>
          </View>
        </View>

        {listing.available && user?.role === ROLES.SEEKER ? (
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
        ) : (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Tidak Tersedia</Text>
          </View>
        )}
      </View>
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
    paddingBottom: 110, // give space for sticky bottom bar
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
    marginBottom: 10,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
    lineHeight: 20,
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
    marginBottom: 10,
  },
  reviewCountText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyReviewText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
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
  // Sticky Bottom Bar
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
});