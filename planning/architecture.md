# Architecture Plan — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/architecture.md`.

---

## Project Type Declaration

| Item | Value |
|------|-------|
| Project Type | Monolith (mobile app; backend = Firebase BaaS) |
| Git Location | `apps/` (single repo) — git masih ditunda |

---

## 1. Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|----------|
| Framework | React Native (Expo) | SDK 57 | Mudah setup, Expo Go untuk uji cepat, target Android |
| Bahasa | JavaScript | ES2020+ | Keputusan user (tanpa TypeScript) |
| Navigasi | React Navigation | v7 | Standar de facto RN; native-stack + bottom-tabs |
| UI | React Native Paper | v5 (MD3) | Komponen Material lengkap & ringan di Expo |
| Ikon | @expo/vector-icons (MaterialCommunityIcons) | — | Kompatibel Expo Go (font dinamis) |
| Database | Firebase Firestore | v12 SDK (2026) | NoSQL real-time, cocok BaaS, tanpa server |
| Auth | Firebase Authentication | v12 SDK | Email/Password + Google |
| Storage | Firebase Storage | v12 SDK | Foto hunian (MVP: URL mock) |
| Maps | react-native-maps | 1.27 | Google Maps Android marker |
| Local Storage | AsyncStorage | 2.2 | Sesi login (mock offline) |
| State | React Context + hooks | React 19 | Skala kecil, tanpa reducer library |

---

## 2. System Design

### Architecture Pattern

Layered / Service-based (mobile) — UI -> Context -> Service -> (Mock | Firebase)

**Alasan:** service layer memisahkan UI dari sumber data, sehingga aplikasi bisa berjalan dengan mock data sebelum Firebase dikonfigurasi dan swap ke Firebase tanpa mengubah UI.

### High-Level Diagram

```text
[ Expo App (Android) ]
        |
+-------+-----------------------------------+
| App.js  (PaperProvider + Navigation)     |
|   Navigation (Auth / Seeker / Owner)     |
|   Screens  (auth, seeker, owner, shared) |
|   Context  (AuthContext)                 |
|   Services (auth, listing, rental,        |
|             review, notification, location)|
|             |-> FIREBASE_ENABLED ?        |
|             |    Firebase SDK (Auth,      |
|             |    Firestore, Storage, Maps)|
|             |-> Mock data (AsyncStorage)  |
+-------+-----------------------------------+
```

---

## 3. Component Breakdown

| Komponen | Tipe | Tanggung Jawab | Teknologi |
|----------|------|---------------|----------|
| Mobile App | Frontend | Semua UI + logika bisnis | Expo RN + Paper |
| Auth Service | Library | Auth email/Google + sesi | Firebase Auth + AsyncStorage |
| Data Service | Library | CRUD listing/rental/review/notif | Firestore SDK |
| Maps | Library | Menampilkan lokasi hunian | react-native-maps |
| Mock Layer | Library | Data sementara sebelum Firebase aktif | AsyncStorage |

---

## 4. Routing & Middleware Strategy

**Navigation flow:**

```text
RootNavigator
 ├── AuthNavigator (Login -> Register)
 └── AppNavigator
      ├── SeekerNavigator (tabs) | OwnerNavigator (tabs)
      ├── ListingDetail
      ├── RentalRequestForm
      └── AddEditListing
```

- Role guard: RootNavigator memilih navigator berdasarkan `user.role`.
- Screen-specific guard: tombol Ajukan Sewa hanya untuk `seeker`; formulir kelola hanya untuk `owner` (via navigasi internal).
- Firestore Security Rules memegang otorisasi server-side (akan dibuat saat Firebase aktif).

---

## 5. Data Flow

```text
[Form Search] -> service.searchListings(filters)
                   -> Firebase: collection('listings') + where/orderBy
                   -> Mock: filter mockListings
[Detail] -> getListingById(id) -> listing
[Ajukan Sewa] -> createRentalRequest({...}) -> rentalRequests (status pending)
[Pemilik Terima] -> updateRequestStatus(id, accepted)
[Ulasan] -> addReview({rating, comment}) -> reviews
```

---

## 6. Security Plan

| Area | Strategy |
|------|----------|
| Authentication | Firebase Auth (email/password + Google); token dikelola SDK |
| Authorization | Role di `profiles.role`; guard di UI + Firestore rules (seeker hanya baca listing; owner hanya tulis listing miliknya & permintaan masuk) |
| Credential | SEMUA di `.env` (EXPO_PUBLIC_*), tidak di hardcode; `.env.example` menyediakan placeholder |
| Input Validation | Validasi form di sisi client (email format, password >= 6, required fields, numerik) |
| Data Access | Firestore rules berbasis UID pemilik (rules disiapkan di fase Firebase) |
| File Upload | (fase berikutnya) Validasi MIME + batas ukuran di client sebelum upload Storage |

---

## 7. Deployment Architecture

| Environment | Server | Domain | Branch |
|------------|--------|--------|--------|
| Local dev | Expo Go / emulator | — | dev / feat/* |
| Testing | Expo dev build (APK) | — | dev |
| Production | Expo EAS Build (APK) | Play Store (future) | main |

Note: git repo ditunda (belum ada .git di apps/). Saat git aktif: semua kerja di branch `dev`/`feat/*`, `main` untuk rilis.

---

## 8. Key Decisions

| # | Keputusan | Alasan | ADR |
|---|----------|--------|-----|
| 1 | Role binding saat daftar (tidak bisa diubah) | Kebutuhan user; menyederhanakan authz | dev-docs/decisions/001-binding-role-saat-daftar.md |
| 2 | MVP = Must + Should + Rating | Fokus rilis pertama; chat/payment ditunda | dev-docs/decisions/002-cakupan-mvp.md |
| 3 | Service layer + mock mode default | Skeleton bisa jalan tanpa Firebase | dev-docs/decisions/003-service-layer-dan-mock.md |
| 4 | UI = React Native Paper + @expo/vector-icons | Kompatibel Expo Go, komponen lengkap | dev-docs/decisions/004-ui-library.md |