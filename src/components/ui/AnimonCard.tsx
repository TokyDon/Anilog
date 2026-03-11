/**
 * AnimonCard — v4 Flutter Pokédex Style
 *
 * Full card: full-bleed type-color bg, photo fills card, gradient name overlay,
 * decorative ring element, accession + rarity floating at top.
 *
 * Compact card: horizontal strip — type-colored photo panel left,
 * neutral text panel right. Used in profile recent-catches list.
 *
 * Variants:
 *   compact=false  Full card — 200px height
 *   compact=true   Horizontal strip — 84px height
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { getTypeDefinition } from '../../constants/typeSystem';
import { typography } from '../../constants/typography';
import { TypeTagChip } from './TypeTagChip';
import { RarityBadge } from './RarityBadge';
import type { Animon } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
  showPhoto?: boolean;
}

function accessionNumber(id: string): string {
  const n = parseInt(id, 10);
  if (!isNaN(n)) return `#${String(n).padStart(3, '0')}`;
  return `#${id.slice(-3).padStart(3, '0')}`;
}

function getTypeEmoji(primaryType: string): string {
  const map: Record<string, string> = {
    mammal: '🦊', bird: '🐦', reptile: '🦎', insect: '🐛',
    fish: '🐟', amphibian: '🐸', dog: '🐕', cat: '🐈',
    wild: '🌿', domestic: '🏡',
  };
  return map[primaryType] ?? '◈';
}

export function AnimonCard({ animon, onPress, compact = false, showPhoto = true }: AnimonCardProps) {
  const primaryType = animon.types[0];
  const def = getTypeDefinition(primaryType);
  const typeColor = def.color;
  const textColor = def.textColor;

  const cardShadow = {
    shadowColor: typeColor,
    shadowOpacity: 0.50,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  };

  const accession = accessionNumber(animon.id);
  const textAlpha = textColor === '#FFFFFF' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.55)';

  // ── Compact (horizontal strip) ──────────────────────────────────────────────
  if (compact) {
    return (
      <Pressable
        onPress={() => onPress?.(animon)}
        style={({ pressed }) => [
          styles.compact,
          { shadowColor: typeColor, shadowOpacity: 0.30, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
          pressed && styles.pressed,
        ]}
      >
        {/* Left: type-colored photo panel */}
        <View style={[styles.compactPhoto, { backgroundColor: typeColor }]}>
          {showPhoto && animon.photoUrl ? (
            <Image
              source={{ uri: animon.photoUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text style={styles.compactEmoji}>{getTypeEmoji(primaryType)}</Text>
          )}
          {/* Subtle right-edge fade */}
          <LinearGradient
            colors={['transparent', typeColor]}
            start={{ x: 0.6, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Right: text panel */}
        <View style={[styles.compactText, { borderLeftColor: typeColor }]}>
          <Text style={styles.compactName} numberOfLines={1}>{animon.species}</Text>
          <View style={styles.compactMeta}>
            <TypeTagChip type={primaryType} size="sm" />
            <Text style={styles.compactRegion} numberOfLines={1}>{animon.region}</Text>
          </View>
        </View>

        {/* Accession — top right */}
        <Text style={[styles.compactAccession, { color: textColor === '#FFFFFF' ? typeColor : colors.text3 }]}>
          {accession}
        </Text>
      </Pressable>
    );
  }

  // ── Full card ───────────────────────────────────────────────────────────────
  return (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [styles.card, { backgroundColor: typeColor, ...cardShadow }, pressed && styles.pressed]}
    >
      {/* Photo fills entire card */}
      {showPhoto && animon.photoUrl ? (
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View style={styles.emojiPlaceholder}>
          <Text style={styles.emoji}>{getTypeEmoji(primaryType)}</Text>
        </View>
      )}

      {/* Decorative ring — top-right corner design element */}
      <View style={styles.decorativeRing} />

      {/* Gradient overlay — transparent → type color at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.08)', typeColor]}
        locations={[0, 0.40, 1]}
        style={styles.gradient}
      />

      {/* Top row: accession + rarity */}
      <View style={styles.topRow}>
        <Text style={[styles.accession, { color: textAlpha }]}>{accession}</Text>
        <RarityBadge rarity={animon.rarity} />
      </View>

      {/* Bottom: species name + type chips */}
      <View style={styles.bottomContent}>
        <Text style={[styles.speciesName, { color: textColor }]} numberOfLines={2}>
          {animon.species}
        </Text>
        <View style={styles.typeRow}>
          {animon.types.slice(0, 2).map((t) => (
            <TypeTagChip key={t} type={t} size="sm" onCard />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const CARD_HEIGHT = 200;
const COMPACT_HEIGHT = 84;
const COMPACT_PHOTO_WIDTH = 90;

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.92,
  },

  // ── Full card ───────────────────────────────────────────────────────────────
  card: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emojiPlaceholder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    opacity: 0.25,
  },
  decorativeRing: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 24,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accession: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    gap: 6,
  },
  speciesName: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.tight,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'nowrap',
  },

  // ── Compact strip ───────────────────────────────────────────────────────────
  compact: {
    height: COMPACT_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactPhoto: {
    width: COMPACT_PHOTO_WIDTH,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactEmoji: {
    fontSize: 30,
    opacity: 0.35,
  },
  compactText: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    gap: 6,
    borderLeftWidth: 3,
  },
  compactName: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.base,
    color: colors.text1,
    lineHeight: typography.fontSize.base * typography.lineHeight.tight,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  compactRegion: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    flex: 1,
  },
  compactAccession: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.label,
    opacity: 0.55,
  },
});
