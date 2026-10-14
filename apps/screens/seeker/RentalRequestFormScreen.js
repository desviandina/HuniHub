import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getListingById } from '../../services/listingService';
import { createRentalRequest } from '../../services/rentalService';
import { formatRupiah } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export default function RentalRequestFormScreen({ route, navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { listingId } = route.params;
  const [listing, setListing] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    getListingById(listingId).then(setListing);
  }, [listingId]);

  const handleSubmit = async () => {
    if (!startDate) {
      setError('Tanggal mulai sewa wajib diisi (contoh: 2026-06-01).');
      return;
    }
    const days = Number(durationDays) || 1;
    setError('');
    setLoading(true);
    try {
      await createRentalRequest({
        listingId,
        seekerId: user.uid,
        ownerId: listing.ownerId,
        listingTitle: listing.title,
        startDate,
        durationDays: days,
        totalPrice: listing.price * days,
      });
      setSnackbar('Permintaan sewa berhasil dikirim ke pemilik!');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      setError('Gagal mengirim permintaan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const total = listing ? listing.price * (Number(durationDays) || 1) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Listing Preview Header */}
      <View style={styles.previewCard}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="home-heart" size={24} color="#0D9488" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.previewTitle} numberOfLines={1}>
            {listing?.title || 'Memuat hunian...'}
          </Text>
          <Text style={styles.previewPrice}>
            {formatRupiah(listing?.price)} <Text style={styles.previewMonth}>/bulan</Text>
          </Text>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Jadwal Sewa</Text>

        <TextInput
          label="Tanggal Mulai Sewa (YYYY-MM-DD)"
          placeholder="2026-06-01"
          value={startDate}
          onChangeText={setStartDate}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          style={styles.input}
          left={<TextInput.Icon icon="calendar" color="#0D9488" />}
        />

        <TextInput
          label="Durasi Sewa (Bulan)"
          placeholder="1"
          value={durationDays}
          onChangeText={setDurationDays}
          mode="outlined"
          outlineColor="#E2E8F0"
          activeOutlineColor="#0D9488"
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="clock-outline" color="#0D9488" />}
        />
      </View>

      {/* Cost Breakdown */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Rincian Biaya</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tarif Bulanan</Text>
          <Text style={styles.summaryVal}>{formatRupiah(listing?.price)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Durasi Sewa</Text>
          <Text style={styles.summaryVal}>{durationDays || 1} Bulan</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRowTotal}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalVal}>{formatRupiah(total)}</Text>
        </View>
      </View>

      {error ? <HelperText type="error" visible style={{ marginTop: 8 }}>{error}</HelperText> : null}

      <Button
        mode="contained"
        buttonColor="#0D9488"
        textColor="#FFFFFF"
        loading={loading}
        onPress={handleSubmit}
        style={styles.submitBtn}
        labelStyle={styles.btnLabel}
      >
        Ajukan Sewa Sekarang
      </Button>

      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar('')}>
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D9488',
    marginTop: 2,
  },
  previewMonth: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '400',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D9488',
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 2,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});