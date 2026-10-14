# FINAL_SYSTEM_HANDOVER

> **Status:** OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/FINAL_SYSTEM_HANDOVER-template.md`.
> **Purpose:** Ringkasan handover untuk engineer/AI berikutnya. Update tiap push ke `dev` / milestone selesai.

---

## System Identity

| Repo | Branch | Version | Last Commit |
|------|--------|---------|------------|
| `apps` | `~` (git belum di-init) | `0.1.0` | `~` |

| Project Type | `Monolith` (mobile app, Firebase BaaS) |
| Last Updated | `2026-09-19` |
| Handover Agent | `AI (model big-pickle)` |

---

## Current Architecture Summary

HuniHub adalah aplikasi **React Native (Expo SDK 57)** untuk penyewaan hunian (homestay, rumah sewa, kost) dengan dua role: pencari (`seeker`) dan pemilik (`owner`). Arsitektur service-based: `UI (Screen) → Context → Service → (Mock | Firebase)`. Aplikasi berjalan penuh mode **mock** (data dari AsyncStorage via service layer) sampai Firebase terkonfigurasi lewat `.env`. Navigasi per-role di `RootNavigator`; semua layar MVP (auth, seeker, owner, shared) sudah ada sebagai skeleton dan Android bundle sukses diverifikasi.

Dependency utama: React Native Paper (UI), React Navigation (navigasi), Firebase (Auth + Firestore + Storage — placeholder), react-native-maps (peta — placeholder key), AsyncStorage (sesi + mock).

---

## Active Modules Status

| Module | Repo | State | Notes |
|--------|------|-------|-------|
| Auth & Role | apps | In Progress | Mock auth + role binding; Firebase aktif saat `.env` terisi |
| Listings | apps | In Progress | Skeleton CRUD mock (5 listing); tulis jalan |
| Location & Maps | apps | Beta | Haversine jarak; Maps butuh key untuk dev build |
| Rental Requests | apps | In Progress | Ajukan + terima/tolak (mock) |
| Reviews | apps | In Progress | Rating + ulasan mock |
| Notifications | apps | In Progress | Notifikasi mock |
| Profile | apps | In Progress | Profil + logout |

---

## Recent Changes (Since Last Handover)

| Date | Repo | Type | Description | Impact |
|------|------|------|-------------|--------|
| `2026-09-19` | apps | feat | Skeleton lengkap: semua screen MVP, navigasi role-based, service layer mock, AuthContext, tema Paper | Bundling Android sukses; app jalan mode mock |

---

## Known Issues at Handover

| Area | Repo | Issue | Mitigation |
|------|------|-------|-----------|
| Google Sign-In | apps | Butuh dev build (native) — tidak jalan di Expo Go | Pakai email/password dulu; dev build saat Maps + Firebase aktif |
| Maps | apps | Key bawaan Expo hanya di Expo Go; key sendiri butuh dev build/APK | Placeholder `.env` + `MAPS_ENABLED` |
| Firebase | apps | Belum dikonfigurasi — app mode mock | Isi `.env` (EXPO_PUBLIC_FIREBASE_*) untuk aktifkan |

---

## What Needs to Happen Next

| Priority | Repo | Task | Blockers |
|----------|------|------|----------|
| P0 | apps | Isi `.env` + aktifkan Firebase & Maps | Keputusan user; API key |
| P0 | apps | Instal Git + init repo `apps/` (branch `dev`) | Git belum terinstal |
| P1 | apps | Dev build APK (Google Sign-In + Maps native) | Config + key |
| P1 | apps | Implementasi Firebase service layer | Depends: `.env` |

---

## Deployment Notes

| Repo | DB Migration | Config Baru | Restart Service | Notes |
|------|-------------|------------|----------------|-------|
| `apps` | Tidak (Firestore schema-less) | `.env` (Firebase + Maps) | Tidak (client app) | Build: `npx expo export --platform android`; APK: EAS |

---

## Verification Commands

> DILARANG pakai IP server / credential. Semua local.

```bash
# Build android bundle (verifikasi skeleton jalan)
cd apps
npx expo export --platform android

# Cek struktur konfigurasi (mock aktif default)
notepad apps/config/environment.js
```

**[UNVERIFIED]** Google Sign-In & Maps hanya terverifikasi di Expo Go dengan placeholder; diperlukan dev build untuk UAT final.
