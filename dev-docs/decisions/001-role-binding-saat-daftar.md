# ADR 001 — Role Binding Saat Pendaftaran

> **Status:** OUTPUT — dibuat dari template `ai-rules/decisions/001-architecture.md`.
> **Related:** ADR 003 (service layer + mock) · planning/architecture.md

---

## Status

`Accepted`

---

## Context

HuniHub punya dua peran utama: **Pencari Hunian** (`seeker`) dan **Pemilik Hunian** (`owner`). Tanpa pemisahan peran, semua user bisa mengakses semua fitur — membingungkan dan berisiko (mis. pemilik tidak sengaja mengajukan sewa, atau pencari mengedit hunian milik orang lain).

Direktorat produk sepakat: **role dipilih saat pendaftaran dan berlaku permanen** (immutable). Ia menentukan navigasi, otorisasi, dan akses fitur sepanjang umur aplikasi.

---

## Decision

- **Role binding terjadi saat registrasi**: pengguna memilih `seeker` atau `owner` di halaman Daftar (sebelum akun dibuat).
- **Role tersimpan di profil** (`profiles.role`) dan **tidak bisa diubah** setelah akun aktif (kecuali lewat support admin di fase berikutnya).
- **Navigasi di-rooting berdasarkan role:** RootNavigator membaca `AuthContext.role` → memilih navigator yang sesuai.
- **Otorisasi:** guard di navigator + screen-level checks (mis. tombol "Ajukan Sewa" hanya tampil untuk `seeker`).

**Alternatif yang dipertimbangkan (ditolak):**
- **Role fleksibel (bisa pindah per transaksi)** — rejected: kompleks, membuka peluang abuse, dan tidak sesuai kebutuhan target pasar.
- **Role default + upgrade via request** — rejected: menambah state machine dan alur persetujuan yang tidak dibutuhkan di MVP.

---

## Consequences

### Positive

- Otorisasi sederhana dan jelas: satu keputusan saat daftar → akses seluruh aplikasi.
- Navigasi per-role membuat UX lebih fokus dan mencegah fragmentasi fitur.
- Model data dan security rules Firestore lebih mudah (role statis = pola RBAC singkat).

### Trade-offs

- Pengguna yang salah pilih role tidak bisa mengubah sendiri — perlu mekanisme dukungan manual.
- Perubahan kebutuhan bisnis (mis. ingin role-fleksibel) = refactor besar di auth, navigasi, dan rules.

### Risks

- Salah pilih role saat daftar → user terkunci di role yang keliru. **Mitigasi:** tampilkan deskripsi peran jelas + konfirmasi sebelum submit; siapkan alur bantuan (log/tiket) untuk koreksi manual.
