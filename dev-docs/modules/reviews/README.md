# Module: reviews

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Alpha (skeleton parsial).

| Item | Value |
|------|-------|
| Route Prefix | Bagian dari ListingDetail (rating & ulasan) |
| Middleware | — (publik baca) |
| Dependencies | `services/reviewService.js` |

## Purpose

Rating & ulasan hunian dari penyewa setelah transaksi selesai; ditampilkan di detail listing.

## Quick Links

- Services → `apps/services/reviewService.js`
- Database → `apps/services/mockData.js` (AsyncStorage `hunihub_reviews`)
- Detail → `apps/screens/seeker/ListingDetailScreen.js`
