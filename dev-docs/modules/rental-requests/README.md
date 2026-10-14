# Module: rental-requests

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Beta (skeleton mock jalan).

| Item | Value |
|------|-------|
| Route Prefix | Tab Riwayat/Permintaan |
| Middleware | role-aware (`seeker` ajukan · `owner` approve) |
| Dependencies | `services/rentalService.js` · `auth` · `listings` |

## Purpose

Alur sewa: seeker ajukan permintaan, owner setujui/tolak, status request dilacak.

## Quick Links

- Routes → `apps/screens/shared/RentalHistoryScreen.js` · `apps/screens/owner/RentalRequestsScreen.js`
- Services → `apps/services/rentalService.js`
- Database → `apps/services/mockData.js` (AsyncStorage `hunihub_requests`)
