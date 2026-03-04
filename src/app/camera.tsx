/**
 * Camera Screen — Full-Screen Modal
 *
 * Live camera for Anímon capture. Uses expo-camera only — no ImagePicker.
 * Capture flow: Snap → AI identify → 900ms reveal animation → Save to collection.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Catch Anímon</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* TODO: Implement expo-camera live capture + AI flow */}
      <View style={styles.placeholder}>
        <Text style={styles.hint}>Camera will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    color: colors.surface,
    fontSize: 20,
    fontFamily: typography.fontFamily.bodyBold,
  },
  title: {
    color: colors.surface,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
  },
});
