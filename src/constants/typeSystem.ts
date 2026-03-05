/**
 * Anílog Type System v3
 *
 * 12 elemental fantasy types. These provide all colour in the UI:
 * type chips, card gradients, and badge accents.
 */
export const ANIMON_TYPES = [
  'fire', 'water', 'grass', 'electric',
  'ice', 'dragon', 'psychic', 'bug',
  'steel', 'ground', 'rock', 'light',
] as const;

export type AnimonTypeName = (typeof ANIMON_TYPES)[number];

export interface TypeDefinition {
  label: string;
  color: string;      // background chip colour
  textColor: string;  // foreground text colour
}

export const TYPE_DEFINITIONS: Record<AnimonTypeName, TypeDefinition> = {
  fire:     { label: 'Fire',     color: '#EF4444', textColor: '#FFFFFF' },
  water:    { label: 'Water',    color: '#3B82F6', textColor: '#FFFFFF' },
  grass:    { label: 'Grass',    color: '#22C55E', textColor: '#FFFFFF' },
  electric: { label: 'Electric', color: '#EAB308', textColor: '#0F172A' },
  ice:      { label: 'Ice',      color: '#06B6D4', textColor: '#FFFFFF' },
  dragon:   { label: 'Dragon',   color: '#8B5CF6', textColor: '#FFFFFF' },
  psychic:  { label: 'Psychic',  color: '#EC4899', textColor: '#FFFFFF' },
  bug:      { label: 'Bug',      color: '#84CC16', textColor: '#0F172A' },
  steel:    { label: 'Steel',    color: '#64748B', textColor: '#FFFFFF' },
  ground:   { label: 'Ground',   color: '#D97706', textColor: '#FFFFFF' },
  rock:     { label: 'Rock',     color: '#78716C', textColor: '#FFFFFF' },
  light:    { label: 'Light',    color: '#F59E0B', textColor: '#0F172A' },
};
