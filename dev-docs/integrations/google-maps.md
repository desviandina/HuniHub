# Google Maps Integration — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/integrations/_template.md`.
> **Related:** MODULE_MAP (location & maps) · ADR 003 & ADR 004 · dev-docs/ai/KNOWN_ISSUES.md

---

## Service Identity

| Item | Detail |
|------|--------|
| Provider | Google Maps Platform |
| Purpose | Tampilkan posisi hunian dalam ListingDetailScreen & pilih lokasi saat buat/atur listing |
| Docs URL | https://developers.google.com/maps/documentation/react-native |
| SDK/Package | `react-native-maps` (^1.27) |

---

## Authentication

| Item | Detail |
|------|--------|
| Method | API Key (Android) + optional iOS key |
| Location | `apps/services/locationService.js` |
| `.env` Key | `GOOGLE_MAPS_ANDROID_API_KEY`, `GOOGLE_MAPS_IOS_API_KEY` |
| `.env.example` | `=` placeholder |

---

## Connection

| Item | Detail |
|------|--------|
| Base URL | native module `react-native-maps` (offline tiles / Google via key) |
| Mode | **NON-AKTIF (default)** — `MAPS_ENABLED=false`; demo pakai statis + jarak haversine dari `services/mockData.js` |

---

## Error Handling

| Scenario | Behavior | User Message |
|----------|----------|-------------|
| Key tidak diisi | tampil placeholder (statis) | tanpa pesan — mock mode |
| Maps tidak support di Expo Go | sembunyikan fitur peta | tanpa pesan |

**Fallback:** `MAPS_ENABLED=false` → tampilkan detail posisi statis + `formatters.js` untuk verifikasi jarak (no live map).

---

## Testing

**Mock:** hitung jarak via haversine — diverifikasi via unit test di `utils/formatters.js`.

**Live/sandbox:** butuh dev build dengan Maps native + key valid (lihat KNOWN_ISSUES).
