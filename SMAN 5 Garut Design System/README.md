# SMAN 5 Garut — Design System

> Design system for **Pengumuman Kelulusan** — the official graduation announcement web app for SMA Negeri 5 Garut (Sekolah Menengah Atas Negeri 5 Garut), a public high school in Garut, West Java, Indonesia.

## Sources

- **Codebase:** https://github.com/nugross190/Pengumuman-Kelulusan
- **Uploaded logos:** `uploads/logo sma.jpeg` (SMAN 5 Garut), `uploads/Logo-Jawa-Barat-1.png` (West Java province)
- **Stack:** FastAPI + openpyxl + PostgreSQL, single-page frontend (`index.html`)

## Product Context

The product is a **one-page web application** that serves two audiences:

1. **Siswa (Students, Class XII)** — Log in with their NISN (national student ID) + full name to receive their official graduation result as a formal letter (surat keterangan), complete with subject grades, a LULUS/Ditangguhkan stamp, and a signature block.
2. **Admin (School Staff)** — Log in with special credentials to view all students in a paginated table, override individual statuses, and reset overrides.

The app is purely informational and ceremonial — it produces a printable, official-looking letter. It is deployed annually on Railway and connects to a PostgreSQL database seeded from an Excel spreadsheet (`nilai_skl.xlsx`).

---

## CONTENT FUNDAMENTALS

### Language
- **Indonesian (Bahasa Indonesia)** throughout — formal register.
- Occasional Sundanese context (Garut is in West Java / Sunda region).

### Tone
- **Formal, official, institutional.** Matches the register of a government school document.
- Third-person references to the student: "peserta didik" (student participant), "yang bersangkutan" (the party concerned).
- Polite first-person plural for the school: "kami" (we).
- Phrases like "Dengan hormat," (With respect,) open formal letters.

### Casing
- Section headings: **UPPERCASE or Title Case** depending on context.
- Labels: ALL CAPS with wide letter-spacing (e.g. `NISN`, `NAMA LENGKAP`).
- Subject names: ALL CAPS (e.g. `MATEMATIKA`, `BIOLOGI`).

### Emoji
- **Not used.** The brand is strictly formal/institutional; no emoji anywhere.

### Copy Examples
- "Kepada peserta didik kelas XII, silakan masukkan NISN dan Nama Lengkap Anda untuk melihat hasil pengumuman kelulusan secara resmi."
- "dinyatakan dengan status: **LULUS**" / "**Ditangguhkan**"
- "Selamat dan sukses atas kelulusan Anda."
- "Mohon segera menghubungi wali kelas atau bagian Kurikulum SMAN 5 Garut."

---

## VISUAL FOUNDATIONS

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FDF8F0` | Page background — warm cream |
| `--bg-card` | `#FFFFFF` | Card/panel background |
| `--bg-soft` | `#F6EFE0` | Subtle input/info background |
| `--bg-active` | `#FEF3E7` | Hover/active state background |
| `--text` | `#1C1410` | Primary text — warm near-black ink |
| `--text-2` | `#5C4E42` | Secondary text |
| `--text-3` | `#9C8A78` | Tertiary / hint text |
| `--border` | `#E8DDD0` | Default border |
| `--border-strong` | `#C8B89C` | Stronger dividers |
| `--accent` | `#C41E1E` | SMAN 5 red — primary action, stamps, headings |
| `--accent-dark` | `#8B1515` | Hover state for accent |
| `--accent-soft` | `#FBE5E5` | Red tint background |
| `--gold` | `#D4A80F` | Ceremonial gold — ornaments, decorations |
| `--gold-soft` | `#FBF1C7` | Gold tint background |
| `--gold-deep` | `#8A6A0A` | Dark gold for grade metadata |
| `--pass` | `#2D6A3D` | LULUS green |
| `--pass-soft` | `#E2F0E5` | Green tint background |
| `--hold` | `#8A4A14` | Ditangguhkan amber-brown |
| `--hold-soft` | `#F8E8D4` | Amber tint background |

**Color vibe:** Warm, parchment/document toned. The cream background references official letter paper. Red and gold are the school's ceremonial colors. Green/amber are purely semantic (pass/hold).

### Typography
- **Display:** `Playfair Display` — serif, weights 500/700/900, used for headings, school name, stamps, letter salutations. Italic variant used decoratively.
- **Body:** `DM Sans` — humanist sans, weights 400/500/600/700, used for all UI text, labels, body copy.
- **Mono:** `JetBrains Mono` — used for NISN numbers, letter references, metadata labels, table counts.
- All loaded via **Google Fonts CDN** — these are the confirmed official typefaces for this design system.

