export const LISTING_TYPES = [
  { value: 'homestay', label: 'Homestay' },
  { value: 'rumah', label: 'Rumah Sewa' },
  { value: 'kost', label: 'Kost' },
];

export const RENTAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
};

export const RENTAL_STATUS_LABEL = {
  [RENTAL_STATUS.PENDING]: 'Menunggu',
  [RENTAL_STATUS.ACCEPTED]: 'Disetujui',
  [RENTAL_STATUS.REJECTED]: 'Ditolak',
  [RENTAL_STATUS.CANCELED]: 'Dibatalkan',
};