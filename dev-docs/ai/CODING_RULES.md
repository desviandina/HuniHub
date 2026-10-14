# CODING_RULES

> **Status:** GUIDANCE + DATA — dibuat dari template `ai-rules/dev-docs-ai-templates/CODING_RULES-template.md`.
> **Repo:** `apps/` (monolith). Aturan yang SUDAH diterapkan di codebase.

---

## 1) Module and Route Conventions

**How modules are organized (dari analisis repository):**
- Layered / service-based: `screens/` (UI) → `context/` (state) → `services/` (data access) → source (mock | Firebase).
- Modul bisnis dipetakan ke navigator per role: `SeekerNavigator` (tab Beranda/Cari/Notifikasi/Profil) dan `OwnerNavigator` (tab Dashboard/Kelola/Notifikasi/Profil).
- Route didefinisikan di `navigation/` sebagai React Navigation stack/tab config, bukan file route terpisah.
- Role guard: `RootNavigator` memilih navigator berdasarkan role di `AuthContext`; screen owner hanya ada di `OwnerNavigator`.

---

## 2) Authorization Conventions

- Role di-binding saat pendaftaran (`profiles.role`: `seeker` / `owner`), immutable, tidak bisa diubah setelah daftar.
- Otorisasi UI: percabangan navigator per role di `RootNavigator.js` (seeker tidak bisa lintas ke screen owner dan sebaliknya).
- Server-side authorization (Firestore Security Rules + RBAC per UID) disiapkan di Firestore saat Firebase aktif — lihat `dev-docs/understanding-firebase.md`.
- Untuk MVP mock: guard role di navigasi + tombol dikondisikan pada `user.role`.

---

## 3) Data and Transaction Conventions

- Satu service layer (`services/*`) menjadi satu-satunya jembatan ke data; UI tidak pernah akses Firebase/mock langsung.
- Mode data dikendalikan flag `FIREBASE_ENABLED` (+ `MAPS_ENABLED`) di `config/environment.js`. Jika mock → pakai AsyncStorage; jika Firebase → pakai SDK.
- Login sesi tersimpan di AsyncStorage (key `hunihub_session`), dibuat/dibaca via `services/authService.js`.
- Form request/validation di sisi screen (Paper `TextInput` + validasi sederhana); service menerima objek terstruktur.

---

## 4) Import Conventions

- Belum ada pipeline import/export data. Data mock disuntikkan via `services/mockData.js` (5 listing contoh).
- Belum ada queue/chunking — skala MVP kecil (`< 100` user).

---

## 5) UI Conventions

- **Wajib** React Native Paper v5 (MD3) — komponen: Card, TextInput, Button, Chip, Dialog, Snackbar, FAB, SegmentedButtons, List, Avatar, Appbar.
- Dilarang membuat komponen Paper yang sudah ada; dilarang emoji di UI text; ikon via `@expo/vector-icons` (MaterialCommunityIcons).
- Theme: `constants/theme.js` (tokens Paper). Shared components di `components/` (ListingCard, EmptyState).
- State: `AuthContext` (sesi + role) + state lokal hooks. Tanpa Redux. Komunikasi data via service layer.

---

## 6) Testing Conventions

- Belum ada kerangka test otomatis. Verifikasi utama: build sukses (`npx expo export --platform android`) + UAT manual alur MVP.
- Test unit/lint belum dikonfigurasi — dicatat di `dev-docs/ai/KNOWN_ISSUES.md` dan `TECHNICAL_DEBT.md`.

---

## 7) Documentation Conventions

- JSDoc tidak diwajibkan; komentar minim, fokus clarity.
- Perubahan fitur langsung dicatat di `dev-docs/CHANGELOG.md` → versi dirilis via `dev-docs/ai/VERSION.md`.
- Setiap modul/big change WAJIB update `dev-docs/ai/MODULE_MAP.md` + `TASKS.md`.
