# Module: profile

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Beta (skeleton mock jalan).

| Item | Value |
|------|-------|
| Route Prefix | Tab `Profil` (shared) |
| Middleware | auth |
| Dependencies | `services/authService.js` · `AuthContext` |

## Purpose

Profil pengguna: info, role (immutable), pengaturan, dan logout.

## Quick Links

- Routes → `apps/screens/shared/ProfileScreen.js`
- Services → `apps/services/authService.js` (profil + logout)
- Context → `apps/context/AuthContext.js`
- Database → `apps/services/mockData.js` (`profiles.role`)
