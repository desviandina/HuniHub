# Module: location-maps

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Alpha (placeholder statis; Maps non-aktif di MVP).

| Item | Value |
|------|-------|
| Route Prefix | Bagian dari ListingDetail |
| Middleware | — |
| Dependencies | `react-native-maps` (dev build) · `MAPS_ENABLED` flag |

## Purpose

Menampilkan lokasi hunian (peta). MVP memakai koordinat statis + jarak haversine; Maps nyata butuh dev build + API key.

## Quick Links

- Integrasi → `dev-docs/integrations/maps.md`
- Services → `apps/services/mockData.js` (koordinat) · `apps/utils/formatters.js` (haversine)
- Detail → `apps/screens/seeker/ListingDetailScreen.js`
