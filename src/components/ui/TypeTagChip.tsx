/**
 * TypeTagChip — v3 Clean Modern
 *
 * Solid vivid filled pill. Background = type colour.
 * White text (dark for electric/bug/light). Fully rounded. No border.
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
        size === 'sm' ? styles.chipSm : styles.chipMd,
        { backgroundColor: def.color },
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'sm' ? styles.labelSm : styles.labelMd,
          { color: def.textColor },
        ]}
      >
        {def.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipMd: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: {
    fontFamily: typography.fontFamily.bodySemiBold,
    letterSpacing: typography.letterSpacing.label,
  },
  labelSm: { fontSize: typography.fontSize.xs },
  labelMd: { fontSize: typography.fontSize.sm },
});