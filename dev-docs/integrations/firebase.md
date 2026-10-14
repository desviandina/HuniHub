# Firebase Integration — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/integrations/_template.md`.
> **Related:** ADR 003 (service layer dual-mode) · ADR 004 · dev-docs/ai/PROJECT_CONTEXT.md · apps/config/environment.js

---

## Service Identity

| Item | Detail |
|------|--------|
| Provider | Google Firebase |
| Purpose | Auth (registrasi/login), Firestore (data), Storage (foto listing), FCM (notifikasi) — **MVP fase after-mock** |
| Docs URL | https://firebase.google.com/docs |
| SDK/Package | `firebase` (^12.19), `@react-native-firebase/*` opsional native | .

---

> **SAAT INI NON-AKTIF.** Firebase belum dikonfigurasi. Aplikasi jalan full-**mock** (AsyncStorage) via flag `FIREBASE_ENABLED=false`. Nyalakan hanya saat `.env` terisi.

---

## Authentication

| Item | Detail |
|------|--------|
| Method | Firebase Auth (email/password; Google Sign-In via dev build) |
| Location | `apps/services/authService.js` → AuthContext |
| `.env` Key | `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` |
| `.env.example` | semua key `=` (placeholder kosong — do not hardcode real credential) |

---

## Connection

| Item | Detail |
|------|--------|
| Base URL | via SDK (`initializeApp` di `apps/config/firebase.js`) |
| Mode | Mock (default) ⇄ Firebase (flag `FIREBASE_ENABLED=true`) |

---

## Endpoints Used (firestore/services)

| Method | Service / Path | Purpose | Location |
|--------|---------------|---------|----------|
| `POST` | `authService.registro()` | Registrasi (seeker/owner) | `apps/services/authService.js` |
| `POST` | `authService.signIn()` / `signOut()` | Login/logout + role gate | `apps/services/authService.js` |
| `CRUD` | `listingService.*` | Kelola listing | `apps/services/listingService.js` |
| `CRUD` | `rentalService.*` | Ajukan/kelola sewa | `apps/services/rentalService.js` |
| `CRUD` | `reviewService.*` | Rating & ulasan | `apps/services/reviewService.js` |
| `GET` | `notificationService.*` | Notifikasi | `apps/services/notificationService.js` |

> Endpoint di atas dibuat per-service baru (per domain data) — sesuai skema monolith NIH dan aturan anti-monster (split per concern).

---

## Error Handling

| Scenario | Behavior | User Message |
|----------|----------|-------------|
| Timeout | retry 3x | "Gagal memuat data. Periksa koneksi." |
| Invalid credential | tampilkan error inline | "Email atau kata sandi salah." |
| Firebase off | pakai mock (default) | tanpa pesan — transparan via mock |

**Fallback jika gagal total:**
- `retry 3x` lalu `throw`; UI menampilkan pesan ramah & tombol "Coba lagi".

---

## Testing

**Mock approach:**
```js
// apps/services/mockData.js — AsyncStorage keys: hunihub_auth, hunihub_listings, ...
// Semua service dual-mode: mode mock diuji penuh di Expo Go.
```

**Sandbox/test mode:** `FIREBASE_ENABLED=false` → mode mock (default dev). Saat flag diaktifkan, app perlu dev build (Maps & Google Sign-In butuh native module).
