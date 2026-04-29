// AdminPanel.jsx — Admin panel view

const MOCK_STUDENTS = Array.from({ length: 30 }, (_, i) => {
  const names = ['Ahmad Fauzan','Siti Rahayu','Budi Santoso','Dewi Lestari','Eko Prasetyo','Fitri Handayani','Gilang Ramadhan','Hana Pertiwi','Irfan Maulana','Jihan Aulia','Kevin Pratama','Laila Mufida','Muhammad Rizal','Nadia Putri','Omar Syah','Putri Amalia','Qori Anwar','Reza Gunawan','Sari Indah','Taufik Hidayat','Ulfa Ramadhani','Vina Kusuma','Wahyu Nugroho','Xandra Meirina','Yusuf Pratama','Zahra Kalima','Andi Setiawan','Bella Safitri','Candra Wijaya','Dinda Maharani'];
  const jurusan = i % 3 === 0 ? 'IPS' : 'MIPA';
  const avg = 72 + Math.random() * 22;
  const status = avg >= 75 ? 'Lulus' : 'Ditangguhkan';
  return { nisn: String(2000000000 + i).padStart(10,'0'), nama: names[i], jurusan, average: avg, effective_status: status, is_overridden: i === 3 || i === 11 };
});

function AdminPanel({ onBack }) {
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterJurusan, setFilterJurusan] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [students, setStudents] = React.useState(MOCK_STUDENTS);
  const PAGE_SIZE = 10;

  const filtered = students.filter(s => {
    const q = search.trim().toUpperCase();
    if (q && !(s.nama.toUpperCase().includes(q) || s.nisn.includes(q))) return false;
    if (filterStatus === 'modified' && !s.is_overridden) return false;
    else if (filterStatus !== 'all' && filterStatus !== 'modified' && s.effective_status !== filterStatus) return false;
    if (filterJurusan !== 'all' && s.jurusan !== filterJurusan) return false;
    return true;
  }).sort((a,b) => a.nama.localeCompare(b.nama));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStudents = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const lulus = students.filter(s => s.effective_status === 'Lulus').length;
  const hold = students.filter(s => s.effective_status === 'Ditangguhkan').length;
  const modified = students.filter(s => s.is_overridden).length;

  function toggleStatus(nisn) {
    setStudents(prev => prev.map(s => s.nisn === nisn ? { ...s, effective_status: s.effective_status === 'Lulus' ? 'Ditangguhkan' : 'Lulus', is_overridden: true } : s));
  }

  const inputStyle = { flex: '1 1 220px', minWidth: 0, background: COLORS.bgSoft, border: '1.5px solid transparent', borderRadius: 8, padding: '9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: COLORS.fg1, outline: 'none' };
  const selectStyle = { background: COLORS.bgSoft, border: '1.5px solid transparent', borderRadius: 8, padding: '9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: COLORS.fg1, outline: 'none', cursor: 'pointer' };

  return React.createElement('div', null,
    React.createElement('div', { style: { textAlign: 'center', margin: '8px 0 20px' } },
      React.createElement(Pill, null, 'Panel Administrator'),
      React.createElement('h1', { style: { fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 'clamp(22px,4vw,30px)', margin: '10px 0 4px', lineHeight: 1.1, color: COLORS.fg1 } },
        'Daftar ', React.createElement('em', { style: { fontStyle: 'italic', fontWeight: 500, color: COLORS.accent } }, 'Status Kelulusan'), ' Peserta Didik',
      ),
    ),
    // Banner
    React.createElement('div', { style: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.accent}`, borderRadius: 8, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 14, lineHeight: 1.5, color: COLORS.fg2, boxShadow: '0 1px 3px rgba(28,20,16,0.06)' } },
      React.createElement('span', { style: { fontFamily: "'Playfair Display',serif", fontSize: 24, lineHeight: 1, color: COLORS.accent, flexShrink: 0, fontWeight: 900 } }, '§'),
      React.createElement('div', null, React.createElement('strong', { style: { color: COLORS.fg1, fontWeight: 600 } }, 'Persisten via Postgres. '), 'Setiap perubahan status disimpan ke basis data dengan timestamp. Status dari spreadsheet menjadi ', React.createElement('em', null, 'baseline'), '; perubahan admin mengganti status tersebut sampai dicabut.'),
    ),
    // Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 } },
      [['Total Siswa', students.length, COLORS.fg1], ['Lulus', lulus, COLORS.pass], ['Ditangguhkan', hold, COLORS.hold], ['Diubah', modified, COLORS.accent]].map(([lbl, val, color]) =>
        React.createElement('div', { key: lbl, style: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 3px rgba(28,20,16,0.06)' } },
          React.createElement('div', { style: { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.fg3 } }, lbl),
          React.createElement('div', { style: { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color, lineHeight: 1.1, marginTop: 4 } }, val),
        )
      )
    ),
    // Toolbar
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 14, padding: '12px 14px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(28,20,16,0.06)' } },
      React.createElement('input', { type: 'text', placeholder: 'Cari nama atau NISN…', value: search, onChange: e => { setSearch(e.target.value); setPage(1); }, style: inputStyle }),
      React.createElement('select', { value: filterStatus, onChange: e => { setFilterStatus(e.target.value); setPage(1); }, style: selectStyle },
        React.createElement('option', { value: 'all' }, 'Semua Status'),
        React.createElement('option', { value: 'Lulus' }, 'Lulus saja'),
        React.createElement('option', { value: 'Ditangguhkan' }, 'Ditangguhkan saja'),
        React.createElement('option', { value: 'modified' }, 'Hanya yang diubah'),
      ),
      React.createElement('select', { value: filterJurusan, onChange: e => { setFilterJurusan(e.target.value); setPage(1); }, style: selectStyle },
        React.createElement('option', { value: 'all' }, 'Semua Program'),
        React.createElement('option', { value: 'MIPA' }, 'MIPA'),
        React.createElement('option', { value: 'IPS' }, 'IPS'),
      ),
      React.createElement('span', { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.1em', color: COLORS.fg3, textTransform: 'uppercase', marginLeft: 'auto', whiteSpace: 'nowrap' } }, `${filtered.length} baris`),
    ),
    // Table
    React.createElement('div', { style: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(28,20,16,0.06)' } },
      React.createElement('div', { style: { overflowX: 'auto' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 700 } },
          React.createElement('thead', null,
            React.createElement('tr', null,
              ['#','Nama','NISN','Program','Rata-rata','Status',''].map(h =>
                React.createElement('th', { key: h, style: { background: COLORS.fg1, color: COLORS.bg, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 14px', textAlign: h === 'Rata-rata' ? 'right' : 'left' } }, h)
              )
            )
          ),
          React.createElement('tbody', null,
            pageStudents.length === 0
              ? React.createElement('tr', null, React.createElement('td', { colSpan: 7, style: { textAlign: 'center', padding: 40, fontStyle: 'italic', color: COLORS.fg3 } }, 'Tidak ada data yang sesuai filter.'))
              : pageStudents.map((s, i) => React.createElement('tr', { key: s.nisn, style: { borderBottom: `1px solid ${COLORS.border}`, background: s.is_overridden ? COLORS.goldSoft : 'transparent' } },
                  React.createElement('td', { style: { padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: COLORS.fg3 } }, (page-1)*PAGE_SIZE + i + 1),
                  React.createElement('td', { style: { padding: '10px 14px', fontWeight: 600, color: COLORS.fg1 } },
                    s.nama,
                    s.is_overridden ? React.createElement(Badge, { variant: 'modified', key: 'mod' }, 'Diubah') : null,
                  ),
                  React.createElement('td', { style: { padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: COLORS.fg2 } }, s.nisn),
                  React.createElement('td', { style: { padding: '10px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.06em', color: COLORS.fg3 } }, s.jurusan),
                  React.createElement('td', { style: { padding: '10px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: COLORS.fg1 } }, s.average.toFixed(2)),
                  React.createElement('td', { style: { padding: '10px 14px' } }, React.createElement(Badge, { variant: s.effective_status === 'Lulus' ? 'lulus' : 'hold' }, s.effective_status)),
                  React.createElement('td', { style: { padding: '10px 14px' } },
                    React.createElement('button', { onClick: () => toggleStatus(s.nisn), style: { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', background: 'transparent', color: COLORS.accent, border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer' } }, 'Ubah')
                  ),
                ))
          ),
        ),
      ),
      // Pagination
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderTop: `1px solid ${COLORS.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: COLORS.fg2 } },
        React.createElement('button', { onClick: () => setPage(p => p-1), disabled: page <= 1, style: { fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: 'transparent', color: COLORS.fg2, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, padding: '6px 12px', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.3 : 1 } }, '← Prev'),
        React.createElement('span', null, `Halaman ${page} / ${totalPages}`),
        React.createElement('button', { onClick: () => setPage(p => p+1), disabled: page >= totalPages, style: { fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: 'transparent', color: COLORS.fg2, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, padding: '6px 12px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.3 : 1 } }, 'Next →'),
      ),
    ),
    React.createElement('button', { onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 28, background: 'transparent', color: COLORS.fg2, border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8, padding: '9px 18px', fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' } }, '← Logout'),
  );
}

Object.assign(window, { AdminPanel });
