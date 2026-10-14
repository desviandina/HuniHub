import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  HelperText,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import {
  getListingById,
  createListing,
  updateListing,
} from '../../services/listingService';
import { LISTING_TYPES } from '../../constants/listing';
import { useAuth } from '../../context/AuthContext';

export default function AddEditListingScreen({ route, navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { listingId } = route.params || {};
  const isEdit = Boolean(listingId);

  const [title, setTitle] = useState('');
  const [type, setType] = useState(LISTING_TYPES[0].value);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [facility, setFacility] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    if (isEdit) {
      navigation.setOptions({ title: 'Edit Hunian' });
      getListingById(listingId).then((listing) => {
        if (listing) {
          setTitle(listing.title);
          setType(listing.type);
          setPrice(String(listing.price));
          setLocation(listing.location);
          setDescription(listing.description || '');
          setFacilities(listing.facilities || []);
        }
      });
    }
  }, [isEdit, listingId, navigation]);

  const addFacility = () => {
    const value = facility.trim();
    if (value && !facilities.includes(value)) {
      setFacilities([...facilities, value]);
    }
    setFacility('');
  };

  const removeFacility = (value) => {
    setFacilities(facilities.filter((item) => item !== value));
  };

  const handleSave = async () => {
    if (!title || !price) {
      setError('Nama dan harga hunian wajib diisi.');
      return;
    }
    const payload = {
      title,
      type,
      price: Number(price),
      location,
      description,
      facilities,
      ownerId: user.uid,
    };
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateListing(listingId, payload);
      } else {
        await createListing(payload);
      }
      setSnackbar(isEdit ? 'Hunian diperbarui.' : 'Hunian disimpan.');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      setError('Gagal menyimpan hunian. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Nama hunian"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
        <Text variant="labelLarge">Jenis hunian</Text>
        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={LISTING_TYPES.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          style={styles.input}
        />
        <TextInput
          label="Harga per bulan"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Alamat / lokasi"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Deskripsi"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text variant="labelLarge" style={{ marginTop: 14, marginBottom: 6, fontWeight: '700' }}>
          Fasilitas
        </Text>
        <View style={styles.facilityRow}>
          <TextInput
            label="Tambah fasilitas"
            placeholder="cth: AC, WiFi, Garasi"
            value={facility}
            onChangeText={setFacility}
            mode="outlined"
            outlineColor="#E2E8F0"
            activeOutlineColor="#0D9488"
            onSubmitEditing={addFacility}
            style={styles.facilityInput}
          />
          <Button
            mode="contained-tonal"
            buttonColor="#CCFBF1"
            textColor="#0F766E"
            onPress={addFacility}
            style={styles.facilityButton}
          >
            Tambah
          </Button>
        </View>
        <View style={styles.chips}>
          {facilities.map((item) => (
            <Chip
              key={item}
              onClose={() => removeFacility(item)}
              style={styles.chip}
              textStyle={{ color: '#0F766E' }}
            >
              {item}
            </Chip>
          ))}
        </View>

        {error ? <HelperText type="error">{error}</HelperText> : null}

        <Button
          mode="contained"
          buttonColor="#0D9488"
          textColor="#FFFFFF"
          loading={loading}
          onPress={handleSave}
          style={styles.submit}
          labelStyle={{ fontWeight: '700', fontSize: 15 }}
        >
          {isEdit ? 'Perbarui Hunian' : 'Simpan & Publikasikan'}
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
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  input: {
    marginTop: 12,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  facilityInput: {
    flex: 1,
  },
  facilityButton: {
    marginTop: 0,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    marginRight: 4,
  },
  submit: {
    marginTop: 24,
  },
});