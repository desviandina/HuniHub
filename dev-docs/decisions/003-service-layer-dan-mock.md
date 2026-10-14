# ADR 003 — Service Layer & Mode Mock

> **Status:** OUTPUT — dibuat dari template `ai-rules/decisions/001-architecture.md`.
> **Related:** ADR 004 · dev-docs/ai/PROJECT_CONTEXT.md · apps/config/environment.js

---

## Status

`Accepted`

---

## Context

Firebase belum dikonfigurasi (belum ada `.env`/project Firebase, belum ada paket konfigurasi). Agar skeleton tetap bisa diuji, dibangun sekaligus dua jalur data: **mock (AsyncStorage)** dan **Firebase (Firestore)**. Tanpa pemisahan, aplikasi tidak jalan sampai Firebase siap.

---

## Decision

- **Service layer menjadi satu-satunya pintu data:** UI → Context → Service → (Mock | Firebase).
- Mode dikontrol flag `FIREBASE_ENABLED` (+ `MAPS_ENABLED`) di `apps/config/environment.js`.
- Selama flag `false`, service memakai mock dari `services/mockData.js` (AsyncStorage — tersimpan di `hunihub_*` keys).
- Saat `.env` terisi dan flag `true`, service otomatis memakai Firebase SDK (Auth, Firestore, Storage).
- **Bundle jalan penuh di Expo Go** sebelum Firebase aktif — mempermudah development & demo.

---

## Consequences

### Positive

- Aplikasi bisa dikembangkan & diuji dua mode tanpa mengubah UI.
- Penambahan konfigurasi Firebase tidak mengubah kode screen — hanya service layer.

### Trade-offs

- Dua jalur data = dua sumber kebenaran → risiko inkonsistensi mock vs production.
- Service layer lebih tebal; perlu disiplin supaya tidak menduplikasi logika.

### Risks

- **Mock tertinggal vs Firebase** (fitur jalan di mock tapi tidak di Firebase). **Mitigasi:** UAT di kedua mode sebelum rilis; integrasi Firebase dinyatakan sebagai task P0.
- Assumption based on repo analysis: perpindahan mock→Firebase diharapkan seamless lewat flag; **belum diverifikasi** sampai Firebase aktif.
