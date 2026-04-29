// Letterhead.jsx — Kop surat header component

function Letterhead() {
  return React.createElement('header', {
    style: {
      display: 'grid', gridTemplateColumns: '64px 1fr 64px',
      gap: 14, alignItems: 'center',
      paddingBottom: 14, marginBottom: 0,
      borderBottom: `2px solid ${COLORS.fg1}`,
      position: 'relative',
    }
  },
    React.createElement('div', {
      style: { position: 'absolute', left: 0, right: 0, bottom: -5, height: 1, background: COLORS.fg1 }
    }),
    React.createElement('img', { src: '../../assets/logo-jabar.png', alt: 'Logo Jawa Barat', style: { width: '100%', height: 'auto', display: 'block' } }),
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('p', { style: { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.fg2, margin: '0 0 2px' } }, 'Pemerintah Daerah Provinsi Jawa Barat'),
      React.createElement('p', { style: { fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.fg1, margin: '0 0 3px' } }, 'Dinas Pendidikan'),
      React.createElement('p', { style: { fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 3px', lineHeight: 1.05 } }, 'SMA Negeri 5 Garut'),
      React.createElement('p', { style: { fontSize: 11, color: COLORS.fg2, fontStyle: 'italic', margin: 0, lineHeight: 1.3 } }, 'Jl. Raya Bayongbong KM. 09, Garut, Jawa Barat · NPSN: 20227522'),
    ),
    React.createElement('img', { src: '../../assets/logo-sman5-transparent.png', alt: 'Logo SMAN 5 Garut', style: { width: '100%', height: 'auto', display: 'block' } }),
  );
}

Object.assign(window, { Letterhead });
