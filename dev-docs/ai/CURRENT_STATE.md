# CURRENT_STATE

> **Status:** DATA FILE — AI WAJIB mengupdate setiap akhir task. Ini adalah snapshot kondisi development terkini.
> **Purpose:** Single source of truth untuk tahu "apa yang sedang terjadi sekarang" di project.
> **Related:** [TASKS.md](./TASKS.md) (task aktif) · [CHANGELOG.md](../CHANGELOG.md) (log kronologis) · [VERSION.md](./VERSION.md) (versi rilis)

---

## IMMUTABLE -- AI TIDAK BOLEH MENGUBAH FILE INI. Baca template ini, lalu BUAT file BARU di folder output (dev-docs/, planning/, dll) -- JANGAN ubah template ini.

**When to update:** SETIAP akhir task — wajib.

---

## Snapshot

| Repo | Branch | Last Commit | Notes |
|------|--------|------------|-------|
| `apps` | `~` | `~` | **Skeleton lengkap + bundle Android sukses.** Git BELUM di-init (git belum terinstal). |

| Last Updated | `2026-09-19` |
| Updated By | `claude` |

---

## Recent Development Highlights

| Repo | Commit | Date | Summary |
|------|--------|------|---------|
| `apps` | `~` | `2026-09-19` | Expo SDK 57 skeleton: navigasi per-role (Seeker/Owner), semua screen MVP, service layer mock, AuthContext, tema Paper MD3. `expo export --platform android` SUKSES (1273 modul, 2163 ms). |

---

## Module Maturity (Practical State)

| Module | Repo | State | Notes |
|--------|------|-------|-------|
| Auth & Role | apps | In Progress | Login/Register + AuthContext + guard role; Firebase belum aktif (mock) |
| Listings | apps | In Progress | CRUD mock (5 listing); Firebase Firestore menyusul |
| Reviews | apps | In Progress | Review mock CRUD |
| Rental Requests | apps | In Progress | Ajukan sewa + terima/tolak (mock) |
| Notifications | apps | Beta | NotifService mock cukup lengkap |
| Profile | apps | In Progress | Profil + logout |
| Location & Maps | apps | Beta | Haversine jarak mock; Maps aktif hanya jika `.env` terisi + MAPS_ENABLED |

**State definitions:** `Planned` → belum ada kode · `In Progress` → kode ada, aktif dikembangkan · `Beta` → fitur lengkap, belum production-ready · `Production` → stabil · `Deprecated` → akan dihapus.

---

## Active Backlog (Non-Done Tasks)

| Priority | ID | Status | Task | Repo | Notes |
|----------|----|--------|------|------|-------|
| `P0` | `TASK-001` | Todo | Isi `.env` (Firebase + Maps key) lalu aktifkan Firebase & Maps | apps | Blocked: menunggu keputusan/user |
| `P0` | `TASK-002` | Todo | Instal Git + init repo git di `apps/` (branch `dev` vs `main`) | apps | Blocked: Git belum terinstal |
| `P1` | `TASK-003` | Todo | Dev build APK (Google Sign-In) | apps | Blocked: config + .env |
| `P1` | `TASK-004` | Todo | Implementasi service layer Firebase (Auth + Listing CRUD) | apps | Depends: TASK-001 |
| `P2` | `TASK-005` | Todo | Upload foto via Firebase Storage | apps | Depends: TASK-001 |
| `P2` | `TASK-006` | Todo | Firestore Security Rules (RBAC) | apps | Depends: TASK-001 |
| `P3` | `TASK-007` | Todo | Notifikasi real-time (FCM) | apps | Post-MVP |

---

## Test / QA State

| Repo | Area | Coverage | Status |
|------|------|----------|--------|
| `apps` | build android (bundle) | — | Passing (`expo export --platform android` 1273 modules) |
| `apps` | expo-doctor | — | Not Run |
| `apps` | unit test | — | Not Run (belum ada framework) |

---

## Important Nuance

- **Assumption based on repository analysis:** Aplikasi berjalan mode mock penuh sampai `.env` (Firebase + Maps) terisi. Ini disengaja — agar aplikasi jalan tanpa akun Firebase.
- **Assumption based on repository analysis:** expo export sukses membuktikan skeleton buildable, bukan berarti fitur Firebase berfungsi.
- **Assumption based on repository analysis:** tanjung navigasi root memilih navigator berdasarkan role; konsisten dengan deklarasi role immutable di planning/architecture.md.
