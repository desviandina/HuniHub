# ADR 004 — UI Library: React Native Paper

> **Status:** OUTPUT — dibuat dari template `ai-rules/decisions/001-architecture.md`.
> **Related:** ADR 003 · apps/constants/theme.js · dev-docs/ai/CODING_RULES.md

---

## Status

`Accepted`

---

## Context

Aplikasi mobile React Native. Tanpa komitmen UI framework, styling akan campur aduk (custom CSS inline, komponen tak konsisten) dan sulit dirawat. Perlu standar tampilan yang selaras Material Design.

---

## Decision

- **UI library: React Native Paper v5 (Material Design 3)** — komponen lengkap (Card, TextInput, Button, Chip, Dialog, Snackbar, FAB, dll).
- **Wajib** memakai komponen Paper; **dilarang** membuat komponen UI dari nol bila sudah ada di Paper.
- **Ikon:** MaterialCommunityIcons (`@expo/vector-icons`). **Dilarang emoji** di UI text.
- **Theme tokens** terpusat di `apps/constants/theme.js` (Paper Provider wrapper di `App.js`).
- **No custom framework** di atasnya — extend Paper hanya jika komponen tidak tersedia.

---

## Consequences

### Positive

- Tampilan konsisten & professional (MD3) tanpa biaya desain.
- Komponen siap pakai → development cepat.

### Trade-offs

- Terikat pada API Paper — upgrade Paper bisa mengubah visual/API komponen.
- Gaya yang sangat custom mungkin tidak langsung didukung → perlu effort tambahan.

### Risks

- **Paper v5 vs versi lain:** versi salah bisa mengubah behavior. **Mitigasi:** pakai versi yang dipasang (^5.15) dan dokumentasikan di CHANGELOG sebelum upgrade.
- Assumption based on repo analysis: theme `#1565C0` (blue) dipakai sebagai primary; belum diverifikasi secara visual karena masih skeleton.
