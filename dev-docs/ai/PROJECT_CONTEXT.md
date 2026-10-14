# PROJECT_CONTEXT

> **Status:** OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/PROJECT_CONTEXT-template.md`.
> **Purpose:** Overview sistem, stack teknologi, dan struktur project.

---

## System Overview

HuniHub adalah aplikasi mobile Android untuk penyewaan hunian (homestay, rumah sewa, kost). Aplikasi mempertemukan pencari hunian dengan pemilik hunian dalam satu platform: pencarian, filter, detail + peta, pengajuan sewa, kelola hunian, dan kelola permintaan.

Pengguna terbagi menjadi dua role: Pencari Hunian (`seeker`) dan Pemilik Hunian (`owner`). Role dipilih saat pendaftaran dan bersifat tetap.

Secara teknis, HuniHub adalah aplikasi React Native (Expo SDK 57, JavaScript) yang memakai Firebase sebagai backend (Authentication + Firestore + Storage) serta Google Maps untuk peta. Skeleton saat ini berjalan dalam mode mock (data dari AsyncStorage) sampai konfigurasi Firebase terisi.

---

## Project Type Declaration

| Item | Value |
|------|-------|
| Project Type | Monolith (mobile app; backend = Firebase BaaS) |
| Git Location | `apps/` (single repo) — git BELUM di-init |

---

## Runtime Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 57), JavaScript |
| Frontend UI | React Native Paper v5 (Material Design 3) |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| Database Primary | Firebase Firestore |
| Database Secondary | AsyncStorage (sesi + data mock) |
| Cache | Tidak ada (Firestore client cache bawaan) |
| Queue | Tidak ada |
| Search | Client-side filter (MVP) |
| Storage | Firebase Storage (fase berikutnya); saat ini URL gambar |
| Maps | react-native-maps (Google Maps, Android) |
| Build | Metro bundler (Expo) |

---

## UI/UX Template & Framework

### Template Status

| Item | Value |
|------|-------|
| Template HTML Provided? | TIDAK |
| Template Name | N/A |
| Template Version | N/A |
| Template Location | N/A |
| UI Framework | React Native Paper v5 (Material Design 3) |
| Framework Version | ^5.15.3 |
| Icon Set | @expo/vector-icons (MaterialCommunityIcons) |

### AI Rules

- WAJIB menggunakan komponen React Native Paper (Card, TextInput, Button, Chip, Dialog, Snackbar, FAB, SegmentedButtons, List, Avatar, Appbar).
- WAJIB mengikuti best practices Paper; jangan buat komponen pengganti yang sudah ada.
- DILARANG membuat design system custom dari nol; custom styling hanya bila komponen tidak tersedia.
- Ikon memakai MaterialCommunityIcons; dilarang menulis emoji di UI text.

### Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#1565C0` |
| Primary Dark | `#0D47A1` |
| Primary Light / Container | `#E3F2FD` |
| Accent | `#0288D1` |
| Background | `#F5F7FA` |
| Surface | `#FFFFFF` |
| Success / Warning / Error | `#2E7D32` / `#F9A825` / `#C62828` |

---

## Database Topology

| Connection | Domain / Schema | Notes |
|-----------|----------------|-------|
| `firestore` | `profiles`, `listings`, `rentalRequests`, `reviews`, `notifications` | Config dari `.env`; saat ini mock |
| `asyncstorage` | `hunihub_session`, `hunihub_requests`, `hunihub_reviews`, `hunihub_notifications` | Mode mock/offline |

---

## Source Structure (Important)

| Path | Function |
|------|----------|
| `apps/App.js` | Root: SafeAreaProvider > PaperProvider > NavigationContainer > AuthProvider > RootNavigator |
| `apps/index.js` | Entry Expo (`registerRootComponent`) |
| `apps/navigation/` | RootNavigator (auth gate), AuthNavigator, AppNavigator, SeekerNavigator, OwnerNavigator |
| `apps/screens/auth/` | LoginScreen, RegisterScreen |
| `apps/screens/seeker/` | Home, Search, ListingDetail, RentalRequestForm |
| `apps/screens/owner/` | Dashboard, ManageListings, AddEditListing, RentalRequests |
| `apps/screens/shared/` | RentalHistory, Notifications, Profile |
| `apps/components/` | ListingCard, EmptyState |
| `apps/services/` | auth, listing, rental, review, notification, location, mockData |
| `apps/context/` | AuthContext |
| `apps/constants/` | theme.js, roles.js, listing.js |
| `apps/config/` | environment.js (env + flags), firebase.js (init) |
| `apps/utils/` | formatters.js (rupiah, tanggal, jarak) |

---

## Current Architecture Direction

- Layered / service-based mobile architecture: UI -> Context -> Service -> (Mock | Firebase).
- Satu service layer memisahkan UI dari sumber data. `FIREBASE_ENABLED` + `MAPS_ENABLED` di `config/environment.js` menentukan mode.
- Navigasi terbagi per role melalui RootNavigator.

---

## Uncertainty Markers

- Assumption based on repository analysis: Firestore composite index akan otomatis diminta saat query filter+sort dipakai.
- Assumption based on repository analysis: react-native-maps di Expo Go memakai key bawaan Expo; key sendiri dibutuhkan untuk dev build/APK.
- Assumption based on repository analysis: Google Sign-In memerlukan development build (native module), belum teruji di Expo Go.