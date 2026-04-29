// Shared.jsx — Shared tokens + primitive components
// Exports: Badge, Pill, OrnamentLine, Spinner, COLORS

const COLORS = {
  bg: '#FDF8F0', bgCard: '#FFFFFF', bgSoft: '#F6EFE0',
  fg1: '#1C1410', fg2: '#5C4E42', fg3: '#9C8A78',
  border: '#E8DDD0', borderStrong: '#C8B89C',
  accent: '#C41E1E', accentDark: '#8B1515', accentSoft: '#FBE5E5',
  gold: '#D4A80F', goldSoft: '#FBF1C7', goldDeep: '#8A6A0A',
  pass: '#2D6A3D', passSoft: '#E2F0E5',
  hold: '#8A4A14', holdSoft: '#F8E8D4',
};

function Badge({ variant = 'lulus', children }) {
  const styles = {
    lulus: { background: COLORS.passSoft, color: COLORS.pass },
    hold: { background: COLORS.holdSoft, color: COLORS.hold },
    modified: { background: COLORS.accent, color: 'white', fontSize: 10, padding: '3px 8px' },
  };
  return React.createElement('span', {
    style: {
      display: 'inline-block', padding: '4px 10px',
      fontFamily: "'DM Sans', sans-serif", fontSize: 11,
      fontWeight: 600, letterSpacing: '0.04em', borderRadius: 100,
      ...styles[variant],
    }
  }, children);
}

function Pill({ children }) {
  return React.createElement('span', {
    style: {
      display: 'inline-block',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: '0.28em',
      color: COLORS.accent, textTransform: 'uppercase',
      background: COLORS.accentSoft, padding: '4px 14px',
      borderRadius: 100, fontWeight: 500,
    }
  }, children);
}

function OrnamentLine() {
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0 0', color: COLORS.gold }
  },
    React.createElement('div', { style: { flex: '0 1 70px', height: 1, background: COLORS.gold, opacity: 0.6 } }),
    React.createElement('div', { style: { width: 6, height: 6, background: COLORS.gold, transform: 'rotate(45deg)' } }),
    React.createElement('div', { style: { flex: '0 1 70px', height: 1, background: COLORS.gold, opacity: 0.6 } }),
  );
}

function Spinner() {
  return React.createElement('span', {
    style: {
      display: 'inline-block', width: 14, height: 14,
      border: `2px solid ${COLORS.fg3}`, borderTopColor: COLORS.accent,
      borderRadius: '50%', animation: 'spin 0.6s linear infinite',
      verticalAlign: 'middle', marginRight: 6,
    }
  });
}

Object.assign(window, { COLORS, Badge, Pill, OrnamentLine, Spinner });
