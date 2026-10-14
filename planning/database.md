# Database Plan — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/planning-templates/database.md`.
> **Catatan:** HuniHub memakai Firebase Firestore (NoSQL). Dokumen ini menggambarkan collection, dokumen, dan relasi logis.

---

## 1. Database Topology

| Connection | DB Engine | Database Name | Purpose |
|-----------|----------|--------------|---------|
| `default` | Firestore (NoSQL) | `hunihub` (projectId dari .env) | Data utama: profiles, listings, rentalRequests, reviews, notifications |

---

## 2. Entity Relationship Diagram

```text
profiles 1───< listings 1───< rentalRequests >───1 profiles (seeker)
   │                │                │
   │                │                └──> status: pending | accepted | rejected | canceled
   │                └──< reviews (1 listing : n reviews)
   └──< notifications (referensi userId)
```

Relasi di Firestore menggunakan field reference (denormalisasi ringan): setiap dokumen menyimpan ID referensi (mis. `listing.ownerId`, `rentalRequest.seekerId`).

---

## 3. Collection Schemas

### `profiles`

| Field | Type | Constraints | Index | Notes |
|-------|------|------------|-------|-------|
| `uid` | string | PK (= auth user uid) | PRIMARY | Disimpan saat register |
| `email` | string | NOT NULL | UNIQUE (via auth) | |
| `name` | string | NOT NULL | | |
| `role` | string | enum: `seeker` / `owner` | INDEX | Ditetapkan saat daftar, immutable |
| `photoURL` | string | nullable | | Google photo |
| `createdAt` | timestamp | | | |

### `listings`

| Field | Type | Constraints | Index | Notes |
|-------|------|------------|-------|-------|
| `id` | string | auto (doc id) | PRIMARY | |
| `ownerId` | string | FK -> profiles.uid | INDEX | Write rule: ownerId == request.auth.uid |
| `title` | string | NOT NULL | | |
| `type` | string | enum: homestay / rumah / kost | INDEX | Filter jenis |
| `price` | number | > 0 | INDEX | Filter harga |
| `location` | string | NOT NULL | | Teks alamat |
| `description` | string | | | |
| `facilities` | array<string> | | | |
| `images` | array<string> | | URL (mock / Storage) |
| `lat` | number | | geospatial (future) | |
| `lng` | number | | geospatial (future) | |
| `distanceKm` | number | | | Jarak contoh (mock) |
| `available` | boolean | default true | INDEX | Sembunyikan saat false |
| `rating` | number | | | Rata-rata ulasan (derived) |
| `reviewCount` | number | | | Derived dari reviews |
| `createdAt` | timestamp | | | |
| `updatedAt` | timestamp | | | |

### `rentalRequests`

| Field | Type | Constraints | Index | Notes |
|-------|------|------------|-------|-------|
| `id` | string | auto | PRIMARY | |
| `listingId` | string | FK -> listings.id | INDEX | |
| `seekerId` | string | FK -> profiles.uid | INDEX | Queries by seeker |
| `ownerId` | string | FK -> profiles.uid | INDEX | Queries by owner |
| `listingTitle` | string | | | Denormalisasi utk tampilan |
| `startDate` | string | ISO date | | |
| `durationDays` | number | > 0 | | |
| `totalPrice` | number | | | price * duration |
| `status` | string | enum pending/accepted/rejected/canceled | INDEX | |
| `createdAt` | timestamp | | | |
| `updatedAt` | timestamp | | | Saat status berubah |

### `reviews`

| Field | Type | Constraints | Index | Notes |
|-------|------|------------|-------|-------|
| `id` | string | auto | PRIMARY | |
| `listingId` | string | FK -> listings.id | INDEX | |
| `reviewerId` | string | FK -> profiles.uid | | |
| `reviewerName` | string | | Denormalisasi | |
| `rating` | number | 1..5 | | |
| `comment` | string | | | |
| `createdAt` | timestamp | | | |

### `notifications`

| Field | Type | Constraints | Index | Notes |
|-------|------|------------|-------|-------|
| `id` | string | auto | PRIMARY | |
| `userId` | string | nullable | INDEX | null = untuk semua |
| `title` | string | | | |
| `body` | string | | | |
| `read` | boolean | default false | | |
| `createdAt` | timestamp | | | |

---

## 4. Relationships Summary

| Table A | Relation | Table B | Foreign Key |
|---------|----------|---------|-------------|
| profiles | hasMany | listings | listings.ownerId |
| listings | hasMany | rentalRequests | rentalRequests.listingId |
| profiles | hasMany | rentalRequests | rentalRequests.seekerId (& ownerId) |
| listings | hasMany | reviews | reviews.listingId |
| profiles | hasMany | notifications | notifications.userId |

---

## 5. Indexing Strategy

| Collection | Index | Columns | Type | Reason |
|-------|-------|---------|------|--------|
| listings | `idx_type` | type | auto (Firestore) | Filter jenis |
| listings | `idx_available` | available | auto | Hanya tampil tersedia |
| listings | `idx_owner` | ownerId | auto | Daftar hunian milik pemilik |
| rentalRequests | `idx_seeker` | seekerId | auto | Riwayat pencari |
| rentalRequests | `idx_owner` | ownerId | auto | Permintaan pemilik |
| rentalRequests | `idx_status` | status | auto | Kelola status |
| reviews | `idx_listing` | listingId | auto | Ulasan per hunian |

Catatan: Firestore membuat index otomatis untuk query sederhana. Composite index (mis. `type + price`) dibuat otomatis via prompt saat query dipakai.

---

## 6. Migration / Bootstrap Plan

| # | Action | Collection | Domain |
|---|--------|-----------|-------|
| 1 | Hapus/index tidak diperlukan (Firestore schema-less) | — | — |
| 2 | Seed profiles (jika perlu demo) | profiles | Auth |
| 3 | Seed listings contoh | listings | Listings |

---

## 7. Seed Data

| Seeder | Purpose | Data Source |
|--------|---------|------------|
| Mock listings | Skeleton bisa diuji tanpa Firebase | `apps/services/mockData.js` (5 listing) |
| Default notification | Welcome notification | `apps/services/notificationService.js` |