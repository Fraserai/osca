export const designTokens = {
  colors: {
    canvas: '#f7f4ee',
    canvasStrong: '#eef4ff',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceWarm: '#fff7ed',
    textPrimary: '#111827',
    textSecondary: '#516074',
    textTertiary: '#94a3b8',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    accentBlue: '#1d4ed8',
    accentGold: '#d97706',
    accentTeal: '#0f766e',
    accentCoral: '#dc2626'
  },
  gradients: {
    hero:
      'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 46%, rgba(232,240,255,0.96) 100%)',
    report:
      'linear-gradient(140deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.98) 42%, rgba(255,247,237,0.92) 100%)',
    lensNow:
      'linear-gradient(135deg, rgba(254,242,242,0.98) 0%, rgba(255,255,255,0.98) 100%)',
    lensNear:
      'linear-gradient(135deg, rgba(255,247,237,0.98) 0%, rgba(255,255,255,0.98) 100%)',
    lensSafe:
      'linear-gradient(135deg, rgba(240,253,244,0.98) 0%, rgba(255,255,255,0.98) 100%)',
    toolbar:
      'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 100%)'
  },
  shadows: {
    card: '0 18px 50px rgba(15,23,42,0.07)',
    lift: '0 24px 60px rgba(15,23,42,0.12)',
    panel: '0 32px 90px rgba(15,23,42,0.16)',
    subtle: '0 10px 24px rgba(15,23,42,0.05)'
  },
  radii: {
    section: '32px',
    card: '24px',
    tile: '20px',
    pill: '999px'
  }
} as const;
