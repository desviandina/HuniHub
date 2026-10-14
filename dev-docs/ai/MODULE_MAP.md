# MODULE_MAP

> **Status:** OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/MODULE_MAP-template.md`.
> **Purpose:** Mapping modul bisnis ke kode aktual.

---

## Module to Code Map

### Monolith

| Module | Route File | Screens | Services | Context/Config |
|--------|-----------|---------|----------|----------------|
| Auth & Role | `navigation/AuthNavigator.js` | `screens/auth/LoginScreen.js`, `screens/auth/RegisterScreen.js` | `services/authService.js` | `context/AuthContext.js` |
| Listings (baca) | `navigation/SeekerNavigator.js` (Tab Home/Cari) | `screens/seeker/HomeScreen.js`, `screens/seeker/SearchScreen.js`, `screens/seeker/ListingDetailScreen.js` | `services/listingService.js` | `constants/listing.js` |
| Listings (tulis) | `navigation/OwnerNavigator.js` | `screens/owner/DashboardScreen.js`, `screens/owner/ManageListingsScreen.js`, `screens/owner/AddEditListingScreen.js` | `services/listingService.js` | — |
| Location & Maps | bagian dari `ListingDetailScreen` | `screens/seeker/ListingDetailScreen.js` | `services/locationService.js` | `config/environment.js` (MAPS_ENABLED) |
| Rental Requests | stack detail; tab Riwayat/Permintaan | `screens/shared/RentalHistoryScreen.js`, `screens/owner/RentalRequestsScreen.js` | `services/rentalService.js` | — |
| Reviews | bagian dari `ListingDetailScreen` | `screens/seeker/ListingDetailScreen.js` | `services/reviewService.js` | — |
| Notifications | Tab `Notifikasi` (shared) | `screens/shared/NotificationsScreen.js` | `services/notificationService.js` | — |
| Profile | Tab `Profil` (shared) | `screens/shared/ProfileScreen.js` | `services/authService.js` (logout) | `context/AuthContext.js` |

---

## Shared Infrastructure Map

| Area | Path | Notes |
|------|------|-------|
| Config/Flags | `apps/config/environment.js` | `FIREBASE_ENABLED`, `MAPS_ENABLED` — titik switch mock<->Firebase |
| Firebase init | `apps/config/firebase.js` | InitializeApp placeholder; aktif saat config diisi |
| Theme | `apps/constants/theme.js` | Design tokens (Paper MD3) |
| Roles | `apps/constants/roles.js` | `seeker` / `owner` |
| Formatters | `apps/utils/formatters.js` | Rupiah, tanggal, jarak |
| Mock Data | `apps/services/mockData.js` | 5 listing contoh |
| AsyncStorage keys | Hash dibawah `services/*Service.js` | `hunihub_session`, `hunihub_requests`, `hunihub_reviews`, `hunihub_notifications` |
| Components bersama | `apps/components/` | `ListingCard.js`, `EmptyState.js` |
