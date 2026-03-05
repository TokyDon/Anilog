/**
 * Anílog Design Token — Colours v3
 * Clean Modern palette — neutral cool grey base, white surfaces.
 * All colour comes from game content (type chips and rarity badges).
 */
export const colors = {

  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:       '#F1F4F9',
  surface:  '#FFFFFF',
  surface2: '#F8FAFC',

  // ── Borders ────────────────────────────────────────────────────────────────
  border:       '#E2E8F0',
  borderStrong: '#CBD5E1',

  // ── Text ───────────────────────────────────────────────────────────────────
  text1:       '#0F172A',
  text2:       '#475569',
  text3:       '#94A3B8',
  textInverse: '#FFFFFF',

  // ── Accent (intentionally neutral — no colour favouritism) ─────────────────
  accent:     '#64748B',
  accentSoft: '#F1F5F9',
  accentDeep: '#334155',

  // ── Device chrome ──────────────────────────────────────────────────────────
  bezel:   '#1E293B',
  navDark: '#0F172A',

  // ── Rarity ─────────────────────────────────────────────────────────────────
  rarity: {
    common:   '#94A3B8',
    uncommon: '#22C55E',
    rare:     '#6366F1',
    glossy:   '#F59E0B',  // static fallback — animated amber→pink→indigo in components
  },

  // ── Semantic ───────────────────────────────────────────────────────────────
  success: '#22C55E',
  error:   '#EF4444',
  warning: '#EAB308',

  // ── Overlays ───────────────────────────────────────────────────────────────
  overlayDark: 'rgba(15,23,42,0.60)',

} as const;

export type ColorToken = typeof colors;
