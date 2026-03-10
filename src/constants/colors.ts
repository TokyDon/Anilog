/**
 * Anílog Design Token — Colours v4
 * Neutral specimen-log palette.
 * UI recedes; Animon images and type colours provide all the visual interest.
 */
export const colors = {

  // ── Backgrounds (near-black dark mode) ────────────────────────────────────
  bg:       '#111111',   // near-black — premium dark, not green
  surface:  '#1C1C1E',   // iOS system-grouped secondary (very slightly warm black)
  surface2: '#2C2C2E',   // iOS tertiary — slightly lighter for inputs, chips

  // ── Borders ────────────────────────────────────────────────────────────────
  border:       '#3A3A3C',   // subtle dark separator
  borderStrong: '#545456',   // dividers that need to be seen

  // ── Text ───────────────────────────────────────────────────────────────────
  text1:       '#F5F5F5',  // near-white — primary text
  text2:       '#AEAEB2',  // secondary — iOS label secondary grey
  text3:       '#636366',  // tertiary — ghost/placeholder
  textInverse: '#111111',  // dark text on light/amber surfaces

  // ── Accent (restrained — used ONLY for primary action buttons) ─────────────
  // Not amber. Not green. A cool slate-blue that signals "action" without
  // competing with type chip colours or animon images.
  accent:     '#4F8EF7',   // clear action blue (accessible on dark bg)
  accentSoft: '#1C2D4A',   // very dark blue tint for selected chip backgrounds
  accentDeep: '#2563EB',   // deeper blue for pressed states

  // ── Device chrome ──────────────────────────────────────────────────────────
  bezel:   '#000000',
  navDark: '#0A0A0A',

  // ── Rarity (these are the ONLY high-chroma colours in the whole app) ───────
  rarity: {
    common:   '#94A3B8',   // cool grey
    uncommon: '#22C55E',   // green
    rare:     '#6366F1',   // indigo
    glossy:   '#F59E0B',   // amber — ONLY glossy gets this colour
  },

  // ── Semantic ───────────────────────────────────────────────────────────────
  success: '#22C55E',
  error:   '#EF4444',
  warning: '#F59E0B',

  // ── Overlays ───────────────────────────────────────────────────────────────
  overlayDark: 'rgba(0,0,0,0.72)',

} as const;

export type ColorToken = typeof colors;
