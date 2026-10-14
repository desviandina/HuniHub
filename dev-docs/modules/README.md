# Modules — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/README.md`.
> **Aturan Anti-Monster:** file ini HANYA indeks modul. Detail per modul ada di file terpisah (`{modul}/README.md` + file per-aspek). Jangan tumpuk isi di sini.

---

## Module Index

| Module | State | Route Prefix | Dependencies | Quick Link |
|--------|-------|-------------|--------------|-----------|
| `auth` | `Beta` (skeleton mock) | `Auth` navigator | — | [auth/README.md](./auth/README.md) |
| `listings` | `Beta` (skeleton mock) | `Seeker/Home+Search`, `Owner/Dashboard` | `location` | [listings/README.md](./listings/README.md) |
| `location-maps` | `Alpha` (placeholder statis) | detail listing (maps) | `listings` | [location-maps/README.md](./location-maps/README.md) |
| `rental-requests` | `Beta` (skeleton mock) | `Seeker/MyRentals`, `Owner/RentalRequests` | `auth`, `listings` | [rental-requests/README.md](./rental-requests/README.md) |
| `reviews` | `Alpha` (skeleton partial) | detail listing (rating) | `listings` | [reviews/README.md](./reviews/README.md) |
| `notifications` | `Alpha` (mock, placeholder) | shared tab `Notifikasi` | `auth` | [notifications/README.md](./notifications/README.md) |
| `profile` | `Beta` (skeleton mock) | shared tab `Profil` | `auth` | [profile/README.md](./profile/README.md) |

---

## Ringkasan per Modul (1 baris — anti-monster)

- **auth** — login/registrasi + pilih role (seeker/owner) + session service (mock saat ini).
- **listings** — pencarian, katalog, detail, dan kelola listing (CRUD seeker view & owner dashboard).
- **location-maps** — koordinat & peta hunian (MVP: posisi statis; maps aktif di dev build).
- **rental-requests** — alur ajukan sewa + konfirmasi permintaan dari owner.
- **reviews** — rating & ulasan pencari setelah sewa selesai.
- **notifications** — notifikasi permintaan/status (mock; Firebase FCM di fase berikut).
- **profile** — profil, pengaturan, logout.

---

## Custom Rules (ringkas)

- Setiap modul: README indeks (+ file aspek bila perlu: routes/controllers/services/models).
- UI wajib memakai React Native Paper komponen — dilarang custom bila sudah ada di Paper.
- Ikon via MaterialCommunityIcons; dilarang emoji di UI text.
- Data hanya via service layer (mock ⇄ Firebase) — jangan panggil AsyncStorage/Firebase langsung dari screen.
