# Module: notifications

> **Status:** OUTPUT — dibuat dari template `ai-rules/modules-template/_template/README.md`.
> **State:** Alpha (mock; FCM ditunda pasca-MVP).

| Item | Value |
|------|-------|
| Route Prefix | Tab `Notifikasi` (shared) |
| Middleware | auth |
| Dependencies | `services/notificationService.js` · `auth` |

## Purpose

Notifikasi aplikasi (in-app, mock) untuk update status permintaan. FCM real-time masuk fase berikutnya.

## Quick Links

- Routes → `apps/screens/shared/NotificationsScreen.js`
- Services → `apps/services/notificationService.js`
- Database → `apps/services/mockData.js` (AsyncStorage `hunihub_notifications`)
