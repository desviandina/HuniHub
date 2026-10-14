export function formatRupiah(value) {
  if (value == null) {
    return '-';
  }
  return 'Rp ' + Number(value).toLocaleString('id-ID');
}

export function formatDistance(km) {
  if (km == null) {
    return '-';
  }
  if (km < 1) {
    return Math.round(km * 1000) + ' m';
  }
  return km.toFixed(1) + ' km';
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}