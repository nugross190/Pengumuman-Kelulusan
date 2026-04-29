// LoginCard.jsx — Student login form component

function LoginCard({ onLogin }) {
  const [nisn, setNisn] = React.useState('');
  const [nama, setNama] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [focusedField, setFocusedField] = React.useState(null);

  const DEMO_STUDENTS = {
    '0012345678|ahmad rizki fauzan': {
      nisn: '0012345678', nis: '212200123', nama: 'Ahmad Rizki Fauzan',
      jurusan: 'MIPA', effective_status: 'Lulus', average: 88.45,
      grades: { 'PAI': 88, 'PKn': 85, 'B. INDO': 90, 'MATEMATIKA': 87, 'SEJARAH INDONESIA': 82, 'B.INGGRIS': 91, 'SENI BUDAYA': 88, 'PJOK': 90, 'PRAKARYA': 85, 'B.SUNDA': 84, 'MATEMATIKA MINAT': 89, 'BIOLOGI': 86, 'FISIKA': 88, 'KIMIA': 87 },
    },
    '0087654321|siti nuraeni': {
      nisn: '0087654321', nis: '212200456', nama: 'Siti Nuraeni',
      jurusan: 'IPS', effective_status: 'Ditangguhkan', average: 72.10,
      failed_subjects: ['MATEMATIKA', 'EKONOMI'],
      grades: { 'PAI': 82, 'PKn': 80, 'B. INDO': 85, 'MATEMATIKA': 68, 'SEJARAH INDONESIA': 79, 'B.INGGRIS': 77, 'SENI BUDAYA': 82, 'PJOK': 88, 'PRAKARYA': 80, 'B.SUNDA': 76, 'SEJARAH MINAT': 78, 'GEOGRAFI': 75, 'SOSIOLOGI': 80, 'EKONOMI': 70 },
    },
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!nisn.trim() || !nama.trim()) { setError('Mohon lengkapi NISN dan Nama.'); return; }

    const key = `${nisn.trim()}|${nama.trim().toLowerCase().replace(/\s+/g,' ')}`;
    if (nisn.trim() === '1231231234' && nama.trim().toLowerCase() === 'administrator') {
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin({ role: 'admin' }); }, 800);
      return;
    }
    const student = DEMO_STUDENTS[key];
    if (!student) { setError('NISN atau nama tidak ditemukan. Periksa kembali data Anda.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ role: 'student', data: student }); }, 900);
  }

  const inputStyle = (field) => ({
    width: '100%', background: focusedField === field ? '#fff' : COLORS.bgSoft,
    border: `1.5px solid ${focusedField === field ? COLORS.accent : 'transparent'}`,
    borderRadius: 8, padding: '11px 14px',
    fontFamily: "'DM Sans',sans-serif", fontSize: 16,
    color: COLORS.fg1, outline: 'none',
    boxShadow: focusedField === field ? `0 0 0 3px ${COLORS.accentSoft}` : 'none',
    transition: 'all 0.18s ease',
  });

  return React.createElement('div', null,
    React.createElement('div', { style: { textAlign: 'center', margin: '28px 0 32px' } },
      React.createElement(Pill, null, 'Pengumuman Resmi'),
      React.createElement('h1', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(28px,5vw,40px)', margin: '10px 0 4px', letterSpacing: '0.01em', lineHeight: 1.1, color: COLORS.fg1 } },
        'Pengumuman ', React.createElement('em', { style: { fontStyle: 'italic', fontWeight: 500, color: COLORS.accent } }, 'Kelulusan')
      ),
      React.createElement('div', { style: { fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 18, color: COLORS.fg2, marginTop: 6 } }, 'Tahun Pelajaran 2025 / 2026'),
      React.createElement(OrnamentLine),
    ),
    React.createElement('div', {
      style: {
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        borderRadius: 14, boxShadow: '0 8px 24px -8px rgba(28,20,16,0.18),0 2px 6px -2px rgba(28,20,16,0.06)',
        padding: '32px 36px', position: 'relative',
      }
    },
      React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#C41E1E 0%,#C41E1E 60%,#D4A80F 60%,#D4A80F 100%)', borderRadius: '14px 14px 0 0' } }),
      React.createElement('p', { style: { fontSize: 16, lineHeight: 1.6, margin: '0 0 22px', color: COLORS.fg2 } },
        'Kepada peserta didik kelas ', React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'XII'),
        ', silakan masukkan ', React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'NISN'),
        ' dan ', React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'Nama Lengkap'),
        ' Anda untuk melihat hasil pengumuman kelulusan secara resmi.',
      ),
      React.createElement('form', { onSubmit: handleSubmit, autoComplete: 'off' },
        React.createElement('div', { style: { marginBottom: 18 } },
          React.createElement('label', { style: { display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.fg2, marginBottom: 6 } }, 'Nomor Induk Siswa Nasional (NISN)'),
          React.createElement('input', { type: 'text', value: nisn, onChange: e => setNisn(e.target.value), style: inputStyle('nisn'), onFocus: () => setFocusedField('nisn'), onBlur: () => setFocusedField(null), inputMode: 'numeric', maxLength: 12 }),
          React.createElement('div', { style: { fontSize: 13, color: COLORS.fg3, fontStyle: 'italic', marginTop: 6 } }, '10 digit angka, sesuai data dapodik Anda.'),
        ),
        React.createElement('div', { style: { marginBottom: 18 } },
          React.createElement('label', { style: { display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.fg2, marginBottom: 6 } }, 'Nama Lengkap'),
          React.createElement('input', { type: 'text', value: nama, onChange: e => setNama(e.target.value), style: inputStyle('nama'), onFocus: () => setFocusedField('nama'), onBlur: () => setFocusedField(null) }),
          React.createElement('div', { style: { fontSize: 13, color: COLORS.fg3, fontStyle: 'italic', marginTop: 6 } }, 'Sesuai ijazah / dokumen sekolah.'),
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, flexWrap: 'wrap' } },
          React.createElement('button', {
            type: 'submit', disabled: loading,
            style: { fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.04em', background: loading ? COLORS.accentDark : COLORS.accent, color: 'white', border: 'none', padding: '13px 26px', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 6px -2px rgba(196,30,30,0.4)', opacity: loading ? 0.7 : 1 }
          }, loading ? React.createElement('span', null, React.createElement(Spinner), 'Memuat...') : 'Lihat Pengumuman'),
        ),
        error ? React.createElement('div', { style: { color: COLORS.accent, fontSize: 14, background: COLORS.accentSoft, padding: '8px 12px', borderRadius: 8, marginTop: 12 } }, error) : null,
      ),
      React.createElement('div', { style: { marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.fg3, fontStyle: 'italic' } },
        'Demo: NISN 0012345678 / Ahmad Rizki Fauzan (Lulus) · 0087654321 / Siti Nuraeni (Ditangguhkan) · 1231231234 / administrator (Admin)',
      ),
    ),
  );
}

Object.assign(window, { LoginCard });
