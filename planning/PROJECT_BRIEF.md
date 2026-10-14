# PROJECT BRIEF — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/_PROJECT_BRIEF_TEMPLATE.md`.

---

## 1. Vision

### Elevator Pitch

HuniHub adalah platform mobile penyewaan hunian (homestay, rumah sewa, dan kost) yang mempertemukan pencari hunian dengan pemilik hunian dalam satu aplikasi. Pengguna dapat mencari, membandingkan, dan menyewa hunian berdasarkan jenis, lokasi, harga, dan durasi; pemilik dapat memasarkan dan mengelola hunian serta permintaan sewa secara terpusat.

### Problem Statement

- Pencari hunian kesulitan mencari hunian yang sesuai kebutuhan (jenis, lokasi, harga) karena info tersebar di banyak platform.
- Informasi hunian sering tidak lengkap (foto, fasilitas, jarak ke tujuan) sehingga calon penyewa ragu.
- Pemilik hunian sulit menjangkau calon penyewa dan harus memasarkan ke banyak platform.
- Proses penyewaan tidak terpusat dan tidak ada jejak riwayat.

### Target Users

| Role | Deskripsi | Kebutuhan Utama |
|------|----------|----------------|
| Pencari Hunian | Individu yang butuh tempat tinggal sementara/jangka panjang (liburan, kuliah, kerja luar kota) | Menemukan hunian sesuai budget dan lokasi, melihat info lengkap + jarak, mengajukan sewa, melihat riwayat |
| Pemilik Hunian | Individu yang menyewakan kost, rumah, atau homestay | Memasarkan hunian, mengelola informasi & harga, menanggapi permintaan sewa |

---

## 2. Project Type & Tech Stack

| Item | Pilih |
|------|-------|
| Project Type | Monolith (mobile app, backend = Firebase BaaS) |
| Framework | React Native (Expo SDK 57) |
| Bahasa | JavaScript |
| Navigasi | React Navigation (native-stack + bottom-tabs) |
| UI Library | React Native Paper v5 (+ Material Community Icons via @expo/vector-icons) |
| Backend / Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Authentication (Email/Password + Google) |
| Object Storage | Firebase Storage (foto hunian) |
| Maps | react-native-maps (Google Maps, Android) |
| Storage Lokal | AsyncStorage (session, offline cache mock) |

### 2b. UI/UX Template & Design System

**Apakah ada HTML Template yang disediakan?** TIDAK

| Item | Value |
|------|-------|
| Framework UI | React Native Paper v5 (Material Design 3) |
| Warna Utama | Biru standar `#1565C0` |
| Kontras | `#0D47A1`, aksen `#0288D1`, container `#E3F2FD` |
| Latar | `#F5F7FA` (netral terang) |
| Aturan | Gunakan komponen Paper standar (Card, Appbar, FAB, Dialog, Chip). Ikon via @expo/vector-icons (MaterialCommunityIcons). Jangan buat komponen custom bila sudah ada di Paper. |

---

## 3. Core Features (MVP)

- Login & Register (Email/Password + Google)
- Pilih Akun (Pencari Hunian / Pemilik Hunian) — role mengikat saat daftar
- Cari & Filter Hunian (jenis, kota/kata kunci, harga, urutan)
- Lihat Detail Hunian (foto, harga, fasilitas, deskripsi, rating)
- Informasi Lokasi & Jarak Hunian
- Peta Lokasi Hunian (Google Maps)
- Ajukan Sewa (permintaan sewa ke pemilik)
- Tambah Hunian (form + fasilitas)
- Kelola Hunian (ubah harga/info, hapus, status ketersediaan)
- Kelola Permintaan Sewa (terima/tolak)
- Riwayat Penyewaan
- Profil Pengguna (log out, info akun)
- Notifikasi (in-app)
- Rating & Ulasan

---

## 4. Non-Goals / Out of Scope

- Chat antar pengguna (ditunda ke fase berikutnya)
- Pembayaran online (ditunda; MVP memakai konfirmasi manual pemilik)
- Rekomendasi AI
- Membership & Voucher/Promo
- Peta interaktif kompleks (cukup marker dasar)
- Website/web admin panel (mobile only)

---

## 5. User Roles & Permissions

| Role | Deskripsi | Level Akses | Module Scope |
|------|----------|------------|-------------|
| Pencari Hunian (`seeker`) | Mencari & menyewa hunian | Write (profil, permintaan, ulasan) / Read (listings) | Cari, Detail, Ajukan Sewa, Riwayat, Rating, Profil |
| Pemilik Hunian (`owner`) | Mengelola hunian & permintaan | Write (listings miliknya, status permintaan) / Read (public) | Dashboard, Tambah/Kelola Hunian, Kelola Permintaan, Profil |

**Aturan role (binding):** role dipilih saat pendaftaran dan tersimpan di profil. Tidak dapat diubah belakangan (keputusan user). Firestore rules membatasi write hanya pemilik data.

---

## 6. Core Business Logic & Rules

