# Product Requirements Document — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/prd.md`. Sumber utama: `planning/PROJECT_BRIEF.md`.

---

## 1. Product Vision

### Elevator Pitch

HuniHub adalah platform mobile penyewaan hunian (homestay, rumah sewa, kost) dalam satu aplikasi — pencari hunian dapat mencari, membandingkan, dan menyewa; pemilik dapat memasarkan dan mengelola hunian serta permintaan sewa.

### Problem Statement

Pencari hunian kesulitan menemukan hunian yang cocok karena informasi tersebar dan sering tidak lengkap; pemilik kesulitan menjangkau calon penyewa. Belum ada proses penyewaan yang terpusat dan praktis.

### Target Users

| Role | Deskripsi | Kebutuhan Utama |
|------|----------|----------------|
| Pencari Hunian (`seeker`) | Butuh tempat tinggal untuk liburan, kuliah, atau kerja luar kota | Cari berdasarkan jenis/lokasi/harga, lihat info lengkap + jarak, ajukan sewa, riwayat |
| Pemilik Hunian (`owner`) | Punya kost, rumah sewa, atau homestay | Pasarkan hunian, kelola info & harga, tanggapi permintaan sewa |

---

## 2. User Stories / Use Cases

### Epic 1: Autentikasi & Peran

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-001 | Sebagai pengguna, saya ingin mendaftar dengan email & password agar memiliki akun | P0 | Register menerima nama, email, password >= 6, pilihan role; data profil tersimpan |
| US-002 | Sebagai pengguna, saya ingin masuk dengan email & password agar mengakses fitur | P0 | Login valid -> masuk; salah -> pesan error |
| US-003 | Sebagai pengguna, saya ingin masuk dengan Google agar lebih cepat | P0 | Google Sign-In berhasil dan profil tersimpan (butuh config + dev build) |
| US-004 | Sebagai pengguna, saya ingin memilih peran saat daftar agar konten sesuai | P0 | Role seeker/owner terpilih di halaman daftar, tersimpan, tidak bisa diubah |
| US-005 | Sebagai pengguna, saya ingin keluar dari akun agar aman | P0 | Tombol Keluar di Profil menghapus sesi |

### Epic 2: Pencarian & Detail Hunian

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-006 | Sebagai pencari hunian, saya ingin melihat daftar hunian agar menemukan pilihan | P0 | Beranda menampilkan daftar hunian tersedia |
| US-007 | Sebagai pencari, saya ingin memfilter jenis/lokasi/harga agar hasil sesuai | P0 | Filter jenis (chip), kata kunci kota, harga maksimal, urutan; hasil ter-update |
| US-008 | Sebagai pencari, saya ingin melihat detail (foto, harga, fasilitas, deskripsi) agar tahu kondisi hunian | P0 | Halaman detail menampilkan semua info |
| US-009 | Sebagai pencari, saya ingin melihat lokasi & jarak hunian agar mempertimbangkan lokasi | P0 | Detail menampilkan jarak; peta Google Maps menampilkan marker |
| US-010 | Sebagai pencari, saya ingin melihat rating ulasan agar yakin sebelum sewa | P0 | Bagian Rating & Ulasan tampil di detail |

### Epic 3: Sewa & Riwayat

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-011 | Sebagai pencari, saya ingin mengajukan sewa agar permintaan diterima pemilik | P0 | Form tanggal mulai + durasi, hitung total, kirim permintaan status pending |
| US-012 | Sebagai pencari, saya ingin melihat riwayat permintaan sewa agar tahu status | P1 | Tab Riwayat menampilkan daftar permintaan + status (menunggu/disetujui/ditolak) |
| US-013 | Sebagai pencari, saya ingin memberi ulasan agar membantu pengguna lain | P0 | Form rating + komentar tersimpan ke listing |

