# Module: auth

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Beta (skeleton mock jalan) — Firebase auth belum aktif.

| Item | Value |
|------|-------|
| Route Prefix | `Auth` navigator (Login, SignUpSteps) |
| Middleware | — (pra-login) |
| Dependencies | `services/authService.js` (mock ⇄ Firebase) |

## Purpose

Registrasi + login, pemilihan role (`seeker`/`owner`) saat daftar, dan sesi aktif. Role **immutable** (ADR 001).

## Quick Links

- Routes → `apps/navigation/AuthNavigator.js`
- Services → `apps/services/authService.js`
- Context → `apps/context/AuthContext.js`
- Database (profile.role) → `apps/services/mockData.js`
- Keputusan → `dev-docs/decisions/001-role-binding-saat-daftar.md`