- JIKA pengguna mendaftar sebagai Pencari Hunian MAKA akses ke dashboard pemilik ditolak (dan sebaliknya).
- JIKA status permintaan sewa = pending MAKA hanya pemilik listing yang boleh ubah menjadi accepted/rejected.
- JIKA listing tidak tersedia (`available = false`) MAKA hunian tidak muncul di hasil pencarian dan tombol Ajukan Sewa disembunyikan.
- JIKA pemilik mengubah harga/info hunian MAKA data baru langsung tampil di halaman detail (tanpa approval).
- JIKA penyewa mengajukan sewa MAKA permintaan masuk ke daftar permintaan pemilik dengan status pending.
- JIKA pemilik menolak permintaan MAKA penyewa melihat status ditolak di riwayat.

---

## 7. Key Workflows

### Workflow: Pencarian & Penyewaan

```text
Buka app → Login/Register → (role: Pencari Hunian) → Beranda → filter/ketik kata kunci → daftar hasil → pilih hunian → Detail (foto, fasilitas, lokasi, jarak, peta) → Ajukan Sewa (tanggal + durasi) → permintaan terkirim → pemilik konfirmasi → status tampil di Riwayat
```

**Aturan:** harus login sebelum ajukan sewa. Detail & pencarian bisa diakses semua user yang login.

### Workflow: Tambah & Kelola Hunian

```text
Buka app → Login/Register → (role: Pemilik Hunian) → Dashboard → Tambah Hunian → isi nama, jenis, harga, lokasi, fasilitas, deskripsi → Simpan → muncul di daftar → Kelola (edit/hapus) → informasi terbaru tampil di publik
```

### Workflow: Kelola Permintaan Sewa

```text
Dashboard → tab Permintaan → lihat daftar pending → Terima/Tolak → status update → penyewa melihat di Riwayat
```

---

## 8. Architecture Philosophy

- **Service layer terpusat:** semua akses data lewat `services/` — UI tidak memanggil Firebase langsung. Memudahkan switch antara mock dan Firebase.
- **Mode dual:** selama Firebase config belum diisi, aplikasi berjalan dengan data mock (AsyncStorage). Setelah `.env` terisi, service otomatis memakai Firebase.
- **Mobile-first:** desain layar tunggal (Android), navigasi tab per role.

---

## 9. Core Engine / System Design

Tidak ada engine kompleks. Relasi utama: Listing -> RentalRequest -> Review.

---

## 10. Integration Points

| Service | Type | Purpose | Auth Method | Critical? |
|---------|------|---------|-----------|-----------|
| Firebase Authentication | SDK | Login/Register email+password & Google | Firebase config (.env) | Ya |
| Google Sign-In | SDK | Login Google | Web client ID | Ya |
| Firebase Firestore | SDK | Database utama | Firebase config | Ya |
| Firebase Storage | SDK | Upload foto hunian | Firebase config | Ya |
| Google Maps | SDK | Peta lokasi hunian | API key (app.json + .env) | Ya |

---

## 11. Key Architecture Decisions

- Role binding saat daftar (keputusan user) -> Firestore `profiles.role` immutable.
- MV1 (MVP) mencakup Must + Should + Rating; Chat & Pembayaran ditunda.
- Map key + Firebase config memakai placeholder di `.env.example` sampai user mengisi.

---

## 12. Success Criteria

| Metric | Target | Cara Ukur |
|--------|--------|----------|
| Aplikasi build & bundle Android sukses | 100% | `npx expo export --platform android` tidak error |
| MVP berjalan tanpa Firebase (mode mock) | Ya | Alur login → cari → detail → ajukan sewa bisa dilalui |
| Firebase terhubung (config terisi) | Ya | Auth + Firestore CRUD berfungsi |
| Semua fitur Must tampil & berfungsi | 100% | Checklist acceptance criteria di prd.md |

---

## 13. Data & References

- `FilePrd-HuniHub.md` (PRD draft awal user)

---

## 14. Timeline & Constraints

| Item | Value |
|------|-------|
| Target rilis MVP | Belum ditentukan (proyek kuliah) |
| Jumlah user (estimasi) | Kecil (< 100, uji lokal) |
| Batasan waktu | Fleksibel |
| Batasan tim | 1 developer (mahasiswa), dibantu AI |
| Batasan infrastruktur | Expo Go / dev build Android; belum ada server sendiri (Firebase BaaS) |

---

## 15. Final Goal / North Star

Membangun aplikasi Android pertama yang berfungsi penuh (MVP) untuk penyewaan hunian — dari pencarian hingga permintaan sewa dan kelola hunian — dengan alur yang praktis, jelas, dan terpercaya, siap dikembangkan bertahap.

---

## 16. Tambahan / Brain Dump

- Google Sign-In membutuhkan dev build (tidak jalan di Expo Go tanpa native module) — perlu dicatat di README.
- react-native-maps jalan di Expo Go dengan key bawaan Expo untuk Android; key sendiri dibutuhkan saat dev build/APK.
- Foto hunian pada MVP memakai URL gambar (mock) — upload Firebase Storage ditunda sampai config terisi.