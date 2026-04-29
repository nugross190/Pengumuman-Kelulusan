// ResultLetter.jsx — Graduation result letter view

const SUBJECT_ORDER = [
  'PAI','PKn','B. INDO','MATEMATIKA','SEJARAH INDONESIA','B.INGGRIS',
  'SENI BUDAYA','PJOK','PRAKARYA','B.SUNDA',
  'MATEMATIKA MINAT','BIOLOGI','FISIKA','KIMIA',
  'SEJARAH MINAT','GEOGRAFI','SOSIOLOGI','EKONOMI'
];
const SUBJECT_LABELS = {
  'PAI': 'Pendidikan Agama Islam & Budi Pekerti',
  'PKn': 'Pendidikan Pancasila & Kewarganegaraan',
  'B. INDO': 'Bahasa Indonesia',
  'MATEMATIKA': 'Matematika (Wajib)',
  'SEJARAH INDONESIA': 'Sejarah Indonesia',
  'B.INGGRIS': 'Bahasa Inggris',
  'SENI BUDAYA': 'Seni Budaya',
  'PJOK': 'Pendidikan Jasmani, Olahraga & Kesehatan',
  'PRAKARYA': 'Prakarya & Kewirausahaan',
  'B.SUNDA': 'Bahasa Sunda',
  'MATEMATIKA MINAT': 'Matematika (Peminatan)',
  'BIOLOGI': 'Biologi',
  'FISIKA': 'Fisika',
  'KIMIA': 'Kimia',
  'SEJARAH MINAT': 'Sejarah (Peminatan)',
  'GEOGRAFI': 'Geografi',
  'SOSIOLOGI': 'Sosiologi',
  'EKONOMI': 'Ekonomi',
};

