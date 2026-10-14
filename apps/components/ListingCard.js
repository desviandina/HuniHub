import React, { memo } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatRupiah, formatDistance } from '../utils/formatters';
import { LISTING_TYPES } from '../constants/listing';

function ListingCardComponent({ listing, onPress }) {
  const theme = useTheme();
  const typeLabel =
    LISTING_TYPES.find((item) => item.value === listing.type)?.label || listing.type;

  const imageUri = listing.images?.[0];

  return (
    <View style={styles.cardWrapper}>
      <TouchableRipple
        onPress={onPress}
        style={styles.cardTouchable}
        rippleColor="rgba(13, 148, 136, 0.12)"
      >
        <View style={styles.cardContent}>
          {/* Cover Image & Floating Badges */}
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <MaterialCommunityIcons
                  name="home-city-outline"
                  size={48}
                  color={theme.colors.outline}
                />
              </View>
            )}

            {/* Floating Type Badge (Top Left) */}
            <View style={styles.floatingTypeBadge}>
              <Text style={styles.floatingTypeBadgeText}>{typeLabel}</Text>
            </View>

            {/* Floating Rating Pill (Top Right) */}
            {listing.rating ? (
              <View style={styles.floatingRatingPill}>
                <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {Number(listing.rating).toFixed(1)}
                  {listing.reviewCount ? ` (${listing.reviewCount})` : ''}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Details Section */}
          <View style={styles.infoSection}>
            <Text style={styles.title} numberOfLines={1}>
              {listing.title}
            </Text>

            {/* Location row */}
            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color="#64748B"
                style={styles.locationIcon}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {listing.location}
              </Text>
            </View>

            {/* Bottom Row: Price & Distance */}
            <View style={styles.bottomRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{formatRupiah(listing.price)}</Text>
                <Text style={styles.perMonthText}> /bulan</Text>
              </View>

              {listing.distanceKm !== undefined && (
                <View style={styles.distanceBadge}>
                  <MaterialCommunityIcons
                    name="navigation-variant-outline"
                    size={12}
                    color="#0D9488"
                  />
                  <Text style={styles.distanceText}>
                    {formatDistance(listing.distanceKm)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    }),
  },
  cardTouchable: {
    borderRadius: 18,
  },
  cardContent: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(13, 148, 136, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  floatingTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  floatingRatingPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  infoSection: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D9488',
  },
  perMonthText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  distanceText: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '600',
  },
});

export default memo(ListingCardComponent);