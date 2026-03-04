/**
 * TypeTagChip
 *
 * Pill-shaped chip showing an Anímon type (e.g. "Mammal", "Bird").
 * Colours come from the type system constants.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_DEFINITIONS } from '../../constants/typeSystem';
import { typography } from '../../constants/typography';
import type { AnimonType } from '../../types/animon';

interface TypeTagChipProps {
  type: AnimonType;
  size?: 'sm' | 'md';
}

export function TypeTagChip({ type, size = 'md' }: TypeTagChipProps) {
  const def = TYPE_DEFINITIONS[type];
  if (!def) return null;

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: def.color },
        size === 'sm' && styles.chipSm,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: def.textColor },
          size === 'sm' && styles.labelSm,
        ]}
      >
        {def.emoji} {def.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
  },
  labelSm: {
    fontSize: typography.fontSize.xs,
  },
});
