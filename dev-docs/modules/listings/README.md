# Module: listings

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Beta (skeleton mock jalan).

| Item | Value |
|------|-------|
| Route Prefix | Tab `Home`/`Cari` (seeker) · Dashboard (owner) |
| Middleware | role-aware |
| Dependencies | `services/listingService.js` · `location-maps` |

## Purpose

Katalog & detail hunian: daftar, cari, filter, lihat detail listing, dan kelola listing (owner).

## Quick Links

- Routes → `apps/screens/seeker/SearchScreen.js` · `apps/screens/owner/ManageListingsScreen.js`
- Services → `apps/services/listingService.js`
- Models → `apps/services/mockData.js` (Listing shape)
- Detail → `apps/screens/seeker/ListingDetailScreen.js`
- Database → `apps/services/mockData.js` (AsyncStorage `hunihub_listings`)
