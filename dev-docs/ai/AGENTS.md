# AGENTS — AI Working Contract (Repo `apps`)

> **Status:** GUIDANCE + OUTPUT — dibuat dari template `ai-rules/dev-docs-ai-templates/AGENTS-template.md`.
> **Scope:** Kontrak kerja AI untuk repository `apps/` (monolith). Melengkapi `AGENTS.md` di root project.

---

## 1) Project Identity

| Item | Value |
|------|-------|
| Project Type | Monolith (mobile app; backend = Firebase BaaS) |
| Repo(s) | `apps/` — satu repo kode |
| Git Folder | `apps/` (git BELUM di-init — git belum terinstal di mesin) |

---

## 2) Common Rules

### Branch and Git Policy

> Git belum terinstal. Saat aktif:
>
> 1. Kerja di `dev` (development) atau `feat/*`, BUKAN `main`.
> 2. Jangan force push ke `main`/`dev`.
> 3. Batch kecil: perubahan jelas, commit jelas.
> 4. Preflight: `cd apps && git status && git branch --show-current && git pull --rebase`

### Change Scope Rules

- Hindari refactor besar tanpa kebutuhan langsung.
- Jangan sentuh konfigurasi sensitif/secret (`.env`).
- Fokus pada root cause, bukan symptom patch.
- Bila mode app berubah (mock → Firebase), update semua service terdampak dalam satu task.

### Commit Message Format + COMMIT_LOG

```markdown
## Commit Message Format

Format: `type: judul singkat`

Body (2-5 baris):
- Apa yang dikerjakan
- Kenapa dilakukan
- Dampak perubahan

Co-authored-by: {nama_model_AI}
```

Setiap commit wajib dicatat di `dev-docs/ai/commit-logs/YYYY-MM-DD.md` + update `dev-docs/ai/COMMIT_LOG.md`.

---

## 3) Coding & Architecture (Monolith)

- Framework: React Native / Expo SDK 57, JavaScript.
- UI: Wajib React Native Paper v5 (MD3) + MaterialCommunityIcons — dilarang emoji di UI text.
- Navigasi: React Navigation (native-stack + bottom-tabs), percabangan per role di `RootNavigator`.
- Arsitektur: Service-based — UI → Context → Service → (Mock | Firebase). 
- Dogma service layer: `services/*` memisahkan UI dari sumber data (`FIREBASE_ENABLED` + `MAPS_ENABLED` di `config/environment.js`).
- State: React Context (`AuthContext`) untuk sesi + role; state lokal via hooks. Tanpa Redux.
- Formatters terpusat di `utils/formatters.js` (rupiah, tanggal, jarak — haversine).

---

## 4) Repo README Maintenance

WAJIB update `apps/README.md` setiap milestone/perubahan signifikan, sesuai `ai-rules/REPO_README_template.md`. Saat ini README `apps/` belum dibuat (proposal diajukan ke user).

---

## 5) Task Reporting Rules

Setiap task selesai + push (atau, sebelum git, setiap milestone skeleton selesai), buat laporan di `reports/task/YYYY-MM-DD-{task}.md`:
- deskripsi, tujuan, file diubah, snapshot before vs after, UAT mandiri

---

## 6) Communication Style

- Ringkas, langsung ke hasil.
- Bedakan fakta vs asumsi — tulis **Assumption based on repository analysis** saat ragu.
- Gunakan tabel untuk data terstruktur.
- Sebutkan file path lengkap saat merujuk kode.
