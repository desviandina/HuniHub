# Wireframe / UI Plan — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/wireframe.md`.

---

## 1. Visual Identity

| Item | Detail |
|------|--------|
| Font | Default platform (Material 3 / Roboto pada Android) |
| Primary Color | `#1565C0` (biru standar) |
| Secondary Color | `#0288D1` |
| Kontras | `#0D47A1` (dark), `#E3F2FD` (container) |
| Background | `#F5F7FA` |
| Logo | `apps/assets/icon.png` (placeholder Expo, ganti nanti) |
| Ikon | MaterialCommunityIcons (@expo/vector-icons) |

---

## 2. Navigation Structure

```text
RootNavigator
├── AuthNavigator (belum login)
│   ├── Login
│   └── Register
└── AppNavigator (sudah login)
    ├── SeekerNavigator (role: seeker)  — Bottom Tabs
    │   ├── Beranda
    │   ├── Cari
    │   ├── Riwayat
    │   ├── Notifikasi
    │   └── Profil
    ├── OwnerNavigator (role: owner)    — Bottom Tabs
    │   ├── Dashboard
    │   ├── Kelola
    │   ├── Permintaan
    │   ├── Notifikasi
    │   └── Profil
    ├── ListingDetail
    ├── RentalRequestForm
    └── AddEditListing
```

---

## 3. Page Layouts

### Mobile Layout (semua halaman)

```text
┌─────────────────────────────┐
│  Header (Back/Title/Action) │
├─────────────────────────────┤
│                             │
│        Content Area         │
│      (Scroll / FlatList)    │
│                             │
├─────────────────────────────┤
│   Bottom Tab Bar (5 tab)    │
└─────────────────────────────┘
```

---

## 4. Key Page Designs

### Page: Login

Komponen: SegmentedButtons (role), TextInput Email, TextInput Password, Button Masuk, Button Google, link Daftar.
Interaksi: Submit -> validasi -> login -> masuk ke navigator sesuai role.
State: Loading (button loading), Error (HelperText), Success (pindah layar).

### Page: Register

Komponen: SegmentedButtons (role), TextInput Nama/Email/Password/Konfirmasi, Button Daftar.
State: Error validasi (password < 6, konfirmasi tidak cocok).

### Page: Beranda (seeker)

Komponen: Searchbar, Chip jenis, FlatList ListingCard, RefreshControl.
Interaksi: Ketik + submit -> tab Cari dengan keyword; tap kartu -> ListingDetail.
State: Loading, Empty ("Belum ada hunian").

### Page: Cari (seeker)

Komponen: TextInput kata kunci, Chip jenis, TextInput harga maks, SegmentedButtons urutan, Button terapkan, FlatList hasil.
State: Loading spinner, Empty ("Hunian tidak ditemukan"), Error.

### Page: Detail Hunian

Komponen: Carousel foto, Chip jenis, Judul, Harga, Lokasi + jarak, Peta (marker) / placeholder, Chip fasilitas, Deskripsi, Pemilik, Rating & Ulasan, Button Ajukan Sewa.
State: Loading, Not found, Tidak tersedia.

### Page: Ajukan Sewa

Komponen: Kartu listing, TextInput tanggal mulai, TextInput durasi (bulan), Kartu ringkasan total, Button kirim, Snackbar sukses.
Interaksi: Kirim -> kembali + snackbar.

### Page: Dashboard (owner)

Komponen: Sapaan, 3 kartu statistik (hunian/pending/disetujui), Button Tambah Hunian, FlatList ListingCard.
State: Loading, Empty.

### Page: Kelola Hunian

Komponen: FlatList kartu + Button Edit + IconButton hapus, FAB tambah, Dialog konfirmasi hapus.

### Page: Tambah/Edit Hunian

Komponen: TextInput nama/harga/lokasi/deskripsi, SegmentedButtons jenis, input fasilitas + chips (bisa dihapus), Button Simpan, Snackbar.
State: Error validasi, Loading.

### Page: Permintaan (owner) & Riwayat (seeker)

Komponen: FlatList kartu permintaan (judul, tanggal, durasi, total, Chip status), tombol Terima/Tolak (owner, khusus pending).
State: Loading, Empty.

### Page: Notifikasi

Komponen: FlatList kartu notifikasi (judul, isi, tanggal), highlight belum dibaca.

### Page: Profil

Komponen: Avatar inisial, nama, email, chip role, kartu menu (Notifikasi, Bantuan, Tentang), Button Keluar.

---

## 5. Common Components

| Komponen | Deskripsi | Tempat Dipakai |
|----------|----------|---------------|
| `ListingCard` | Kartu hunian (foto, jenis, judul, harga, lokasi, jarak, rating) | Beranda, Cari, Dashboard |
| `EmptyState` | Ikon + judul + subjudul saat data kosong | Semua list |
| `Chip` (Paper) | Label jenis/status/fasilitas | Banyak layar |
| `Snackbar` (Paper) | Notifikasi aksi sukses/gagal | Form & aksi |
| `Dialog` (Paper) | Konfirmasi hapus | Kelola Hunian |

---

## 6. Responsive Breakpoints

Aplikasi mobile (portrait).

| Breakpoint | Width | Target |
|-----------|-------|--------|
| Mobile | `<= 480px` | Smartphone Android (target) |
| Tablet | `> 480px` | Layout melebar (tidak dioptimalkan khusus) |

Strategi: konten full-width dengan padding 16; grid kartu satu kolom.