// Neon cyberpunk color palette
export const COLORS = {
  bg: '#0a0a1a',
  bgPanel: '#0d0d2b',
  bgCard: '#111133',
  gridBg: '#0a0a2e',
  gridLine: '#1a1a4e',

  // Cell colors (index 1-7)
  cells: [
    '', // 0 = empty
    '#00ffff', // 1 = cyan
    '#ff00ff', // 2 = magenta
    '#ffff00', // 3 = yellow
    '#00ff88', // 4 = green
    '#ff8800', // 5 = orange
    '#4488ff', // 6 = blue
    '#ff4444', // 7 = red
  ],

  // Darker versions for placed cells
  cellsDark: [
    '',
    '#005566',
    '#550055',
    '#555500',
    '#005533',
    '#553300',
    '#223366',
    '#552222',
  ],

  neonPink: '#ff2d95',
  neonBlue: '#00d4ff',
  neonGreen: '#39ff14',
  neonPurple: '#b026ff',
  neonYellow: '#fff01f',

  text: '#e0e0ff',
  textDim: '#6666aa',
  textBright: '#ffffff',

  junk: '#444466',
  junkGap: '#222244',

  valid: 'rgba(57, 255, 20, 0.35)',
  invalid: 'rgba(255, 45, 45, 0.35)',
  ghostOutline: 'rgba(255, 255, 255, 0.2)',
};

export const GLOW = {
  small: 4,
  medium: 8,
  large: 16,
  huge: 24,
};

export const FONT = {
  pixel: "'Press Start 2P', 'Courier New', monospace",
  ui: "'Orbitron', 'Courier New', monospace",
};
