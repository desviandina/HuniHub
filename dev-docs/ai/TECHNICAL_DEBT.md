# TECHNICAL_DEBT

> **Status:** DATA FILE — AI WAJIB mengupdate saat ada tech debt baru atau terselesaikan.
> **Purpose:** Inventaris utang teknis yang diketahui. Untuk sadar risiko, bukan langsung diperbaiki.

---

## IMMUTABLE -- AI TIDAK BOLEH MENGUBAH FILE INI. Baca template ini, lalu BUAT file BARU di folder output (dev-docs/, planning/, dll) -- JANGAN ubah template ini.

**What to CREATE in output folder:** Inventaris utang teknis. Jangan langsung memperbaiki tech debt tanpa permintaan user. Cukup catat agar agent berikutnya sadar.

---

## Priority Debt List

| Priority | Repo | Debt | Evidence | Suggested Direction |
|----------|------|------|----------|-------------------|
| `P0` | apps | Dependence penuh ke Firebase, tapi Firebase belum dikonfigurasi → semua service dalam mode mock (AsyncStorage) | `config/environment.js` → `FIREBASE_ENABLED=false`; `services/*` punya branch mock; `.env` masih placeholder | Setelah Firebase aktif → service layer switch via flag, hapus mock bertahap. MVP DILARANG ship tanpa config |
| `P1` | apps | google-signin + react-native-maps dipasang tapi tidak bisa jalan di Expo Go (butuh native module / dev build) | `AGENTS-template` catatan: Google Sign-In butuh development build; Maps key bawaan Expo | Dibutuhkan dev build / APK eksperimental untuk menguji keduanya |
| `P2` | apps | Belum ada test framework otomatis (hanya verifikasi via `expo export`) | `package.json` — tidak ada script test | Tambah framework test (mis. Jest + Testing Library) di fase berikutnya |
| `P2` | apps | Mock data tersebar di beberapa service (`mockData.js`, `reviewService.js`, dll) — tidak satu sumber | Analisis repository: 5 listing + review didefinisikan di service terpisah | Konsolidasi ke satu `mockData.js` hub saat mock refactor |

---

## Risky Areas to Modify

**Area yang berisiko tinggi jika dimodifikasi:**

| Area | Repo | Risk | Reason |
|------|------|------|--------|
| `services/` (auth, listing, rental, review, notification) | apps | `HIGH` | Kontrak service dipakai semua screen; perubahan besar = semua screen ikut berubah |
| `context/AuthContext.js` | apps | `HIGH` | Semua navigasi bergantung pada state sesi; perubahan = gate login rusak |
| `navigation/RootNavigator.js` | apps | `HIGH` | Percabangan role menentukan navigator; salah = user masuk navigator salah |
| `config/environment.js` | apps | `MEDIUM` | Flag mock↔Firebase dikontrol di sini; salah konfig = app logic broken |

---

## Debt Acceptance Notes

**Utang teknis yang disengaja dan diterima:**

- Assumption based on repository analysis: Firebase config sengaja ditunda (user perlu setup project + `.env`) — trade-off: aplikasi jalan mode mock dulu.
- Assumption based on repository analysis: react-native-maps & google-signin sengaja dipasang sejak awal skeleton agar tidak perlu install ulang saat dev build — trade-off: keduanya tidak aktif di Expo Go.
- Assumption based on repository analysis: skeleton dibuat tanpa test dulu (percepatan prototype) — trade-off: verifikasi manual via export.
