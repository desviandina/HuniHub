# PROJECT_MENTAL_MODEL

> **Status:** OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/PROJECT_MENTAL_MODEL-template.md`.
> **Purpose:** Cara berpikir tentang codebase HuniHub — bukan daftar file, tapi pola pikir.

---

## How to Think About This Codebase

**Ini adalah aplikasi mobile monolit (monolith, 1 repo `apps/`) dengan backend sebagai Firebase BaaS.**

Jangan berpikir dalam "file", berpikirlah dalam **"module boundary"** — UI, Context, Service, dan Data Source adalah lapisan yang memisahkan apa yang dilihat user dari mana data berasal. Asumsi utama: UI **tidak pernah** memanggil Firebase langsung; semua lewat **service layer**. Ini adalah kontrak yang membuat aplikasi bisa dijalankan dengan data mock (mode default) DAN bisa di-switch ke Firebase tanpa mengubah UI.

Prinsip kedua: **role-driven navigation.** Aplikasi adalah satu binary, tapi isi & alur navigasi ditentukan oleh role pengguna (`seeker` / `owner`) yang di-binding saat pendaftaran dan bersifat immutable. Jangan pernah menulis logika "tampilkan X untuk semua user" — selalu tanya: role mana yang melihat ini?

---

## 1) Architecture Pattern

- **Modular monolith (mobile):** satu deployable unit (app Android), kode dipecah per concern (screens, components, services, context, constants).
- **Layered / service-based:** `Screens -> Context -> Services -> (Mock | Firebase)`.
- **Pemisahan sumber data lewat service layer:** `services/*Service.js` menyediakan API yang sama untuk mock maupun Firebase. Keputusan mode Ada di `config/environment.js` (`FIREBASE_ENABLED`, `MAPS_ENABLED`).
- **Shared kernel:** `config/` (env + flags), `constants/` (theme, roles, listing), `utils/formatters.js`, `context/AuthContext.js`.
- **Tidak ada unit test otomatis** — verifikasi melalui `npx expo export --platform android` + UAT manual.

---

## 2) Request Execution Pattern

Tidak ada HTTP request dalam arti klasik (app mobile). Alur "request" mengikuti pola service call:

1. **User interaction** di Screen (mis. tekan "Ajukan Sewa").
2. **AuthContext / AuthGuard** mengecek sesi & role (untuk aksi yang butuh auth — mis. ajukan sewa hanya untuk `seeker`).
3. **Service dipanggil** di `services/` (mis. `rentalService.createRequest(...)`).
4. **Mode check di `config/environment.js`:** jika `FIREBASE_ENABLED` → pakai Firebase SDK (setelah config diisi); selain itu → operasi AsyncStorage/Mock.
5. **Response di-normalisasi** di service layer → dikembalikan ke Screen.
6. **UI update** (state Context + React Native Paper component — Snackbar/Dialog).

Validasi & otorisasi:
- **Validasi form** di Screen (email format, password >= 6, field required, numerik).
- **Otorisasi role** di navigasi (RootNavigator memilih navigator berdasarkan role) + guard tombol.
- **Otorisasi server** = Firestore Security Rules (dibuat saat Firebase aktif).

---

## 3) UI Pattern

- **SPA-like (mobile):** Expo / React Native, tidak ada SSR. Semua dirender di client.
- **Rendering:** React Native Paper (Material Design 3) — komponen Paper WAJIB dipakai; custom styling hanya jika komponen tidak tersedia.
- **Layout:** per-role navigator (SeekerNavigator bottom-tabs; OwnerNavigator). RootNavigator = auth gate; header via Paper Appbar.
- **State management:** React Context (`AuthContext`) untuk sesi/role; state lokal dengan hooks untuk form/tab. Tidak ada Redux/Zustand — skala kecil.
- **Ikon:** MaterialCommunityIcons; DILARANG emoji di UI text.
- **Styling tokens:** di `constants/theme.js` (primary `#1565C0`, dll).

---

## 4) Data Migration/Import Mindset

- **Uncertainty marker:** Firebase belum diaktifkan (`.env` kosong) → semua data tersimpan di AsyncStorage via service mock (`services/mockData.js`).
- **Pola migrasi mock -> Firebase:** service layer mengecek `FIREBASE_ENABLED`. Saat `.env` terisi, service beralih otomatis. Tidak ada dual-write period — karena MVP belum production, migrasi data mock ke Firestore dilakukan manual/batch saat Firebase siap.
- **Seeder:** `services/mockData.js` berisi 5 listing contoh.
- **Assumption based on repository analysis:** Tidak ada pipeline ETL; data hanya revisi state aplikasi.

---

## 5) Risk Hotspots

| Area | Risk | Reason |
|------|------|--------|
| `apps/config/environment.js` + `firebase.js` | HIGH | Titik switch mock<->Firebase; config salah = aplikasi error semua | 
| `apps/navigation/RootNavigator.js` | HIGH | Auth gate + role branching — di sini kesalahan role = user lihat navigasi salah |
| `apps/context/AuthContext.js` | HIGH | Single source sesi; bug di sini = app dianggap logged-out salah |
| `apps/services/*.js` | MEDIUM | Contract service layer; perubahan tanpa update semua service = UI rusak |
| `apps/screens/owner/AddEditListingScreen.js` | MEDIUM | Form kompleks (harga, fasilitas, validasi) |
| Maps (react-native-maps) | MEDIUM | Butuh Google Maps key; di Expo Go key Expo, dev build butuh `.env` |

---

## 6) Current Product Direction

- **Sedang dibangun:** skeleton MVP mobile — semua layar, navigasi per role, service layer mock. Semua fitur MVP (auth, cari, detail, sewa, kelola hunian, permintaan, ulasan) sudah ada sebagai skeleton.
- **Menunggu:** konfigurasi Firebase + `.env` (aktifkan auth & Firestore), Google Maps key, Git (init repo) untuk development lanjut.
- **Pivot terdekat:** aktifkan Firebase phase 1 — swap mock -> Firestore + Firebase Auth.
