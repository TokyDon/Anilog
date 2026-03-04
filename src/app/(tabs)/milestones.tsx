/**
 * Milestones Tab
 *
 * Shows earned stamps and achievement milestones.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export default function MilestonesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Milestones</Text>
      {/* TODO: Milestone stamps grid */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
  },
});
