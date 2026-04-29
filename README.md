# Pengumuman Kelulusan — SMAN 5 Garut

Sistem pengumuman kelulusan TP 2025/2026 untuk SMA Negeri 5 Garut.
Dibangun dengan FastAPI + openpyxl + Postgres, menyatu dengan stack HADIR.

## Cara Kerja

```
nilai_skl.xlsx ──parse on startup──▶ in-memory list (parser.py)
                                          │
admin override (POST) ──────────▶ Postgres (db.py)
                                          │
GET /api/login ─────────▶ status_efektif = override OR computed
GET /api/admin/students ─▶ semua siswa dengan status efektif
```

- Spreadsheet adalah **baseline**. Status awal dihitung dari nilai akhir per
  mata pelajaran (KKM = 75, Lintas Minat dikecualikan).
- Admin dapat mengubah status via UI; perubahan tersimpan di tabel
  `status_overrides` dengan timestamp dan dapat dicabut sewaktu-waktu.
- Saat siswa login, override diutamakan jika ada; jika tidak, status
  dari spreadsheet yang ditampilkan.

## File Layout

```
main.py              FastAPI app + endpoints
parser.py            Excel parser (openpyxl)
db.py                Postgres helper (psycopg v3)
nilai_skl.xlsx       Source data — replace ini saat ada perbaikan nilai
index.html           Frontend (single-page)
static/              Logos
Procfile             Railway start command
requirements.txt     Python deps
```

## Local Dev

```bash
pip install -r requirements.txt
export DATABASE_URL="postgresql://localhost/kelulusan"  # buat dulu
createdb kelulusan
uvicorn main:app --reload
```

Buka http://localhost:8000.

Login siswa: NISN + Nama (sesuai data spreadsheet).
Login admin: `1231231234` + `administrator`.

## Deploy ke Railway

1. **Push folder ini ke repo GitHub baru** (jangan dicampur dengan HADIR).
2. **Railway → New Project → Deploy from GitHub repo**.
3. **Add Postgres plugin** ke project yang sama. Railway otomatis
   inject `DATABASE_URL` ke service web.
4. Verifikasi `Procfile` ke-detect (`web: uvicorn main:app ...`).
5. Setelah deploy, buka URL service → form login muncul. Cek
   `/health` — harus mengembalikan `{"status":"ok","database_ok":true}`.

### Memperbarui nilai

Jika ada perbaikan di spreadsheet:
1. Replace `nilai_skl.xlsx` dengan versi baru.
2. Commit & push. Railway redeploy → parser baca ulang saat startup.
3. **Override yang sudah tersimpan tetap berlaku** karena disimpan
   per-NISN di Postgres, terlepas dari isi spreadsheet.

Jika ingin reset semua override: login admin → tombol "Reset Semua"
(menghapus seluruh row di `status_overrides`).

## Catatan Keamanan

- Kredensial admin **hardcoded** di `main.py` (`ADMIN_NISN`, `ADMIN_NAMA_NORMALIZED`).
  Siapa pun yang baca source code Python dapat melihatnya. Karena
  service ini hanya di-deploy di Railway dan source ada di repo
  privat, ini cukup untuk pengumuman tahunan. Untuk hardening:
  - Pindahkan ke env var (`ADMIN_NISN`, `ADMIN_NAMA`).
  - Tambahkan TOTP gate seperti di HADIR.
  - Atau pakai session token + HttpOnly cookie.
- Endpoint `/api/admin/*` mengirim kredensial di body setiap request.
  Cukup karena dijalankan di HTTPS (Railway memberi cert otomatis).
- Public-facing endpoint `/api/login` validates NISN + Nama — kalau
  nama tidak match (case-insensitive, whitespace-tolerant), siswa tidak
  bisa lihat status orang lain.

## Decisions Made

- **Lintas Minat dikecualikan** dari kalkulasi kelulusan. Berdasarkan
  analisis data: 44 siswa fail di kolom Lintas Minat saja sementara
  semua wajib + peminatan lulus — mengindikasikan masalah scoring
  Lintas Minat, bukan masalah siswa.
- **KKM = 75** untuk semua mata pelajaran wajib + peminatan.
- **Status override per-NISN**, bukan per-grade. Admin tidak mengubah
  nilai siswa; admin mengganti status final. Original status dari
  spreadsheet selalu disimpan di kolom `original_status` untuk audit.
