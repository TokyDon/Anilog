/**
 * AnimonCard — v3 Clean Modern
 *
 * Signature: Dark Footer Strip (navDark background).
 * Type-derived gradient image area. White text in footer.
 *
 * Variants:
 *   compact=false  Full card — 220px height
 *   compact=true   Compact card — 150px height
 *
 * showPhoto prop: if true renders animon.photoUrl; defaults false (type gradient + emoji).
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { TypeTagChip } from './TypeTagChip';
import { RarityBadge } from './RarityBadge';
import type { Animon } from '../../types/animon';
import type { AnimonType } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
  showPhoto?: boolean;
}

/** Format animon.id as accession number: #-042 */
function accessionNumber(id: string): string {
  const n = parseInt(id, 10);
  if (!isNaN(n)) return `#-${String(n).padStart(3, '0')}`;
  return `#-${id.slice(-3).padStart(3, '0')}`;
}

/** Type-derived gradient colours (approx 140deg) */
function getGradientColors(primaryType: AnimonType): readonly [string, string, ...string[]] {
  switch (primaryType) {
    case 'fire':
    case 'psychic':
      return ['#7F1D1D', '#831843', '#1E1B4B'];
    case 'rock':
      return ['#1C1917', '#1C3B5C'];
    case 'bug':
    case 'light':
      return ['#1A2E05', '#713F12'];
    case 'steel':
      return ['#431407', '#1E293B'];
    case 'ice':
    case 'dragon':
      return ['#0C4A6E', '#3B0764'];
    case 'grass':
      return ['#052E16', '#0C4A6E'];
    case 'water':
      return ['#1E3A8A', '#0C4A6E'];
    case 'ground':
      return ['#431407', '#78350F'];
    case 'electric':
      return ['#422006', '#713F12'];
    default:
      return ['#1E293B', '#0F172A'];
  }
}

/** Placeholder emoji per type for AI art area */
function getTypeEmoji(primaryType: AnimonType): string {
  const map: Record<AnimonType, string> = {
    fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    ice: '❄️', dragon: '🐉', psychic: '🔮', bug: '🐛',
    steel: '⚙️', ground: '🏔️', rock: '🪨', light: '✨',
  };
  return map[primaryType] ?? '◈';
}

export function AnimonCard({ animon, onPress, compact = false, showPhoto = false }: AnimonCardProps) {
  const primaryType = animon.types[0];
  const gradientColors = getGradientColors(primaryType);
  const accession = accessionNumber(animon.id);

  // ── Image area content ─────────────────────────────────────────────────────
  const imageArea = (
    <View style={compact ? styles.compactImageArea : styles.imageArea}>
      {showPhoto && animon.photoUrl ? (
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.65, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {/* Placeholder emoji — low opacity AI art stand-in */}
      {!showPhoto && (
        <Text style={compact ? styles.compactEmoji : styles.emoji}>
          {getTypeEmoji(primaryType)}
        </Text>
      )}
      {/* Rarity pill — top right */}
      <View style={styles.rarityPill}>
        <RarityBadge rarity={animon.rarity} />
      </View>
    </View>
  );

  if (compact) {
    return (
      <Pressable
        onPress={() => onPress?.(animon)}
        style={({ pressed }) => [styles.compactCard, pressed && styles.pressed]}
      >
        {imageArea}
        {/* Dark compact footer */}
        <View style={styles.compactFooter}>
          <Text style={styles.compactName} numberOfLines={1}>
            {animon.species}
          </Text>
          <View style={styles.compactChips}>
            {animon.types.slice(0, 1).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" />
            ))}
          </View>
        </View>
      </Pressable>
    );
  }

  // Full card
  return (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {imageArea}
      {/* Dark footer strip */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerName} numberOfLines={1}>
            {animon.species}
          </Text>
          <Text style={styles.footerSpecies} numberOfLines={1}>
            {animon.breed ?? animon.species}
          </Text>
          <View style={styles.footerChips}>
            {animon.types.slice(0, 2).map((t) => (
              <TypeTagChip key={t} type={t} size="sm" />
            ))}
          </View>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerAccession}>{accession}</Text>
          <Text style={styles.footerRegion} numberOfLines={1}>
            {animon.region}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const CARD_HEIGHT = 220;
const COMPACT_HEIGHT = 150;
const FOOTER_HEIGHT = 72;
const COMPACT_FOOTER_HEIGHT = 40;

const styles = StyleSheet.create({
  // ── Full card ──────────────────────────────────────────────────────────────
  card: {
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: colors.navDark,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  imageArea: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 52,
    opacity: 0.22,
  },
  rarityPill: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    height: FOOTER_HEIGHT,
    backgroundColor: colors.navDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerLeft: {
    flex: 1,
    gap: 2,
  },
  footerName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.textInverse,
    lineHeight: typography.fontSize.md * typography.lineHeight.label,
  },
  footerSpecies: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.40)',
    lineHeight: typography.fontSize.xs * typography.lineHeight.label,
  },
  footerChips: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    flexWrap: 'nowrap',
  },
  footerRight: {
    alignItems: 'flex-end',
    gap: 2,
    paddingLeft: 8,
  },
  footerAccession: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 8,
    color: 'rgba(255,255,255,0.28)',
    letterSpacing: typography.letterSpacing.label,
  },
  footerRegion: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.45)',
    maxWidth: 90,
    textAlign: 'right',
  },

  // ── Compact card ───────────────────────────────────────────────────────────
  compactCard: {
    height: COMPACT_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: colors.navDark,
  },
  compactImageArea: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactEmoji: {
    fontSize: 34,
    opacity: 0.22,
  },
  compactFooter: {
    height: COMPACT_FOOTER_HEIGHT,
    backgroundColor: colors.navDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 3,
  },
  compactName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    lineHeight: typography.fontSize.sm * typography.lineHeight.label,
  },
  compactChips: {
    flexDirection: 'row',
    gap: 3,
  },
});