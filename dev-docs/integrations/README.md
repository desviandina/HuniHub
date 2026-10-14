# Integrations — HuniHub

> **Status:** OUTPUT — dibuat dari template `ai-rules/integrations/README.md`.
> **Aturan Anti-Monster:** file ini HANYA indeks. Detail integrasi ada di file terpisah.

---

## Integration Index

| # | Service | Name | Type | Criticality | Detail |
|---|---------|------|------|-------------|--------|
| 1 | `firebase` | Firebase (BaaS) | SDK | `HIGH` (MVP P0 saat aktif) | [firebase.md](./firebase.md) |
| 2 | `google-maps` | Google Maps (react-native-maps) | SDK | `MED` (lokasi MVP) | [maps.md](./google-maps.md) |

---

## Status Umum

- **Keduanya NON-AKTIF di MVP pertama** — aplikasi berjalan **mock penuh** (AsyncStorage) via flag `FIREBASE_ENABLED=false` & `MAPS_ENABLED=false` di `apps/config/environment.js`.
- Firebase `HIGH` karena auth+data seluruh aplikasi; Maps `MED` karena bisa fallback ke posisi statis di MVP.
- Detail & tata cara aktivasi: `dev-docs/ai/KNOWN_ISSUES.md` (blocked: `.env` belum terisi) + `dev-docs/ai/TASKS.md` (TASK-001, TASK-003).

---

## Integration Coding Rules (ringkas)

Saat menambah/modifikasi integrasi, AI WAJIB:
- [ ] Credential via `.env` (jangan hardcode); placeholder di `.env.example`
- [ ] Gunakan service layer yang sudah ada (jangan panggil SDK langsung dari screen)
- [ ] Graceful degradation: mode mock/null tetap jalan
- [ ] Log error, jangan crash
- [ ] Test pakai mock/fake — bukan live API
