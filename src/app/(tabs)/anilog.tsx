/**
 * My Anílog Tab — Collection
 *
 * Displays the user's full Anímon collection as a grid.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export default function AnilogScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Anílog</Text>
      {/* TODO: Collection grid */}
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
