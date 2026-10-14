# Frontend Structure

> **Status:** OUTPUT — dibuat dari template `ai-rules/architecture-templates/frontend-structure.md`.
> **Purpose:** Peta frontend (React Native/Expo): rendering, layout, komponen, dependency.

---

## Rendering Model

- **Native mobile app (SPA-style, client-side):** Expo SDK 57, JavaScript. Tidak ada SSR/SSG — semua dirender di perangkat via React Native.
- Data dikirim dari **service layer** (mock AsyncStorage → Firebase BaaS). UI tidak pernah akses Firebase langsung.

---

## Layout Architecture

| Path | Purpose |
|------|---------|
| `apps/navigation/` | RootNavigator (auth gate + role gate) + navigator per role/tab |
| `apps/screens/` | Semua layar; di-split: `auth/`, `seeker/`, `owner/`, `shared/` |
| `apps/components/` | Komponen reusable (ListingCard, EmptyState) |
| `apps/context/` | State global — AuthContext (sesi + role) |
| `apps/services/` | Service layer — satu-satunya pintu data (mock | Firebase) |
| `apps/config/` | environment.js + firebase.js — titik switch mock<->Firebase |
| `apps/constants/` | theme.js (Paper MD3 tokens), roles.js, listing.js |

---

## Page Organization

- **Modular per role:** `screens/seeker/` (Pencari), `screens/owner/` (Pemilik), `screens/shared/` (dipakai kedua role).
- **Navigasi per role:** RootNavigator memilih navigator berdasarkan role dari AuthContext (`seeker` → SeekerNavigator, `owner` → OwnerNavigator), auth screen → AuthNavigator.
- Tidak ada sidebar/partial — pola mobile: bottom-tabs + native-stack.

---

## Frontend Dependencies

| Dependency | Version | Use |
|-----------|---------|-----|
| `react-native-paper` | ^5.15 | UI framework (Material Design 3) |
| `@react-navigation/native` + native-stack + bottom-tabs | v7 | Navigasi |
| `@expo/vector-icons` | bawaan Expo | MaterialCommunityIcons |
| `firebase` | ^12.19 | Backend BaaS (placeholder via `.env`) |
| `react-native-maps` | 1.27 | Peta (mock key) |
| `@react-native-async-storage/async-storage` | 2.2 | Sesi + data mock |

---

## Asset Pipeline

- **Builder:** Metro (bawaan Expo). Skeleton diuji sukses: `npx expo export --platform android`.
- **Source layout:** Expo Router launcher (`index.js` → `App.js`), folder flashscreen: `apps/assets/`.
- **Hot reload:** Expo Go / dev build via Metro.
- **Ikon:** MaterialCommunityIcons via `@expo/vector-icons` — DILARANG emoji di UI text.
