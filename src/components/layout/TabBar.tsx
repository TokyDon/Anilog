/**
 * TabBar — v3 Clean Modern
 *
 * White background, 1px top border, safe-area aware.
 * 5 items: Discover | Anilog | [FAB camera] | Logbook | Profile
 * Active: icon + label in accent + 4px dot below icon.
 * Inactive: icon + label in text3.
 * Centre FAB: 54px circle lifted 18px, accent gradient, white border.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index:   { icon: '\u229E', label: 'Discover' },
  anilog:  { icon: '\u25C8', label: 'Ani\u0301log' },
  logbook: { icon: '\u25CE', label: 'Logbook' },
  profile: { icon: '\u25D0', label: 'Profile' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
      ]}
    >
      {/* 1px top border */}
      <View style={styles.topBorder} />

      {/* Left two tabs */}
      {leftRoutes.map((route, index) => (
        <TabItem
          key={route.key}
          routeName={route.name}
          isFocused={state.index === index}
          onPress={() => navigation.navigate(route.name)}
        />
      ))}

      {/* Centre FAB */}
      <View style={styles.fabWrap}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => router.push('/camera')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Camera icon — SVG approximated with unicode */}
          <Text style={styles.fabIcon}>{'\u23F7'}</Text>
        </TouchableOpacity>
      </View>

      {/* Right two tabs */}
      {rightRoutes.map((route, index) => (
        <TabItem
          key={route.key}
          routeName={route.name}
          isFocused={state.index === (index + 2)}
          onPress={() => navigation.navigate(route.name)}
        />
      ))}
    </View>
  );
}

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({ routeName, isFocused, onPress }: TabItemProps) {
  const config = TAB_CONFIG[routeName];
  if (!config) return null;

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text
        style={[
          styles.tabIcon,
          isFocused ? styles.iconActive : styles.iconInactive,
        ]}
      >
        {config.icon}
      </Text>
      {/* Active dot */}
      {isFocused && <View style={styles.activeDot} />}
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

const FAB_SIZE = 54;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 8,
    position: 'relative',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  iconActive:   { color: colors.accent },
  iconInactive: { color: colors.text3 },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 8,
    letterSpacing: typography.letterSpacing.label,
  },
  labelActive:   { color: colors.accent },
  labelInactive: { color: colors.text3 },

  // Centre FAB
  fabWrap: {
    width: 72,
    alignItems: 'center',
    paddingTop: 0,
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth: 2.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 22,
    color: colors.textInverse,
  },
});