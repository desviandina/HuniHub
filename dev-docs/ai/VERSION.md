# VERSION

> **Status:** DATA FILE — AI WAJIB mengupdate setiap ada rilis. Kontrol versi aplikasi.
> **Purpose:** Rekomendasi versi rilis berikutnya berdasarkan analisis CHANGELOG `[Unreleased]`.

---

## IMMUTABLE -- AI TIDAK BOLEH MENGUBAH FILE INI. Baca template ini, lalu BUAT file BARU di folder output (dev-docs/, planning/, dll) -- JANGAN ubah template ini.

**When to update:** Setiap kali isi `[Unreleased]` di CHANGELOG berubah signifikan, sebelum merge `dev` → `main`, setelah rilis.

---

## Current Version

| Repo | Current Version | Release Date | Notes |
|------|----------------|-------------|-------|
| `apps` | `0.1.0` | `2026-09-19` | development (alpha — skeleton + mock) |

---

## Next Version Recommendation

> **Diisi AI sebelum rilis.** Analisis `[Unreleased]` di CHANGELOG.

### Recommended Release

| Repo | Current | Recommended | Bump | Alasan |
|------|---------|-------------|------|--------|
| `apps` | `0.1.0` | `0.2.0` | MINOR | Fitur baru backward-compatible (Auth + Listing + Review + Rental via mock) |

### Ringkasan Perubahan dari `[Unreleased]`

- Auth & role binding
- CRUD listing, review, rental request, notifikasi (semua mock)
- Mode MOCK default; Firebase via switch `.env`

---

## Version History

| Date | Repo | Version | Type | Key Changes |
|------|------|---------|------|------------|
| `2026-09-19` | `apps` | `0.1.0` | MINOR | Skeleton Expo + navigasi + service mock + bundle sukses |
