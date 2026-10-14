import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, Searchbar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ListingCard from '../../components/ListingCard';
import EmptyState from '../../components/EmptyState';
import { searchListings } from '../../services/listingService';
import { LISTING_TYPES } from '../../constants/listing';

const categoryFilters = [
  { value: '', label: 'Semua', icon: 'view-grid-outline' },
  { value: 'homestay', label: 'Homestay', icon: 'home-heart' },
  { value: 'kost', label: 'Kost', icon: 'bed-outline' },
  { value: 'rumah', label: 'Rumah', icon: 'home-city-outline' },
];

function SkeletonCard() {
  return (
    <View style={styles.skeletonWrapper}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonBadge} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonRow}>
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonDistance} />
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(
    async (isPullToRefresh = false) => {
      if (!isPullToRefresh) setLoading(true);
      try {
        const data = await searchListings({ type });
        setListings(data);
      } catch (err) {
        setListings([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [type]
  );

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [fetchListings])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchListings(true);
  }, [fetchListings]);

  const handleSearch = useCallback(() => {
    navigation.navigate('Cari', {
      keyword: search,
      type,
    });
  }, [navigation, search, type]);

  const handleSelectListing = useCallback(
    (listingId) => {
      navigation.navigate('ListingDetail', { listingId });
    },
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ListingCard
        listing={item}
        onPress={() => handleSelectListing(item.id)}
      />
    ),
    [handleSelectListing]
  );

  const headerComponent = useMemo(
    () => (
      <View style={styles.headerArea}>
        {/* Top Greeting Section */}
        <View style={styles.greetingSection}>
          <View>
            <Text style={styles.welcomeSubtext}>Selamat Datang di</Text>
            <Text style={styles.brandTitle}>HuniHub ✨</Text>
          </View>
          <View style={styles.badgeHub}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#0D9488" />
            <Text style={styles.badgeHubText}>Terpercaya</Text>
          </View>
        </View>

        {/* Modern Searchbar */}
        <Searchbar
          placeholder="Cari lokasi, homestay, atau kost..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor="#0D9488"
          placeholderTextColor="#94A3B8"
          elevation={1}
        />

        {/* Visual Category Filter Selector */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categoryFilters.map((cat) => {
              const isSelected = type === cat.value;
              return (
                <Pressable
                  key={cat.value || 'all'}
                  onPress={() => setType(cat.value)}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Heading with count */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Hunian Tersedia</Text>
          {!loading && (
            <Text style={styles.countBadge}>
              {listings.length} Pilihan
            </Text>
          )}
        </View>
      </View>
    ),
    [search, type, loading, listings.length, handleSearch]
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          {headerComponent}
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={styles.listContent}
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
          ListEmptyComponent={
            <EmptyState
              icon="home-search-outline"
              title="Hunian belum tersedia"
              subtitle="Coba pilih kategori lain atau ubah kata kunci pencarian Anda."
              actionLabel="Tampilkan Semua"
              onAction={() => setType('')}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    paddingHorizontal: 16,
  },
  headerArea: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSubtext: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  badgeHub: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  badgeHubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
  },
  searchInput: {
    minHeight: 50,
    fontSize: 14,
    color: '#0F172A',
  },
  categoryContainer: {
    marginBottom: 18,
  },
  categoryList: {
    gap: 8,
    paddingRight: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  categoryPillSelected: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
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
  // Skeletons
  skeletonWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonImage: {
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  skeletonBody: {
    padding: 14,
    gap: 10,
  },
  skeletonBadge: {
    width: 70,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  skeletonTitle: {
    width: '65%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  skeletonPrice: {
    width: 90,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  skeletonDistance: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
});