# Pengumuman Kelulusan — UI Kit

Interactive click-through prototype of the SMAN 5 Garut graduation announcement web app.

## Screens

1. **Login** — Student entry form (NISN + full name)
2. **Result Letter (Lulus)** — Passed graduation letter with stamp, grades table, signature block
3. **Result Letter (Ditangguhkan)** — On-hold letter with failed subjects
4. **Admin Panel** — Staff table view with filters, pagination, status toggle

## Usage

Open `index.html` — it runs as a fully self-contained interactive prototype with simulated API responses (no backend needed). Demo credentials:

- **Student (Lulus):** NISN `0012345678`, Nama `Ahmad Rizki Fauzan`
- **Student (Ditangguhkan):** NISN `0087654321`, Nama `Siti Nuraeni`
- **Admin:** NISN `1231231234`, Nama `administrator`

## Files

- `index.html` — Entry point, wires all components together
- `Shared.jsx` — Tokens, primitives (Badge, Pill, OrnamentLine)
- `Letterhead.jsx` — Kop surat (header with logos)
- `LoginCard.jsx` — Student login form
- `ResultLetter.jsx` — Graduation result letter view
- `AdminPanel.jsx` — Admin panel view
