# ADR 002 — Cakupan MVP

> **Status:** OUTPUT — dibuat dari template `ai-rules/decisions/001-architecture.md`.
> **Related:** planning/PROJECT_BRIEF.md · planning/timeline.md · dev-docs/ai/TASKS.md

---

## Status

`Accepted`

---

## Context

HuniHub adalah project kuliah 1 developer yang harus selesai dalam waktu terbatas. Tanpa batasan cakupan, fitur akan bertambah terus dan MVP tidak pernah rilis. Perlu keputusan tegas: **apa yang masuk rilis pertama**.

---

## Decision

- **Cakupan MVP = fitur Must + Should + Rating** (dari PRD):
  - Auth + role, pencarian & detail hunian, lokasi/maps, ajukan sewa, kelola hunian & permintaan, riwayat, profil, notifikasi, rating & ulasan.
- **DITUNDA (beyond MVP):** chat antar pengguna, pembayaran online, rekomendasi AI, membership/voucher, peta interaktif kompleks, aplikasi web/admin.
- Fitur P1 (notifikasi real-time FCM, profil lanjutan) masuk sebagai tambahan incremental setelah P0 stabil.

---

## Consequences

### Positive

- Scope jelas → team fokus dan MVP realistis untuk 1 developer.
- Waktu, resource, dan skala data sesuai (skala kecil, demo lokal).

### Trade-offs

- Fitur favorit (chat, pembayaran) tidak ada di rilis awal — bisa mengurangi kepuasan sebagian user.
- Skala MVP harus dipikirkan supaya penambahan fitur nanti tidak memicu refactor besar.

### Risks

- **Scope creep** — fitur "satu lagi aja" terus masuk. **Mitigasi:** setiap usulan fitur dicek terhadap daftar MVP; yang bukan P0/P1 masuk backlog.
- Asumsi "cukup untuk demo" belum diuji oleh user nyata. **Mitigasi:** UAT mandiri + review berkala.
