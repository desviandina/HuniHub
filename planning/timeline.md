# Timeline & Milestones — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/timeline.md`.

---

## Project Type Declaration

| Item | Value |
|------|-------|
| Project Type | Monolith (mobile app, Firebase BaaS) |

---

## 1. Milestone Overview

| Milestone | Target Date | Status | Deliverables |
|-----------|------------|--------|-------------|
| M0 — Setup & Planning | Selesai | Done | Expo skeleton, navigasi, service layer mock, planning docs |
| M1 — Firebase Terhubung | Belum ditentukan | Planned | .env terisi, auth + Firestore CRUD berfungsi |
| M2 — MVP Lengkap | Belum ditentukan | Planned | Semua fitur P0 berfungsi end-to-end |
| M3 — Polish & Build APK | Belum ditentukan | Planned | UAT, perbaikan bug, APK Android |

---

## 2. Phase Breakdown

### Phase 0: Foundation (SELESAI)

| Task | Repo | Dependencies |
|------|------|-------------|
| Setup Expo SDK 57 + struktur folder | apps | — |
| Pasang React Navigation, Paper, Maps, Firebase, AsyncStorage | apps | Expo |
| Theme biru + komponen bersama | apps | Paper |
| Service layer + mock data | apps | — |
| Semua layar skeleton per role | apps | Navigasi |
| Bundle Android sukses | apps | — |
| Planning docs | root | — |

### Phase 1: Firebase Integration

| Task | Repo | Dependencies |
|------|------|-------------|
| Buat Firebase project + isi `.env` | apps | Akun Google |
| Aktifkan Auth (Email/Password + Google) | apps | Firebase |
| Ganti mock -> Firestore (listings/rental/review/notif) | apps | Service layer |
| Firestore Security Rules (role-based) | apps | Firebase |
| Upload foto (Firebase Storage) | apps | Storage |

### Phase 2: Feature Completion

| Task | Repo | Dependencies |
|------|------|-------------|
| Form ulasan (rating + komentar) di UI | apps | Reviews service |
| Notifikasi otomatis saat permintaan dibuat/diterima | apps | Rental service |
| Peta lokasi (isi Maps API key) | apps | .env + app.json |
| Perbaikan alur & validasi | apps | Semua modul |

### Phase 3: Polish & Launch

| Task | Repo | Dependencies |
|------|------|-------------|
| UAT & bug fixing | apps | Semua modul |
| Build APK (EAS/Expo) | apps | UAT passed |
| Dokumentasi handover | root | Build |

---

## 3. Release Plan

| Version | Date | Repo | Scope |
|---------|------|------|-------|
| `v0.1.0` (Alpha) | Selesai | apps | Skeleton + mock data, bundle sukses |
| `v0.5.0` (Beta) | Belum ditentukan | apps | Firebase aktif, MVP fitur lengkap |
| `v1.0.0` (Release) | Belum ditentukan | apps | APK stabil, siap demo/rilis |

---

## 4. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Firebase config belum siap | High | Med | Mode mock sudah jalan; integrasi belakangan |
| Google Sign-In gagal di Expo Go | High | Med | Pakai dev build saat perlu; email/password sudah jalan |
| Maps API key belum ada | High | Low | Detail tetap menampilkan alamat + jarak; peta muncul saat key diisi |
| Git belum terinstal | Med | Med | Kerja dilanjutkan tanpa git; git diaktifkan saat user siap |
| Rate limit / kuota Firestore | Low | Low | Skala kecil (demo) |