### Spacing & Layout
- Max content width: `760px` (student view), `1100px` (admin view)
- Padding: `28px 20px` desktop, `16px 12px` mobile
- Card padding: `32px 36px`

### Corner Radii
- Cards: `14px`
- Inputs, buttons, small elements: `8px`
- Badges/pills: `100px` (fully rounded)
- Stamps: `6px`

### Shadows
- Default: `0 1px 3px rgba(28,20,16,0.06), 0 1px 2px rgba(28,20,16,0.04)`
- Large (cards): `0 8px 24px -8px rgba(28,20,16,0.18), 0 2px 6px -2px rgba(28,20,16,0.06)`
- Focus ring: `0 0 0 3px var(--accent-soft)` (3px red tint glow)

### Backgrounds & Texture
- Page background: subtle radial gradients at top-right (red tint) and bottom-left (gold tint) as a fixed overlay. Creates depth without heavy imagery.
- No full-bleed images, no illustrations, no patterns.
- Cards are pure white with a 4px top-border bar: red (60%) + gold (40%) gradient.

### Borders
- Cards: `1px solid var(--border)`
- Info boxes: `border-left: 3px solid var(--accent)` (left accent stripe)
- Letterhead bottom: `2px solid var(--text)` + thin `1px` rule below

### Animations
- Button hover: `translateY(-1px)` + deeper shadow, 0.18s ease
- Button active: `translateY(0)`
- Stamp entrance: `seal-in` keyframe — scales from 2× + rotated, bounces to final with cubic-bezier spring
- Result sections: `fade-up` stagger (0.05s increments per child)
- Modal: `fade-up` 0.22s ease
- Loading spinner: `spin` 0.6s linear
- All transitions: `0.18s ease`

### Hover States
- Buttons: color darkens + slight lift (`translateY(-1px)`)
- Back/secondary buttons: background becomes `var(--text)` (near-black), text turns white
- Table rows: background shifts to `var(--bg-soft)`
- Modified rows: background `var(--gold-soft)`

### Iconography
- **No icon library.** The app uses no icon font, no SVG icons, no emoji.
- The only "icons" are unicode characters used inline: `★` (star above LULUS stamp), `※` (reference mark above Ditangguhkan stamp), `§` (section sign in admin banner), `←` (back button arrow), `→` (modal change arrow).
- Logos are PNG files (letterhead header).

### Cards
- White background, `14px` radius, large shadow
- 4px gradient top-border (red → gold)
- `32px 36px` padding

### Print
- Body gradient overlay hidden
- Card borders/shadows hidden
- Actions, back button, login/admin views hidden
- Clean letter document output

---

## ICONOGRAPHY

No third-party icon system is used. The app relies on:
- **Unicode glyphs** as inline decorative marks (`★`, `※`, `§`, `←`, `→`, `·`)
- **Letterhead logos** (PNG) — see `assets/`

**Assets in `assets/`:**
- `logo-sman5.png` — Original SMAN 5 Garut logo (yellow badge, 1024×1024)
- `logo-sman5-transparent.png` — Background-removed version (transparent PNG)
- `logo-jabar.png` — West Java province logo (transparent PNG, 1920×2240)

---

## File Index

```
README.md                    This file
SKILL.md                     Agent skill definition
colors_and_type.css          CSS custom properties (colors + typography tokens)
assets/
  logo-sman5.png             SMAN 5 Garut logo (original)
  logo-sman5-transparent.png SMAN 5 Garut logo (background removed)
  logo-jabar.png             Jawa Barat province logo
preview/
  colors-brand.html          Brand color palette
  colors-semantic.html       Semantic colors (pass/hold/bg/text)
  type-scale.html            Typography scale specimen
  type-fonts.html            Font families specimen
  spacing-tokens.html        Radius + shadow + spacing tokens
  components-buttons.html    Button states
  components-inputs.html     Form input states
  components-badges.html     Badge + stamp components
  components-card.html       Card component
  components-letterhead.html Letterhead component
  brand-logos.html           Logo showcase
ui_kits/
  pengumuman/
    README.md                UI kit overview
    index.html               Interactive prototype
    Letterhead.jsx           Kop surat component
    LoginCard.jsx            Student login form
    ResultLetter.jsx         Graduation result letter
    AdminPanel.jsx           Admin panel
    Shared.jsx               Shared tokens + primitives
```
