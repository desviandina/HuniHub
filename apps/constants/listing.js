export const PROPERTY_CATEGORIES = {
  KOST: 'kost',
  HOMESTAY: 'homestay',
  SEWA_RUMAH: 'rumah',
};

export const LISTING_TYPES = [
  { value: PROPERTY_CATEGORIES.KOST, label: 'Kost' },
  { value: PROPERTY_CATEGORIES.HOMESTAY, label: 'Homestay' },
  { value: PROPERTY_CATEGORIES.SEWA_RUMAH, label: 'Sewa Rumah' },
];

export const AVAILABILITY_STATUS = {
  AVAILABLE: 'Tersedia',
  UNAVAILABLE: 'Tidak Tersedia',
  RENTING_PROCESS: 'Dalam Proses Penyewaan',
};

export const RENTAL_DURATIONS = [
  { value: 'bulan', label: 'Per Bulan' },
  { value: 'hari', label: 'Per Hari' },
  { value: 'tahun', label: 'Per Tahun' },
];

export const RENTAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
};

export const RENTAL_STATUS_LABEL = {
  [RENTAL_STATUS.PENDING]: 'Menunggu',
  [RENTAL_STATUS.ACCEPTED]: 'Disetujui',
  [RENTAL_STATUS.REJECTED]: 'Ditolak',
  [RENTAL_STATUS.CANCELED]: 'Dibatalkan',
  [RENTAL_STATUS.COMPLETED]: 'Selesai',
};
