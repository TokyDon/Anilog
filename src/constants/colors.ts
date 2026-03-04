/**
 * Anílog Design Token — Colours
 * Single source of truth for all colour values.
 * Matches the UX/UI spec verbatim.
 */
export const colors = {
  primary: '#2D6A4F',
  accent: '#E9C46A',
  background: '#FAFAF5',
  surface: '#FFFFFF',
  error: '#DC2626',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },
  rarity: {
    common: '#9CA3AF',
    uncommon: '#34D399',
    rare: '#60A5FA',
    glossy: '#FFD700', // base colour — iridescent animation handled in component
  },
  overlay: {
    dark: 'rgba(0,0,0,0.5)',
    light: 'rgba(255,255,255,0.15)',
  },
} as const;

export type ColorToken = typeof colors;
