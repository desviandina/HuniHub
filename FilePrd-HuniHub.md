```
# Template PRD Sederhana untuk Mahasiswa Vibe Coding (React Native)
```

```
## 1. Ringkasan Eksekutif / Executive Summary
```

```
HuniHub adalah platform penyewaan berbagai jenis hunian, mulai dari homestay,
rumah sewa, kost. yang mempertemukan pencari hunian dengan pemilik hunian dalam
satu aplikasi. HuniHub ditujukan bagi masyarakat yang membutuhkan tempat tinggal
untuk liburan, kuliah, bekerja di luar kota, maupun kebutuhan sementara atau
jangka panjang, sekaligus membantu pemilik memasarkan huniannya dengan proses
pencarian hingga penyewaan yang terpusat dalam satu platform.
```

- `## 2. Tujuan Produk / Product Goals` 

`1. Memusatkan seluruh proses penyewaan hunian dalam satu platform.` 

`2. Menyediakan berbagai pilihan hunian seperti homestay, rumah sewa, kost.` 

`3. Memudahkan pengguna menemukan hunian sesuai kebutuhan berdasarkan lokasi, harga, jenis, dan durasi sewa.` 

`4. Membantu pemilik hunian memasarkan huniannya dan menjangkau calon penyewa dengan lebih mudah.` 

`5. Menciptakan proses penyewaan yang praktis, jelas, dan terpercaya.` 

# `## 3. User Persona / Pengguna` 

```
Alya, 25 tahun
```

`1. Sering berlibur ke luar kota` 

`2. Aktif menggunakan aplikasi untuk mencari tempat tinggal` 

`3. Kesulitan: tidak mengetahui jarak hunian ke tempat wisata dan informasi hunian terkadang tidak lengkap` 

```
4. Tujuan: menemukan hunian yang nyaman, sesuai budget, dan dekat dengan tujuan
wisata
Pak Rudi, 42 tahun
```

`1. Pemilik kost dan rumah sewa` 

`2. Memasarkan hunian melalui berbagai platform` 

`3. Kesulitan: sulit menjangkau calon penyewa` 

`4. Tujuan: memasarkan hunian dan mendapatkan penyewa melalui satu platform` 

# `## 4. User Stories` 

`1. Sebagai pencari hunian, saya ingin mencari hunian berdasarkan jenis, lokasi, dan harga, sehingga saya dapat menemukan hunian yang sesuai kebutuhan.` 

`2. Sebagai pencari hunian, saya ingin melihat jarak hunian dari tempat tujuan, sehingga saya dapat mempertimbangkan lokasi sebelum menyewa.` 

`3. Sebagai pencari hunian, saya ingin melihat informasi dan fasilitas hunian secara lengkap, sehingga saya dapat mengetahui kondisi hunian sebelum menyewa. 4. Sebagai pemilik hunian, saya ingin menambahkan informasi dan foto hunian, sehingga calon penyewa dapat mengetahui hunian yang saya tawarkan.` 

`5. Sebagai pemilik hunian, saya ingin mengelola informasi dan harga hunian, sehingga informasi yang ditampilkan kepada calon penyewa selalu sesuai.` 

# `## 5. Acceptance Criteria (Kriteria Penerimaan)` 

`1. Pencarian Hunian: Jika pengguna memilih jenis, lokasi, atau harga hunian, maka sistem menampilkan hunian yang sesuai.` 

`2. Informasi Lokasi: Jika pengguna memilih hunian, maka sistem menampilkan lokasi dan jarak hunian dari tempat tujuan.` 

`3. Detail Hunian: Jika pengguna memilih hunian, maka sistem menampilkan foto, harga, fasilitas, dan informasi hunian.` 

`4. Tambah Hunian: Jika pemilik mengisi informasi hunian dan menekan “Simpan”, maka hunian baru muncul pada daftar hunian.` 

`5. Kelola Hunian: Jika pemilik mengubah informasi atau harga hunian, maka sistem menampilkan informasi terbaru pada halaman hunian.` 

```
## 6. User Flow (Alur Pengguna)
```

```
Fitur Pencarian & Penyewaan Hunian
```

`1. Buka aplikasi ? halaman Login/Register` 

`2. Login/Register dengan email & password atau Google ? halaman Pilih Akun` 

`3. Pilih Pencari Hunian ? halaman Beranda` 

`4. Pilih jenis, lokasi, harga, atau durasi sewa ? daftar Hunian` 

`5. Pilih hunian ? halaman Detail Hunian` 

`6. Lihat foto, harga, fasilitas, lokasi, dan jarak hunian ? halaman Detail Hunian` 

`7. Tekan “Ajukan Sewa” ? permintaan sewa dikirim ke pemilik` 

`8. Pemilik menerima permintaan ? penyewaan berhasil` 

`9. Selesai ? penyewaan tersimpan di Riwayat Penyewaan Fitur Tambah & Kelola Hunian` 

`1. Buka aplikasi ? halaman Login/Register` 

`2. Login/Register dengan email & password atau Google ? halaman Pilih Akun` 

`3. Pilih Pemilik Hunian ? halaman Dashboard Pemilik` 

`4. Tekan “Tambah Hunian” ? halaman Formulir Hunian` 

`5. Masukkan nama, jenis, harga, lokasi, fasilitas, deskripsi, dan foto ? data hunian siap disimpan` 

`6. Tekan “Simpan” ? hunian ditampilkan di HuniHub` 

`7. Pilih “Kelola Hunian” ? daftar hunian milik pemilik` 

`8. Pilih hunian ? halaman Edit Hunian` 

`9. Ubah informasi hunian ? tekan “Simpan”` 

`10. Selesai ? informasi hunian diperbarui ---` 

```
## 7. Daftar Fitur (MoSCoW)
```

`1. Fitur Login & Register (Email/Password + Google) = Must` 

`2. Fitur Pilih Akun (Pencari Hunian / Pemilik Hunian) = Must` 

`3. Fitur Cari & Filter Hunian = Must` 

`4. Fitur Lihat Detail Hunian = Must` 

`5. Fitur Informasi Lokasi & Jarak Hunian = Must` 

`6. Fitur Peta Lokasi Hunian = Must` 

`7. Fitur Ajukan Sewa = Must` 

`8. Fitur Tambah Hunian = Must` 

`9. Fitur Kelola Hunian = Must` 

`10. Fitur Kelola Permintaan Sewa = Must` 

`11. Fitur Riwayat Penyewaan = Should` 

`12. Fitur Profil Pengguna = Should` 

`13. Fitur Notifikasi = Should` 

`14. Fitur Rating & Ulasan = Could` 

`15. Fitur Chat Pemilik & Penyewa = Could` 

`16. Fitur Pembayaran Online = Could` 

`17. Fitur Rekomendasi Hunian dengan AI = Won't` 

`18. Fitur Membership & Voucher/Promo = Won't` 

`19. Fitur Peta Interaktif Kompleks = Won't` 

```
## WARN: JANGAN DI ISI No. 8
```

```
## 8. Alat & Teknologi yang Dipakai (Tech Stack)
```

```
> [Pilih paket/library yang akan dipakai. Isi sesuai kebutuhan proyekmu.]
```

- `Framework      : React Native (Expo)` 

- `Bahasa         : TypeScript / JavaScript` 

- `Navigasi       : React Navigation` 

- `Database       : Firebase Firestore` 

- `UI Library     : React Native Paper / NativeBase` 

- `Storage lokal  : AsyncStorage (untuk offline)` 

