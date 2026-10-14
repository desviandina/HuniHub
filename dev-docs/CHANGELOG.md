# CHANGELOG

> **Status:** DATA FILE — AI WAJIB mencatat perubahan signifikan per milestone/sprint.
> **Source:** dibuat dari `ai-rules/CHANGELOG-template.md` (anti-monster: hanya tahun berjalan; arsip per tahun).

---

## [Unreleased] — Sprint Foundation (Skeleton + Planning)

### Added

- Skeleton Expo (SDK 57) di `apps/`: Expo Router launcher + React Navigation (native-stack + bottom-tabs), navigasi per-role (Seeker/Owner), semua screen MVP (auth, seeker, owner, shared), service layer mock, AuthContext, tema Paper MD3, `.env.example`.
- Bundle Android sukses diverifikasi (`npx expo export --platform android`).
- Dokumentasi planning lengkap: `planning/*` (brief, prd, architecture, database, modules, timeline, wireframe).
- Dokumentasi dev-docs: `dev-docs/ai/*` (PROJECT_CONTEXT, START_HERE, PROJECT_MENTAL_MODEL, MODULE_MAP, CURRENT_STATE, TASKS, TECHNICAL_DEBT, KNOWN_ISSUES, VERSION, AGENTS, CODING_RULES, COMMIT_LOG, FINAL_SYSTEM_HANDOVER) + ADR + integrations + modules docs.

### Changed

- Mode aplikasi default = MOCK (async storage). Firebase & Maps aktif hanya jika `.env` terisi.

### Fixed

- Perbaikan awal: install dependency gagal karena ECONNRESET → di-retry sampai sukses.

---

## Version History

| Version | Summaries |
|---------|-----------|
| Lihat [VERSION.md](./ai/VERSION.md) | Rekomendasi versi rilis |

---

## Archived Changelogs

- Belum ada arsip (tahun 2026 masih berjalan).
