# TASKS

> **Status:** DATA FILE — AI WAJIB mengupdate setiap task baru/selesai. Hanya task aktif (anti-monster).

---

## Active Tasks

| Priority | ID | Status | Task | Notes |
|----------|----|--------|------|-------|
| `P0` | `TASK-001` | Todo | Isi `.env` (Firebase config + Google Maps key) → aktifkan Firebase & Maps | Blocked: menunggu keputusan user |
| `P0` | `TASK-002` | Todo | Install Git, init repo di `apps/` (branch `dev` sebagai development) | Blocked: git belum terinstal |
| `P1` | `TASK-003` | Todo | Build APK dev build (Google Sign-In + Maps native) | Blocked: Maps key + config Google Sign-In |
| `P1` | `TASK-004` | Todo | Implementasi Firebase service layer (Auth, Firestore CRUD listing/rental/review/notif) | Depends: TASK-001 |
| `P2` | `TASK-005` | Todo | Upload foto via Firebase Storage (pengganti URL mock) | Depends: TASK-001 |
| `P2` | `TASK-006` | Todo | Setup Firestore Security Rules (RBAC per role) | Depends: TASK-001 |
| `P3` | `TASK-007` | Todo | Notifikasi real-time (FCM) | Post-MVP |

---

## Recently Done (<1 week)

| ID | Task | Completion Date | Notes |
|----|------|----------------|-------|
| `TASK-000` | Skeleton Expo lengkap (navigasi, screens, service mock, theme) + bundle Android sukses | `2026-09-19` | Termasuk planning + dev-docs awal |

---

## Inferred Next Tasks (from Repository Analysis)

| Priority | Task | Reason |
|----------|------|--------|
| `P0` | Siapkan `.env` dari `.env.example` (placeholder Firebase + Maps) | Semua fitur MVP butuh Firebase; sekarang mock |
| `P1` | Dokumentasi settiap screen ke `dev-docs/modules/` per modul | MODULE_MAP sudah dibuat; detail modul menyusul |

---

## Definition of Done for Current Milestone

- Skeleton semua layar MVP berjalan di mode mock.
- Firebase terkonfigurasi via `.env` dan service layer beralih ke Firebase (minimal Auth + Listing CRUD).
- Google Sign-In & peta berjalan di dev build.

**Milestone:** MVP (MVP1: fitur P0)

---

## Archive

Lihat [TASKS-ARCHIVE.md](./TASKS-ARCHIVE.md) untuk task yang sudah selesai.
