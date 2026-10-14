# START_HERE

> **Status:** OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/START_HERE-template.md`.
> **Purpose:** Titik masuk pertama untuk AI agent. Dibaca pertama kali saat onboarding.

---

## Quick Facts

| Item | Value |
|------|-------|
| Repository | HuniHub (mobile app) |
| Project Type | Monolith (Firebase BaaS) |
| Git Location | `apps/` (git BELUM di-init — git belum terinstal) |
| Stack | React Native (Expo SDK 57) + JavaScript + React Native Paper + Firebase |
| DB | Firebase Firestore (mock mode default) |
| Maps | react-native-maps (Google Maps) |
| Branch dev | `dev` (rencana; belum ada git) |
| Branch main | `main` (rencana) |
| Testing | Belum ada (verifikasi = `npx expo export --platform android`) |

---

## Recommended Reading Order

1. `../../planning/PROJECT_BRIEF.md` — brief produk
2. `../../planning/prd.md` — fitur & acceptance criteria
3. `PROJECT_CONTEXT.md` — overview sistem dan stack
4. `PROJECT_MENTAL_MODEL.md` — cara berpikir tentang codebase
5. `MODULE_MAP.md` — mapping modul ke kode
6. `../../planning/architecture.md` — arsitektur
7. `../architecture/frontend-structure.md` — struktur frontend
8. `../architecture/database.md` — arsitektur data (Firestore)
9. `CURRENT_STATE.md` — kondisi terkini
10. `TASKS.md` — task aktif
11. `KNOWN_ISSUES.md` — issue
12. `TECHNICAL_DEBT.md` — utang teknis
13. `VERSION.md` — versi
14. `../decisions/` — ADR
15. `../modules/` — dokumentasi per modul

---

## High-Priority Current Work

- Skeleton aplikasi selesai (semua layar, navigasi, service layer mock) — bundle Android sukses.
- Menunggu: Firebase project + isi `.env` untuk mengaktifkan Firebase (auth + Firestore).
- Menunggu: Google Maps API key untuk mengaktifkan peta.
- Menunggu: git diinstal lalu init repo di `apps/` (branch `main` + `dev`).

---

## Safety Notes for Agents

- JANGAN hardcode credential — semua via `.env` (`EXPO_PUBLIC_*`). Update `.env.example` bila menambah key.
- JANGAN ubah apa pun di `ai-rules/` (immutable).
- JANGAN commit/push ke `main` (setelah git aktif). Kerja di `dev`/`feat/*`.
- UI WAJIB pakai React Native Paper; JANGAN buat komponen yang sudah ada.
- JANGAN pakai icon/emoji di UI text (MaterialCommunityIcons untuk ikon).
- Google Sign-In butuh development build (tidak jalan di Expo Go).
- Docker/network di mesin ini kadang error ECONNRESET saat npm install — retry bila gagal.