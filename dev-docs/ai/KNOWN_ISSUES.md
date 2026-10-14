# KNOWN_ISSUES

> **Status:** DATA FILE — AI WAJIB mengupdate saat ada issue baru atau terselesaikan. Hanya issue OPEN.
> **Source:** OUTPUT — dibuat dari template `ai-rules/KNOWN_ISSUES-template.md`.

---

## IMMUTABLE -- AI TIDAK BOLEH MENGUBAH TEMPLATE. File ini adalah OUTPUT (data aktual issue).

---

## Open Issues

| # | Area | Issue | Impact | Status |
|---|------|-------|--------|--------|
| 1 | `apps — Maps` | `react-native-maps` di Expo Go memakai key bawaan Expo; key sendiri hanya jalan di dev build/APK | `MED` | `Known Workaround` — gunakan dev build; mock distance jika tanpa key |
| 2 | `apps — Google Sign-In` | Google Sign-In TIDAK jalan di Expo Go (butuh native module/dev build) | `MED` | `Known Workaround` — pakai email/password dulu; dokumentasikan di README |
| 3 | `apps — Firebase` | Firebase belum dikonfigurasi; app berjalan mock; switch ke Firebase belum bisa diverifikasi | `HIGH` | `Investigating` (blocked) — menunggu `.env` + keputusan user |
| 4 | `apps — File Upload` | Foto hunian masih URL mock; upload Storage belum ada | `MED` | `Known Workaround` — pakai URL mock untuk MVP |
| 5 | `environment` | `npm install` kadang gagal `ECONNRESET` (network) | `MED` | `Known Workaround` — retry sampai sukses |
| 6 | `git` | Git belum terinstal di mesin → repo `apps/` belum di-init | `HIGH` | `Blocked` — menunggu user instal Git |

---

## Uncertainty Markers

- **Assumption based on repository analysis:** Firestore composite index akan otomatis diminta saat query filter+sort digunakan (belum teruji).
- **Assumption based on repository analysis:** bundle Android sukses (`npx expo export`) = bukti skeleton buildable, bukan bukti fitur runtime.
- **Assumption based on repository analysis:** tanpa Firebase config, service layer tetap konsisten karena kunci hanya di service layer.

---

## Resolved Issues

Lihat [RESOLVED.md](./RESOLVED.md) untuk issue yang sudah di-resolve.