function formatDate(d) {
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function ResultLetter({ rec, onBack }) {
  const today = new Date();
  const isLulus = rec.effective_status === 'Lulus';
  const avg = (rec.average || 0).toFixed(2);
  const seq = String(rec.nisn).slice(-3);
  const grades = SUBJECT_ORDER.filter(k => rec.grades && rec.grades[k] !== undefined);

  const stampStyle = {
    display: 'inline-block', padding: '20px 50px',
    border: `4px double ${isLulus ? COLORS.pass : COLORS.hold}`,
    fontFamily: "'Playfair Display',serif",
    fontSize: 32, fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase',
    transform: isLulus ? 'rotate(-3deg)' : 'rotate(-2deg)',
    color: isLulus ? COLORS.pass : COLORS.hold,
    position: 'relative', background: 'rgba(255,255,255,0.4)',
    borderRadius: 6, animation: 'sealIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
    animationDelay: '0.2s',
  };

  return React.createElement('div', { style: { animation: 'fadeUp 0.4s ease both' } },
    // Letter head meta
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 13, color: COLORS.fg2, marginBottom: 18, flexWrap: 'wrap', gap: 8 } },
      React.createElement('span', { style: { fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 } }, `Nomor: 421.3/${seq}/SMAN.5/2026`),
      React.createElement('span', { style: { fontStyle: 'italic' } }, formatDate(today)),
    ),
    // Title block
    React.createElement('div', { style: { textAlign: 'center', margin: '8px 0 22px' } },
      React.createElement(Pill, null, 'Surat Keterangan'),
      React.createElement('h1', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(22px,4vw,30px)', margin: '10px 0 4px', lineHeight: 1.1, color: COLORS.fg1 } },
        'Hasil ', React.createElement('em', { style: { fontStyle: 'italic', fontWeight: 500, color: COLORS.accent } }, 'Kelulusan'), ' Peserta Didik',
      ),
      React.createElement(OrnamentLine),
    ),
    // Card
    React.createElement('div', {
      style: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, boxShadow: '0 8px 24px -8px rgba(28,20,16,0.18),0 2px 6px -2px rgba(28,20,16,0.06)', padding: '32px 36px', position: 'relative' }
    },
      React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#C41E1E 0%,#C41E1E 60%,#D4A80F 60%,#D4A80F 100%)', borderRadius: '14px 14px 0 0' } }),
      React.createElement('p', { style: { fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 18, margin: '22px 0 14px', color: COLORS.fg1 } }, 'Dengan hormat,'),
      React.createElement('p', { style: { fontSize: 16, lineHeight: 1.65, margin: '0 0 16px', color: COLORS.fg2 } }, 'Berdasarkan hasil rapat pleno dewan guru SMA Negeri 5 Garut serta sesuai dengan ketentuan yang berlaku pada Tahun Pelajaran 2025/2026, dengan ini diberitahukan bahwa peserta didik dengan identitas sebagai berikut:'),
      // Student info
      React.createElement('div', { style: { margin: '20px 0 26px', background: COLORS.bgSoft, borderRadius: 8, padding: '16px 20px', borderLeft: `3px solid ${COLORS.accent}` } },
        React.createElement('dl', { style: { display: 'grid', gridTemplateColumns: '130px 1fr', gap: '6px 16px', margin: 0, fontSize: 15 } },
          React.createElement('dt', { style: { color: COLORS.fg3, fontStyle: 'italic' } }, 'Nama'),
          React.createElement('dd', { style: { margin: 0, color: COLORS.fg1, fontWeight: 600 } }, rec.nama),
          React.createElement('dt', { style: { color: COLORS.fg3, fontStyle: 'italic' } }, 'NISN'),
          React.createElement('dd', { style: { margin: 0, color: COLORS.fg1, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" } }, rec.nisn),
          React.createElement('dt', { style: { color: COLORS.fg3, fontStyle: 'italic' } }, 'NIS'),
          React.createElement('dd', { style: { margin: 0, color: COLORS.fg1, fontWeight: 600 } }, rec.nis || '—'),
          React.createElement('dt', { style: { color: COLORS.fg3, fontStyle: 'italic' } }, 'Program'),
          React.createElement('dd', { style: { margin: 0, color: COLORS.fg1, fontWeight: 600 } }, rec.jurusan === 'MIPA' ? 'MIPA (Matematika & Ilmu Pengetahuan Alam)' : 'IPS (Ilmu Pengetahuan Sosial)'),
        ),
      ),
      React.createElement('p', { style: { fontSize: 16, lineHeight: 1.65, margin: '0 0 8px', color: COLORS.fg2 } }, 'dinyatakan dengan status:'),
      // Stamp
      React.createElement('div', { style: { margin: '32px 0', textAlign: 'center' } },
        React.createElement('div', { style: stampStyle },
          isLulus ? '★ L U L U S' : 'Ditangguhkan',
        ),
        React.createElement('div', { style: { marginTop: 14, fontStyle: 'italic', fontSize: 15, color: COLORS.fg2 } },
          isLulus ? 'Selamat dan sukses atas kelulusan Anda.' : 'Status memerlukan tindak lanjut dari sekolah.',
        ),
      ),
      // Average (lulus only)
      isLulus ? React.createElement('div', { style: { margin: '24px 0 8px', padding: '18px 22px', background: `linear-gradient(135deg, ${COLORS.goldSoft}, ${COLORS.bgCard})`, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 14, textAlign: 'center', fontSize: 17, lineHeight: 1.6, color: COLORS.fg1 } },
        'Anda dinyatakan ', React.createElement('strong', { style: { color: COLORS.accent, fontWeight: 700 } }, 'LULUS'), ' dengan rata-rata nilai akhir',
        React.createElement('br'),
        React.createElement('span', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: COLORS.accentDark, letterSpacing: '0.02em' } }, avg),
      ) : null,
      // Grades table
      React.createElement('div', { style: { margin: '28px 0 22px' } },
        React.createElement('h3', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, margin: '0 0 12px', paddingBottom: 8, borderBottom: `1px solid ${COLORS.borderStrong}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: COLORS.fg1 } },
          React.createElement('span', null, 'Rincian Nilai Akhir'),
          React.createElement('span', { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.goldDeep, fontWeight: 500, letterSpacing: '0.06em' } }, `Rata-rata ${avg} / ${grades.length} Mapel`),
        ),
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 15 } },
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { style: { textAlign: 'left', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.fg3, padding: '8px 10px', borderBottom: `1px solid ${COLORS.border}` } }, 'Mata Pelajaran'),
              React.createElement('th', { style: { textAlign: 'right', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.fg3, padding: '8px 10px', borderBottom: `1px solid ${COLORS.border}` } }, 'Nilai Akhir'),
            ),
          ),
          React.createElement('tbody', null,
            grades.map(k => React.createElement('tr', { key: k },
              React.createElement('td', { style: { padding: '10px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.fg1 } }, SUBJECT_LABELS[k] || k),
              React.createElement('td', { style: { padding: '10px', borderBottom: `1px solid ${COLORS.border}`, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: rec.grades[k] < 75 ? COLORS.accent : COLORS.fg1 } }, rec.grades[k].toFixed(2)),
            ))
          ),
        ),
      ),
      // Closing
      React.createElement('div', { style: { marginTop: 22, fontSize: 15, lineHeight: 1.65, color: COLORS.fg2 } },
        isLulus
          ? React.createElement('p', null, 'Demikian pengumuman ini kami sampaikan. Kepada yang bersangkutan, kami ucapkan ', React.createElement('em', null, 'selamat'), ' dan semoga keberhasilan ini menjadi bekal yang baik untuk melanjutkan ke jenjang pendidikan berikutnya.')
          : React.createElement('p', null, 'Status kelulusan Anda saat ini ditangguhkan. Mohon segera menghubungi ', React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'wali kelas'), ' atau bagian ', React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'Kurikulum'), ' SMA Negeri 5 Garut untuk informasi tindak lanjut.'),
      ),
      // Signature
      React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 32 } },
        React.createElement('div', { style: { textAlign: 'center', fontSize: 14 } },
          React.createElement('div', { style: { fontStyle: 'italic', color: COLORS.fg2, marginBottom: 56 } }, `Garut, ${formatDate(today)}`, React.createElement('br'), 'Kepala Sekolah,'),
          React.createElement('div', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.fg1, borderTop: `1px solid ${COLORS.fg2}`, paddingTop: 4, minWidth: 200 } }, '__________________________'),
          React.createElement('div', { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.fg3, marginTop: 2 } }, 'NIP. ___________________'),
        ),
      ),
    ),
    React.createElement('button', {
      onClick: onBack,
      style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 28, background: 'transparent', color: COLORS.fg2, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, padding: '9px 18px', fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' }
    }, '← Kembali'),
  );
}

Object.assign(window, { ResultLetter });
