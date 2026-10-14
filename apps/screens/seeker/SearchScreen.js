import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  TextInput,
  Text,
  Button,
  HelperText,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListingCard from '../../components/ListingCard';
import EmptyState from '../../components/EmptyState';
import { searchListings } from '../../services/listingService';
import { LISTING_TYPES } from '../../constants/listing';

export default function SearchScreen({ navigation, route }) {
  const theme = useTheme();
  const [keyword, setKeyword] = useState(route.params?.keyword || '');
  const [type, setType] = useState(route.params?.type || '');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchListings({
        type,
        city: keyword,
        maxPrice,
        sortBy,
      });
      setListings(data);
    } catch (err) {
      setError('Terjadi kesalahan saat mencari hunian.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, type, maxPrice, sortBy]);

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Search Controls */}
      <View style={styles.topBar}>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Cari lokasi, kota, atau nama hunian..."
            value={keyword}
            onChangeText={setKeyword}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" color="#0D9488" />}
            right={
              keyword ? (
                <TextInput.Icon icon="close-circle" onPress={() => setKeyword('')} />
              ) : null
            }
            onSubmitEditing={load}
          />
          <Pressable
            style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={20}
              color={showFilters ? '#FFFFFF' : '#0D9488'}
            />
          </Pressable>
        </View>

        {/* Quick Type Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPills}
        >
          <Pressable
            onPress={() => setType('')}
            style={[styles.typePill, type === '' && styles.typePillActive]}
          >
            <Text style={[styles.typePillText, type === '' && styles.typePillTextActive]}>
              Semua
            </Text>
          </Pressable>
          {LISTING_TYPES.map((item) => {
            const isSelected = type === item.value;
            return (
              <Pressable
                key={item.value}
                onPress={() => setType(isSelected ? '' : item.value)}
                style={[styles.typePill, isSelected && styles.typePillActive]}
              >
                <Text
                  style={[
                    styles.typePillText,
                    isSelected && styles.typePillTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Expandable Advanced Filter Panel */}
        {showFilters && (
          <View style={styles.advancedFilterPanel}>
            <TextInput
              label="Batas Harga Maksimal (Rp/bulan)"
              value={maxPrice}
              onChangeText={setMaxPrice}
              mode="outlined"
              keyboardType="numeric"
              outlineColor="#E2E8F0"
              activeOutlineColor="#0D9488"
              style={styles.priceInput}
              left={<TextInput.Affix text="Rp " />}
            />

            <Text style={styles.sortLabel}>Urutkan Berdasarkan</Text>
            <View style={styles.sortRow}>
              {[
                { value: '', label: 'Default' },
                { value: 'priceAsc', label: 'Termurah' },
                { value: 'rating', label: 'Rating' },
              ].map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSortBy(opt.value)}
                  style={[
                    styles.sortPill,
                    sortBy === opt.value && styles.sortPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortPillText,
                      sortBy === opt.value && styles.sortPillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Button
              mode="contained"
              buttonColor="#0D9488"
              textColor="#FFFFFF"
              onPress={load}
              style={styles.applyFilterBtn}
            >
              Terapkan Filter
            </Button>
          </View>
        )}
      </View>

      {error ? <HelperText type="error">{error}</HelperText> : null}

      {/* Results Header */}
      {!loading && (
        <View style={styles.resultCountRow}>
          <Text style={styles.resultCountText}>
            Ditemukan <Text style={{ fontWeight: '700', color: '#0D9488' }}>{listings.length}</Text> hunian
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={{ marginTop: 12, color: '#64748B' }}>Mencari hunian...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListEmptyComponent={
            <EmptyState
              icon="map-search-outline"
              title="Hunian tidak ditemukan"
              subtitle="Coba kurangi filter atau masukkan kata kunci pencarian yang berbeda."
              actionLabel="Reset Pencarian"
              onAction={() => {
                setKeyword('');
                setType('');
                setMaxPrice('');
                setSortBy('');
              }}
            />
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    height: 46,
    fontSize: 14,
  },
  filterToggleBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  quickPills: {
    gap: 8,
    paddingBottom: 4,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typePillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typePillTextActive: {
    color: '#FFFFFF',
  },
  advancedFilterPanel: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceInput: {
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
    height: 46,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sortPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortPillActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sortPillTextActive: {
    color: '#0F766E',
  },
  applyFilterBtn: {
    borderRadius: 12,
  },
  resultCountRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCountText: {
    fontSize: 13,
    color: '#64748B',
  },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});