/**
 * Anílog Type System
 *
 * Defines all 10 Anímon type tags, their display names, and brand colour tokens.
 * These colours are used for TypeTagChip components and type-based backgrounds.
 */
export const ANIMON_TYPES = [
  'mammal',
  'bird',
  'reptile',
  'insect',
  'fish',
  'amphibian',
  'dog_breed',
  'cat_breed',
  'wild',
  'domestic',
] as const;

export type AnimonTypeName = (typeof ANIMON_TYPES)[number];

export interface TypeDefinition {
  label: string;
  color: string;       // background chip colour
  textColor: string;   // foreground text colour
  emoji: string;
}

export const TYPE_DEFINITIONS: Record<AnimonTypeName, TypeDefinition> = {
  mammal: {
    label: 'Mammal',
    color: '#D97706',
    textColor: '#FFFFFF',
    emoji: '🐾',
  },
  bird: {
    label: 'Bird',
    color: '#0EA5E9',
    textColor: '#FFFFFF',
    emoji: '🐦',
  },
  reptile: {
    label: 'Reptile',
    color: '#65A30D',
    textColor: '#FFFFFF',
    emoji: '🦎',
  },
  insect: {
    label: 'Insect',
    color: '#D946EF',
    textColor: '#FFFFFF',
    emoji: '🦋',
  },
  fish: {
    label: 'Fish',
    color: '#2563EB',
    textColor: '#FFFFFF',
    emoji: '🐟',
  },
  amphibian: {
    label: 'Amphibian',
    color: '#059669',
    textColor: '#FFFFFF',
    emoji: '🐸',
  },
  dog_breed: {
    label: 'Dog',
    color: '#B45309',
    textColor: '#FFFFFF',
    emoji: '🐶',
  },
  cat_breed: {
    label: 'Cat',
    color: '#7C3AED',
    textColor: '#FFFFFF',
    emoji: '🐱',
  },
  wild: {
    label: 'Wild',
    color: '#DC2626',
    textColor: '#FFFFFF',
    emoji: '🌿',
  },
  domestic: {
    label: 'Domestic',
    color: '#6B7280',
    textColor: '#FFFFFF',
    emoji: '🏠',
  },
};
