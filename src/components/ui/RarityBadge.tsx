/**
 * RarityBadge
 *
 * Displays an Anímon's rarity tier. Glossy gets a shimmer animation (TODO).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonRarity } from '../../types/animon';

const RARITY_LABELS: Record<AnimonRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  glossy: '✨ Glossy',
};

interface RarityBadgeProps {
  rarity: AnimonRarity;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: rarityBg(rarity) }]}>
      <Text style={[styles.label, { color: rarityText(rarity) }]}>
        {RARITY_LABELS[rarity]}
      </Text>
    </View>
  );
}

function rarityBg(rarity: AnimonRarity): string {
  switch (rarity) {
    case 'glossy': return '#FFF8DC';
    case 'rare': return '#EFF6FF';
    case 'uncommon': return '#ECFDF5';
    default: return '#F3F4F6';
  }
}

function rarityText(rarity: AnimonRarity): string {
  return colors.rarity[rarity];
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
  },
});
