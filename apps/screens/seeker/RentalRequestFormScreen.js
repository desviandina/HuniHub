import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import {
  Text,
  Button,
  HelperText,
  useTheme,
  Snackbar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getListingById } from '../../services/listingService';
import { createRentalRequest, checkDuplicateRequest } from '../../services/rentalService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const pad = (n) => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function addMonthsToDateStr(dateStr, months) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + months);
  return toDateStr(date);
}

function calculateDateRangeInfo(startStr, endStr) {
  if (!startStr || !endStr) {
    return { days: 30, months: 1, label: '1 Bulan (30 Hari)' };
  }
  const [y1, m1, d1] = startStr.split('-').map(Number);
  const [y2, m2, d2] = endStr.split('-').map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  const diffTime = end.getTime() - start.getTime();
  const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  let label = '';
  const monthsExact = days / 30;
  if (days >= 30) {
    const m = Math.floor(days / 30);
    const remDays = days % 30;
    label = remDays > 0 ? `${m} Bulan ${remDays} Hari` : `${m} Bulan`;
  } else {
    label = `${days} Hari`;
  }

  return { days, months: Math.max(1, Math.round(monthsExact)), label };
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DURATION_PRESETS = [
  { label: '1 Bulan', months: 1 },
  { label: '3 Bulan', months: 3 },
  { label: '6 Bulan', months: 6 },
  { label: '1 Tahun', months: 12 },
];

export default function RentalRequestFormScreen({ route, navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { listingId } = route.params;
  const [listing, setListing] = useState(null);

  // Today initial date
  const todayStr = useMemo(() => toDateStr(new Date()), []);
  const initialEndStr = useMemo(() => addMonthsToDateStr(todayStr, 1), [todayStr]);

  // Date Range State
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(initialEndStr);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-11

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    getListingById(listingId).then(setListing);
  }, [listingId]);

  // Duration calculation
  const rangeInfo = useMemo(() => {
    return calculateDateRangeInfo(startDate, endDate);
  }, [startDate, endDate]);

  // Total price based on months or partial days
  const totalPrice = useMemo(() => {
    if (!listing) return 0;
    const monthlyPrice = Number(listing.price) || 0;
    if (rangeInfo.days <= 30) {
      return monthlyPrice;
    }
    const months = rangeInfo.days / 30;
    return Math.round(monthlyPrice * months);
  }, [listing, rangeInfo.days]);

  // Quick preset duration handler
  const handleSelectPreset = (months) => {
    const baseStart = startDate || todayStr;
    const newEnd = addMonthsToDateStr(baseStart, months);
    setStartDate(baseStart);
    setEndDate(newEnd);
  };

  // Calendar Day Click Handler
  const handleDayPress = (day) => {
    const clickedDateStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;

    // If both are selected or none is selected, start new range
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDateStr);
      setEndDate('');
    } else if (startDate && !endDate) {
      if (clickedDateStr < startDate) {
        // If clicked date is before start date, set as new start date
        setStartDate(clickedDateStr);
      } else {
        setEndDate(clickedDateStr);
      }
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalYear((prev) => prev - 1);
      setCalMonth(11);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalYear((prev) => prev + 1);
      setCalMonth(0);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  // Calendar Grid Data
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 is Sun

    const cells = [];
    // Leading empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [calYear, calMonth]);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Silakan pilih rentang tanggal mulai dan tanggal selesai sewa.');
      return;
    }

    // Validasi: tanggal mulai tidak boleh di masa lalu
    if (startDate < todayStr) {
      setError('Tanggal mulai tidak boleh di masa lalu. Silakan pilih tanggal hari ini atau yang akan datang.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Cek duplikat permintaan yang masih pending
      const isDuplicate = await checkDuplicateRequest(user?.uid, listingId);
      if (isDuplicate) {
        setError('Anda sudah memiliki permintaan sewa yang sedang menunggu konfirmasi untuk hunian ini.');
        setLoading(false);
        return;
      }

      await createRentalRequest({
        listingId,
        seekerId: user?.uid || 'u1',
        seekerName: user?.name || 'Penyewa',
        ownerId: listing.ownerId,
        listingTitle: listing.title,
        startDate,
        endDate,
        durationDays: rangeInfo.days,  // FIX: gunakan .days bukan .months
        totalPrice,
      });
      setSnackbar('Pengajuan sewa berhasil dikirim ke pemilik hunian!');
      setTimeout(() => navigation.goBack(), 1400);
    } catch (err) {
      setError('Gagal mengirim permintaan sewa. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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

      {/* SECTION: JADWAL SEWA (RENTANG TANGGAL) */}
      <View style={styles.formSection}>
        <View style={styles.sectionHeaderRow}>
          <MaterialCommunityIcons name="calendar-range" size={20} color="#0D9488" />
          <Text style={styles.sectionHeading}>Rentang Tanggal Sewa</Text>
        </View>
        <Text style={styles.sectionSub}>
          Pilih tanggal mulai (check-in) dan tanggal selesai (check-out) langsung pada kalender.
        </Text>

        {/* Visual Date Range Display Card */}
        <View style={styles.rangeDisplayCard}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateBlockLabel}>TANGGAL MULAI</Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-arrow-right" size={18} color="#0D9488" />
              <Text style={styles.dateBlockValue}>{formatDate(startDate)}</Text>
            </View>
            <Text style={styles.dateBlockHint}>Check-in</Text>
          </View>

          <View style={styles.rangeDividerLine}>
            <MaterialCommunityIcons name="arrow-right-thin" size={24} color="#0D9488" />
          </View>

          <View style={styles.dateBlock}>
            <Text style={styles.dateBlockLabel}>TANGGAL SELESAI</Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-check" size={18} color="#0D9488" />
              <Text style={styles.dateBlockValue}>
                {endDate ? formatDate(endDate) : 'Pilih di kalender'}
              </Text>
            </View>
            <Text style={styles.dateBlockHint}>Check-out</Text>
          </View>
        </View>

        {/* Duration Pill Badge */}
        <View style={styles.durationPill}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#0F766E" />
          <Text style={styles.durationPillText}>Total Durasi: {rangeInfo.label}</Text>
        </View>

        {/* Quick Duration Presets */}
        <Text style={styles.quickLabel}>Pilih Cepat Durasi Sewa:</Text>
        <View style={styles.presetsRow}>
          {DURATION_PRESETS.map((p) => {
            const isPresetActive =
              rangeInfo.months === p.months && endDate === addMonthsToDateStr(startDate, p.months);
            return (
              <Chip
                key={p.label}
                selected={isPresetActive}
                onPress={() => handleSelectPreset(p.months)}
                style={[styles.presetChip, isPresetActive && styles.presetChipActive]}
                textStyle={{
                  color: isPresetActive ? '#0F766E' : '#475569',
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {p.label}
              </Chip>
            );
          })}
        </View>

        {/* INTERACTIVE CALENDAR VIEW */}
        <View style={styles.calendarCard}>
          {/* Calendar Month Header */}
          <View style={styles.calHeader}>
            <IconButton
              icon="chevron-left"
              size={22}
              iconColor="#0F172A"
              onPress={handlePrevMonth}
            />
            <Text style={styles.calMonthTitle}>
              {MONTH_NAMES[calMonth]} {calYear}
            </Text>
            <IconButton
              icon="chevron-right"
              size={22}
              iconColor="#0F172A"
              onPress={handleNextMonth}
            />
          </View>

          {/* Day of Week Labels */}
          <View style={styles.dayLabelsRow}>
            {DAY_LABELS.map((d, idx) => (
              <Text
                key={d}
                style={[
                  styles.dayLabelText,
                  idx === 0 && { color: '#EF4444' }, // Red for Sunday
                ]}
              >
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Days Grid */}
          <View style={styles.daysGrid}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <View key={'empty-' + index} style={styles.dayCell} />;
              }

              const cellDateStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
              const isStart = cellDateStr === startDate;
              const isEnd = cellDateStr === endDate;
              const isInRange =
                startDate && endDate && cellDateStr > startDate && cellDateStr < endDate;
              const isToday = cellDateStr === todayStr;
              const isPast = cellDateStr < todayStr;

              return (
                <Pressable
                  key={cellDateStr}
                  onPress={() => !isPast && handleDayPress(day)}
                  style={[
                    styles.dayCell,
                    isInRange && styles.dayCellInRange,
                    isStart && styles.dayCellStart,
                    isEnd && styles.dayCellEnd,
                    isPast && styles.dayCellPast,
                  ]}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      (isStart || isEnd) && styles.dayCircleSelected,
                      isToday && !isStart && !isEnd && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        (isStart || isEnd) && styles.dayNumberSelected,
                        isToday && !isStart && !isEnd && styles.dayNumberToday,
                        isPast && styles.dayNumberPast,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* COST BREAKDOWN CARD */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Rincian Biaya Sewa</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tarif Hunian</Text>
          <Text style={styles.summaryVal}>{formatRupiah(listing?.price)} /bulan</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Periode Sewa</Text>
          <Text style={styles.summaryVal}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Durasi</Text>
          <Text style={styles.summaryVal}>{rangeInfo.label}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRowTotal}>
          <View>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalSub}>Sesuai durasi rentang tanggal</Text>
          </View>
          <Text style={styles.totalVal}>{formatRupiah(totalPrice)}</Text>
        </View>
      </View>

      {error ? (
        <HelperText type="error" visible style={{ marginTop: 8 }}>
          {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        buttonColor="#0D9488"
        textColor="#FFFFFF"
        loading={loading}
        onPress={handleSubmit}
        style={styles.submitBtn}
        labelStyle={styles.btnLabel}
      >
        Ajukan Sewa ({rangeInfo.label})
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
    paddingBottom: 48,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 18,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  rangeDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  dateBlock: {
    flex: 1,
  },
  dateBlockLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateBlockValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateBlockHint: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 2,
  },
  rangeDividerLine: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  durationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  // Calendar Card
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calMonthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 6,
  },
  dayLabelText: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellInRange: {
    backgroundColor: '#F0FDFA',
  },
  dayCellStart: {
    backgroundColor: '#F0FDFA',
    borderTopLeftRadius: 21,
    borderBottomLeftRadius: 21,
  },
  dayCellEnd: {
    backgroundColor: '#F0FDFA',
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
  },
  dayCellPast: {
    opacity: 0.35,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: '#0D9488',
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: '#0D9488',
  },
  dayNumberText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayNumberToday: {
    color: '#0D9488',
    fontWeight: '800',
  },
  dayNumberPast: {
    color: '#CBD5E1',
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginTop: 8,
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
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D9488',
  },
  submitBtn: {
    marginTop: 22,
    borderRadius: 14,
    paddingVertical: 4,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