### Epic 4: Kelola Hunian & Permintaan (Pemilik)

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-014 | Sebagai pemilik, saya ingin menambah hunian agar dipasarkan | P0 | Form nama, jenis, harga, lokasi, fasilitas, deskripsi -> Simpan -> tampil di daftar |
| US-015 | Sebagai pemilik, saya ingin mengelola (edit/hapus) hunian agar info selalu sesuai | P0 | Edit mengupdate data; hapus menghapus dengan konfirmasi |
| US-016 | Sebagai pemilik, saya ingin melihat permintaan sewa agar tahu penyewa | P0 | Tab Permintaan menampilkan permintaan masuk |
| US-017 | Sebagai pemilik, saya ingin menerima/menolak permintaan agar memutuskan | P0 | Terima/Tolak mengubah status dan terlihat penyewa |
| US-018 | Sebagai pemilik, saya ingin melihat ringkasan hunian & permintaan agar mudah memantau | P0 | Dashboard menampilkan jumlah hunian, pending, disetujui |

### Epic 5: Notifikasi & Profil

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|-------------------|
| US-019 | Sebagai pengguna, saya ingin melihat notifikasi agar tahu update | P1 | Tab Notifikasi menampilkan daftar, item belum dibaca ditandai |
| US-020 | Sebagai pengguna, saya ingin melihat profil saya & keluar | P1 | Profil menampilkan nama, email, role, dan tombol Keluar |

---

## 3. Feature List

### MVP (Minimum Viable Product)

| # | Fitur | Deskripsi | Epic |
|---|-------|----------|------|
| 1 | Login & Register (Email/Password + Google) | Auth Firebase + sesi lokal | Epic 1 |
| 2 | Pilih Akun (Pencari/Pemilik) | Role binding saat daftar | Epic 1 |
| 3 | Cari & Filter Hunian | Jenis, kota, harga, urutan | Epic 2 |
| 4 | Lihat Detail Hunian | Foto, harga, fasilitas, deskripsi | Epic 2 |
| 5 | Informasi Lokasi & Jarak | Jarak dari tujuan | Epic 2 |
| 6 | Peta Lokasi Hunian | Google Maps marker | Epic 2 |
| 7 | Ajukan Sewa | Tanggal, durasi, total, kirim permintaan | Epic 3 |
| 8 | Tambah Hunian | Form + fasilitas + simpan | Epic 4 |
| 9 | Kelola Hunian | Edit/hapus listing milik pemilik | Epic 4 |
| 10 | Kelola Permintaan Sewa | Terima/tolak permintaan | Epic 4 |
| 11 | Riwayat Penyewaan | Status permintaan (seeker) | Epic 3 |
| 12 | Profil Pengguna | Info akun + keluar | Epic 5 |
| 13 | Notifikasi | In-app notification list | Epic 5 |
| 14 | Rating & Ulasan | Rating + komentar pada listing | Epic 2 |

### Post-MVP / Future

| # | Fitur | Deskripsi | Prioritas |
|---|-------|----------|----------|
| 1 | Chat Pemilik & Penyewa | Pesan antar pengguna | Low |
| 2 | Pembayaran Online | Integrasi payment gateway | Low |
| 3 | Upload foto via Firebase Storage | Pengganti URL mock | Medium |
| 4 | Push Notification (FCM) | Notifikasi real-time | Medium |
| 5 | Rekomendasi AI | Rekomendasi hunian | Low |
| 6 | Peta interaktif kompleks | Cluster, radius search | Low |

---

## 4. Constraints & Assumptions

### Constraints

- Android-only (target dev).
- Firebase config & Maps key belum tersedia -> aplikasi berjalan mode mock dulu.
- Google Sign-In butuh development build (tidak berjalan di Expo Go).
- Tim = 1 developer mahasiswa.

### Assumptions

- User sudah punya Node.js (v24) dan bisa menjalankan Expo.
- Git belum terinstal -> repo git di `apps/` ditunda sampai user menginstal.
- Data mock memadai untuk demo sebelum Firebase diaktifkan.

---

## 5. Success Metrics

| Metric | Target | Cara Ukur |
|--------|--------|----------|
| Android bundle tanpa error | 100% | `npx expo export --platform android` |
| Semua fitur MVP bisa dijalankan mode mock | 100% | Test manual alur login -> cari -> detail -> ajukan sewa; pemilik tambah/kelola/konfirmasi |
| Switch ke Firebase lancar | 100% | Isi .env -> service otomatis pakai Firebase (auth + CRUD) |

---

## 6. Out of Scope

- Chat antar pengguna
- Pembayaran online
- Rekomendasi AI
- Membership & Voucher/Promo
- Peta interaktif kompleks
- Aplikasi web / admin panel
- Fitur multi-bahasa (Indonesia first)