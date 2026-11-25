import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  HelperText,
  Snackbar,
  Text,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getListingById,
  createListing,
  updateListing,
} from '../../services/listingService';
import { LISTING_TYPES, AVAILABILITY_STATUS, RENTAL_DURATIONS } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

const PRESET_IMAGES = [
  {
    id: 'p1',
    label: 'Kamar Mahasiswa',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    label: 'Homestay Nyaman',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    label: 'Rumah Keluarga',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    label: 'Pesisir Pantai',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5',
    label: 'Studio Eksklusif',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
];

// Presets for Aceh Barat / Meulaboh
const PRESET_LOCATIONS = [
  { label: 'Meureubo / Kampus UTU', location: 'Jl. Alue Peunyareng, Meureubo, Aceh Barat', lat: 4.1352, lng: 96.1687 },
  { label: 'Johan Pahlawan / Pusat Kota', location: 'Jl. Manek Roo, Johan Pahlawan, Meulaboh, Aceh Barat', lat: 4.1445, lng: 96.1275 },
  { label: 'Pantai Ujong Karang', location: 'Jl. Pantai Ujong Karang, Johan Pahlawan, Aceh Barat', lat: 4.1294, lng: 96.1158 },
  { label: 'Suak Ribee / Samatiga', location: 'Jl. Meulaboh - Banda Aceh, Suak Ribee, Aceh Barat', lat: 4.1520, lng: 96.1260 },
  { label: 'Kaway XVI', location: 'Jl. Meulaboh - Tutut, Kaway XVI, Aceh Barat', lat: 4.1700, lng: 96.1850 },
];

const COMMON_FACILITIES = [
  'WiFi',
  'AC',
  'Parkir',
  'Dapur',
  'Kamar Mandi Dalam',
  'Laundry',
  'Listrik 24 Jam',
  'Water Heater',
  'Kasur Springbed',
];

// Quick templates for nearby places in Aceh Barat
const NEARBY_TEMPLATES = [
  { name: 'Kampus UTU', distance: '300 m (5 mnt)', icon: 'school' },
  { name: 'Masjid Agung Meulaboh', distance: '500 m', icon: 'mosque' },
  { name: 'RSUD Cut Nyak Dhien', distance: '1.2 km', icon: 'hospital-building' },
  { name: 'Pantai Ujong Karang', distance: '1.5 km', icon: 'waves' },
  { name: 'STAIN Meulaboh', distance: '850 m', icon: 'school' },
  { name: 'Minimarket & Fotokopi', distance: '100 m', icon: 'store' },
];

export default function AddEditListingScreen({ route, navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { listingId } = route.params || {};
  const isEdit = Boolean(listingId);

  const [title, setTitle] = useState('');
  const [type, setType] = useState(LISTING_TYPES[0].value);
  const [price, setPrice] = useState('');
  const [rentalDuration, setRentalDuration] = useState('bulan');
  const [availabilityStatus, setAvailabilityStatus] = useState(AVAILABILITY_STATUS.AVAILABLE);
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [lat, setLat] = useState(4.1440);
  const [lng, setLng] = useState(96.1280);
  const [description, setDescription] = useState('');
  const [facility, setFacility] = useState('');
  const [facilities, setFacilities] = useState(['WiFi', 'AC', 'Parkir']);

  // Manual Nearby Places State
  const [nearbyPlaces, setNearbyPlaces] = useState([
    { id: 'nb-init-1', name: 'Kampus UTU', distance: '350 m (4 mnt jalan)', icon: 'school' },
    { id: 'nb-init-2', name: 'Masjid Agung Meulaboh', distance: '1.5 km', icon: 'mosque' },
  ]);
  const [customNearbyName, setCustomNearbyName] = useState('');
  const [customNearbyDistance, setCustomNearbyDistance] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    if (isEdit) {
      navigation.setOptions({ title: 'Edit Hunian' });
      getListingById(listingId).then((listing) => {
        if (listing) {
          setTitle(listing.title || '');
          setType(listing.type || LISTING_TYPES[0].value);
          setPrice(String(listing.price || ''));
          setRentalDuration(listing.rentalDuration || 'bulan');
          setAvailabilityStatus(
            listing.availabilityStatus ||
              (listing.available !== false ? AVAILABILITY_STATUS.AVAILABLE : AVAILABILITY_STATUS.UNAVAILABLE)
          );
          setLocation(listing.location || '');
          setDescription(listing.description || '');
          setFacilities(listing.facilities || []);
          if (listing.nearbyPlaces && Array.isArray(listing.nearbyPlaces)) {
            setNearbyPlaces(listing.nearbyPlaces);
          }
          if (listing.images && listing.images.length > 0) {
            setSelectedImage(listing.images[0]);
          }
          if (listing.lat) setLat(listing.lat);
          if (listing.lng) setLng(listing.lng);
        }
      });
    }
  }, [isEdit, listingId, navigation]);

  const toggleFacility = (item) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter((f) => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  const addCustomFacility = () => {
    const value = facility.trim();
    if (value && !facilities.includes(value)) {
      setFacilities([...facilities, value]);
    }
    setFacility('');
  };

  const removeFacility = (value) => {
    setFacilities(facilities.filter((item) => item !== value));
  };

  const handleSelectPresetLocation = (preset) => {
    setLocation(preset.location);
    setLat(preset.lat);
    setLng(preset.lng);
  };

  // Nearby Places Handlers
  const addNearbyPlace = () => {
    if (!customNearbyName.trim()) {
      setSnackbar('Masukkan nama tempat terdekat.');
      return;
    }
    const newPlace = {
      id: 'nb-' + Date.now(),
      name: customNearbyName.trim(),
      distance: customNearbyDistance.trim() || 'Dekat hunian',
      icon: 'map-marker-radius',
    };
    setNearbyPlaces([...nearbyPlaces, newPlace]);
    setCustomNearbyName('');
    setCustomNearbyDistance('');
    setSnackbar(`"${newPlace.name}" ditambahkan ke tempat terdekat!`);
  };

  const addNearbyTemplate = (tpl) => {
    if (nearbyPlaces.some((p) => p.name.toLowerCase() === tpl.name.toLowerCase())) {
      setSnackbar(`"${tpl.name}" sudah ada.`);
      return;
    }
    const newPlace = {
      id: 'nb-' + Date.now(),
      name: tpl.name,
      distance: tpl.distance,
      icon: tpl.icon,
    };
    setNearbyPlaces([...nearbyPlaces, newPlace]);
    setSnackbar(`"${tpl.name}" ditambahkan!`);
  };

  const removeNearbyPlace = (id) => {
    setNearbyPlaces(nearbyPlaces.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim() || !price.trim()) {
      setError('Nama hunian dan harga sewa wajib diisi.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Harga sewa harus berupa angka yang valid.');
      return;
    }
    if (!location.trim()) {
      setError('Alamat/lokasi hunian di Aceh Barat wajib diisi.');
      return;
    }

    if (!user?.uid) {
      setError('Sesi autentikasi tidak valid. Silakan masuk kembali.');
      return;
    }

    const activeImage = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    const payload = {
      title: title.trim(),
      type,
      price: Number(price),
      rentalDuration,
      availabilityStatus,
      location: location.trim(),
      description: description.trim(),
      facilities,
      nearbyPlaces,
      images: [activeImage],
      lat,
      lng,
      ownerId: user.uid,
      ownerName: user.name || 'Pemilik Hunian',
    };

    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateListing(listingId, payload, user.uid);
      } else {
        await createListing(payload);
      }
      setSnackbar(isEdit ? 'Hunian berhasil diperbarui!' : 'Hunian berhasil disimpan & dipublikasikan!');
      setTimeout(() => navigation.goBack(), 1200);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan hunian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const activeDisplayImage = customImageUrl.trim() || selectedImage;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Image Preview & Picker */}
        <Text style={styles.sectionHeading}>Foto Hunian (Wajib & Menarik)</Text>
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: activeDisplayImage }}
            style={styles.mainPreviewImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.imageOverlayText}>Foto Utama</Text>
          </View>
        </View>

        <Text style={styles.subHeading}>Pilih Foto Preset Cepat:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetImagesRow}>
          {PRESET_IMAGES.map((item) => {
            const isSelected = selectedImage === item.url && !customImageUrl.trim();
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedImage(item.url);
                  setCustomImageUrl('');
                }}
                style={[styles.presetThumbWrapper, isSelected && styles.presetThumbActive]}
              >
                <Image source={{ uri: item.url }} style={styles.presetThumb} />
                <Text style={[styles.presetThumbLabel, isSelected && styles.presetThumbLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <TextInput
          label="Atau masukkan URL Foto Sendiri"
          placeholder="https://..."
          value={customImageUrl}
          onChangeText={setCustomImageUrl}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          style={styles.input}
          left={<TextInput.Icon icon="link-variant" color="#0D9488" />}
          right={
            customImageUrl ? (
              <TextInput.Icon icon="close" onPress={() => setCustomImageUrl('')} />
            ) : null
          }
        />

        {/* Section: Informasi Utama */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Informasi Utama</Text>

        <TextInput
          label="Nama Hunian"
          placeholder="cth: Kost Putri Teuku Umar Asri"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          style={styles.input}
          left={<TextInput.Icon icon="home-outline" color="#0D9488" />}
        />

        <Text style={styles.fieldLabel}>Kategori Hunian (3 Pilihan Utama)</Text>
        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={LISTING_TYPES.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          style={styles.segmentedBtn}
        />

        <Text style={styles.fieldLabel}>Jangka Waktu Sewa</Text>
        <SegmentedButtons
          value={rentalDuration}
          onValueChange={setRentalDuration}
          buttons={RENTAL_DURATIONS.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          style={styles.segmentedBtn}
        />

        <TextInput
          label={`Harga Sewa (Rp / ${rentalDuration === 'tahun' ? 'tahun' : rentalDuration === 'hari' ? 'hari' : 'bulan'})`}
          placeholder="cth: 650000"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="numeric"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          style={styles.input}
          left={<TextInput.Affix text="Rp " />}
        />

        <Text style={styles.fieldLabel}>Status Ketersediaan</Text>
        <SegmentedButtons
          value={availabilityStatus}
          onValueChange={setAvailabilityStatus}
          buttons={[
            { value: AVAILABILITY_STATUS.AVAILABLE, label: 'Tersedia' },
            { value: AVAILABILITY_STATUS.RENTING_PROCESS, label: 'Dalam Proses' },
            { value: AVAILABILITY_STATUS.UNAVAILABLE, label: 'Tidak Tersedia' },
          ]}
          style={styles.segmentedBtn}
        />

        {/* Section: Lokasi Aceh Barat */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Lokasi Daerah Aceh Barat</Text>
        <Text style={styles.subHeading}>Pilih Area Cepat di Aceh Barat:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetLocationsRow}>
          {PRESET_LOCATIONS.map((loc) => (
            <Pressable
              key={loc.label}
              onPress={() => handleSelectPresetLocation(loc)}
              style={[
                styles.locationPresetPill,
                location === loc.location && styles.locationPresetPillActive,
              ]}
            >
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={14}
                color={location === loc.location ? '#FFFFFF' : '#0D9488'}
              />
              <Text
                style={[
                  styles.locationPresetText,
                  location === loc.location && styles.locationPresetTextActive,
                ]}
              >
                {loc.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          label="Alamat Lengkap (Kecamatan / Desa / Jalan)"
          placeholder="cth: Jl. Alue Peunyareng, Meureubo, Aceh Barat"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          style={styles.input}
          left={<TextInput.Icon icon="map-marker" color="#0D9488" />}
        />

        {/* Section: Tempat & Akses Terdekat (INPUT MANUAL PEMILIK) */}
        <View style={styles.nearbySectionBox}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="map-marker-distance" size={20} color="#0D9488" />
            <Text style={[styles.sectionHeading, { marginBottom: 0, marginLeft: 6 }]}>
              Tempat Terdekat dari Hunian (Input Manual)
            </Text>
          </View>
          <Text style={styles.subHeading}>
            Tentukan akses kampus, masjid, fasilitas umum terdekat yang akan tampil sebagai kartu info bagi calon penyewa.
          </Text>

          {/* Quick template chips */}
          <Text style={[styles.fieldLabel, { marginTop: 4 }]}>Pilih Cepat Landmark Aceh Barat:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateScroll}>
            {NEARBY_TEMPLATES.map((tpl) => (
              <Chip
                key={tpl.name}
                icon="plus"
                onPress={() => addNearbyTemplate(tpl)}
                style={styles.templateChip}
                textStyle={{ fontSize: 11, color: '#0F766E', fontWeight: '600' }}
              >
                {tpl.name}
              </Chip>
            ))}
          </ScrollView>

          {/* List of currently added nearby places */}
          <View style={styles.addedNearbyContainer}>
            {nearbyPlaces.length === 0 ? (
              <Text style={styles.emptyNearbyText}>
                Belum ada tempat terdekat yang ditambahkan. Gunakan kolom di bawah untuk menambahkannya.
              </Text>
            ) : (
              nearbyPlaces.map((place) => (
                <View key={place.id} style={styles.nearbyItemCard}>
                  <View style={styles.nearbyIconCircle}>
                    <MaterialCommunityIcons
                      name={place.icon || 'map-marker'}
                      size={18}
                      color="#0D9488"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.nearbyPlaceName}>{place.name}</Text>
                    <Text style={styles.nearbyPlaceDist}>{place.distance}</Text>
                  </View>
                  <IconButton
                    icon="close-circle-outline"
                    iconColor="#EF4444"
                    size={20}
                    onPress={() => removeNearbyPlace(place.id)}
                  />
                </View>
              ))
            )}
          </View>

          {/* Input manual fields */}
          <View style={styles.addManualRow}>
            <TextInput
              label="Nama Tempat Terdekat"
              placeholder="cth: Kampus UTU / RSUD"
              value={customNearbyName}
              onChangeText={setCustomNearbyName}
              mode="outlined"
              outlineColor="#E2E8F0"
              activeOutlineColor="#0D9488"
              style={[styles.input, { flex: 1.3, marginBottom: 0 }]}
            />
            <TextInput
              label="Jarak / Waktu Tempuh"
              placeholder="cth: 300 m / 5 mnt"
              value={customNearbyDistance}
              onChangeText={setCustomNearbyDistance}
              mode="outlined"
              outlineColor="#E2E8F0"
              activeOutlineColor="#0D9488"
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
          </View>
          <Button
            mode="contained-tonal"
            icon="plus"
            buttonColor="#CCFBF1"
            textColor="#0F766E"
            onPress={addNearbyPlace}
            style={styles.addNearbyBtn}
            labelStyle={{ fontWeight: '700', fontSize: 13 }}
          >
            Tambahkan Tempat ke Kartu
          </Button>
        </View>

        {/* Section: Fasilitas */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Fasilitas Hunian</Text>
        <View style={styles.commonFacilitiesGrid}>
          {COMMON_FACILITIES.map((fac) => {
            const isChecked = facilities.includes(fac);
            return (
              <Chip
                key={fac}
                selected={isChecked}
                onPress={() => toggleFacility(fac)}
                style={[styles.facilityChip, isChecked && styles.facilityChipActive]}
                textStyle={{ color: isChecked ? '#0F766E' : '#475569', fontSize: 12, fontWeight: '600' }}
              >
                {fac}
              </Chip>
            );
          })}
        </View>

        <View style={styles.facilityAddRow}>
          <TextInput
            label="Tambah Fasilitas Lain"
            placeholder="cth: Meja Belajar, Parkir Mobil"
            value={facility}
            onChangeText={setFacility}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            onSubmitEditing={addCustomFacility}
            style={styles.facilityInput}
          />
          <Button
            mode="contained-tonal"
            buttonColor="#CCFBF1"
            textColor="#0F766E"
            onPress={addCustomFacility}
            style={styles.facilityButton}
          >
            + Tambah
          </Button>
        </View>

        {facilities.filter((f) => !COMMON_FACILITIES.includes(f)).length > 0 && (
          <View style={styles.customChipsRow}>
            {facilities
              .filter((f) => !COMMON_FACILITIES.includes(f))
              .map((item) => (
                <Chip
                  key={item}
                  onClose={() => removeFacility(item)}
                  style={styles.customChip}
                  textStyle={{ color: '#0F766E' }}
                >
                  {item}
                </Chip>
              ))}
          </View>
        )}

        {/* Section: Deskripsi */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Deskripsi Hunian</Text>
        <TextInput
          label="Deskripsi Lengkap"
          placeholder="Ceritakan kelebihan dan kenyamanan hunian Anda di Meulaboh..."
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        {error ? <HelperText type="error" visible style={{ marginTop: 8 }}>{error}</HelperText> : null}

        <Button
          mode="contained"
          buttonColor="#0D9488"
          textColor="#FFFFFF"
          loading={loading}
          onPress={handleSave}
          style={styles.submitBtn}
          labelStyle={{ fontWeight: '700', fontSize: 16, paddingVertical: 2 }}
        >
          {isEdit ? 'Simpan Perubahan' : 'Publikasikan Hunian di Aceh Barat'}
        </Button>
      </ScrollView>

      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar('')}>
        {snackbar}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 18,
    paddingBottom: 48,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 18,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mainPreviewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  presetImagesRow: {
    gap: 10,
    paddingBottom: 8,
  },
  presetThumbWrapper: {
    width: 90,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  presetThumbActive: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  presetThumb: {
    width: '100%',
    height: 56,
  },
  presetThumbLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    paddingVertical: 4,
    textAlign: 'center',
  },
  presetThumbLabelActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  segmentedBtn: {
    marginBottom: 12,
  },
  presetLocationsRow: {
    gap: 8,
    paddingBottom: 8,
  },
  locationPresetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationPresetPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  locationPresetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  locationPresetTextActive: {
    color: '#FFFFFF',
  },
  // Nearby Section Styles
  nearbySectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginTop: 20,
    marginBottom: 6,
  },
  templateScroll: {
    gap: 6,
    paddingBottom: 8,
  },
  templateChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  addedNearbyContainer: {
    marginVertical: 10,
    gap: 8,
  },
  emptyNearbyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  nearbyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nearbyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyPlaceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  nearbyPlaceDist: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 1,
  },
  addManualRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  addNearbyBtn: {
    marginTop: 8,
    borderRadius: 10,
  },
  commonFacilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  facilityChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  facilityChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  facilityAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  facilityInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  facilityButton: {
    borderRadius: 10,
  },
  customChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  customChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  submitBtn: {
    marginTop: 26,
    borderRadius: 14,
    paddingVertical: 4,
  },
});
