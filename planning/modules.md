# Module Breakdown — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/modules.md`.

---

## Project Type Declaration

| Item | Value |
|------|-------|
| Project Type | Monolith (mobile app, Firebase BaaS) |

---

## 1. Module Map

| # | Module | Deskripsi | Repo | Priority | Dependencies |
|---|--------|----------|------|----------|-------------|
| 1 | Auth & Role | Login, register, pilih role, sesi, logout | apps | P0 | — |
| 2 | Listings | Daftar, cari, filter, detail, tambah, edit, hapus | apps | P0 | Auth |
| 3 | Location & Maps | Jarak (haversine), peta marker | apps | P0 | Listings |
| 4 | Rental Requests | Ajukan sewa, kelola (terima/tolak), riwayat | apps | P0 | Listings, Auth |
| 5 | Reviews | Rating & ulasan per listing | apps | P0 | Listings, Rental Requests |
| 6 | Notifications | Daftar notifikasi in-app, tandai dibaca | apps | P1 | Auth |
| 7 | Profile | Info akun, keluar | apps | P1 | Auth |

**Priority:** P0 = MVP wajib, P1 = penting, P2 = nice to have

---

## 2. Module Detail

### Module: Auth & Role

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | `Login`, `Register` (AuthNavigator) |
| Guard | RootNavigator memilih navigator berdasarkan role |

**Key Screens:**

| Screen | Fungsi |
|--------|--------|
| `screens/auth/LoginScreen.js` | Email/password + Google + pilih role |
| `screens/auth/RegisterScreen.js` | Daftar dengan role binding |

**Key Services:** `services/authService.js`, `context/AuthContext.js`
**External Dependencies:** Firebase Auth, @react-native-google-signin/google-signin, AsyncStorage

---

### Module: Listings

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | Tab `Beranda`, `Cari`, stack `ListingDetail`, `AddEditListing` |

**Key Screens:**

| Screen | Fungsi |
|--------|--------|
| `screens/seeker/HomeScreen.js` | Daftar hunian + quick filter |
| `screens/seeker/SearchScreen.js` | Filter jenis/kota/harga/urutan |
| `screens/seeker/ListingDetailScreen.js` | Detail + fasilitas + peta + ulasan + ajukan sewa |
| `screens/owner/ManageListingsScreen.js` | Kelola (edit/hapus) hunian |
| `screens/owner/AddEditListingScreen.js` | Form tambah/edit hunian |
| `screens/owner/DashboardScreen.js` | Ringkasan pemilik |

**Key Components:** `components/ListingCard.js`, `components/EmptyState.js`
**Key Services:** `services/listingService.js`
**External Dependencies:** Firestore SDK

---

### Module: Location & Maps

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | Bagian dari `ListingDetail` |

**Key Services:** `services/locationService.js` (haversine), `config/environment.js` (MAPS_ENABLED)
**External Dependencies:** react-native-maps

---

### Module: Rental Requests

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | `RentalRequestForm`, tab `Riwayat` (seeker), tab `Permintaan` (owner) |

**Key Screens:**

| Screen | Fungsi |
|--------|--------|
| `screens/seeker/RentalRequestFormScreen.js` | Form tanggal + durasi + total |
| `screens/shared/RentalHistoryScreen.js` | Riwayat status (seeker) |
| `screens/owner/RentalRequestsScreen.js` | Terima/tolak permintaan |

**Key Services:** `services/rentalService.js`

---

### Module: Reviews

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | Bagian dari `ListingDetail` |

**Key Services:** `services/reviewService.js`
**External Dependencies:** Firestore SDK

---

### Module: Notifications

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | Tab `Notifikasi` |

**Key Screens:** `screens/shared/NotificationsScreen.js`
**Key Services:** `services/notificationService.js`

---

### Module: Profile

| Item | Detail |
|------|--------|
| Repo | apps |
| Route | Tab `Profil` |

**Key Screens:** `screens/shared/ProfileScreen.js`

---

## 3. Dependency Graph

```text
Auth & Role ──> Listings (ownerId, guard) ──> Rental Requests ──> Reviews
                     └──> Location & Maps
Auth & Role ──> Notifications
Auth & Role ──> Profile
```

---

## 4. Build Order

| Phase | Modul | Repo | Urutan | Alasan |
|-------|-------|------|--------|--------|
| 1 | Auth & Role | apps | Dasar | Semua modul butuh sesi + role |
| 2 | Listings (baca) | apps | Setelah auth | Beranda, cari, detail |
| 3 | Location & Maps | apps | Setelah detail ada | Butuh data listing |
| 4 | Listings (tulis) | apps | Setelah baca stabil | Dashboard, tambah, kelola |
| 5 | Rental Requests | apps | Setelah listings | Butuh listing + auth |
| 6 | Reviews | apps | Setelah rental | Butuh listing |
| 7 | Notifications & Profile | apps | Akhir | Pelengkap |
| 8 | Firebase integration | apps | Saat config siap | Ganti mock -> Firebase |