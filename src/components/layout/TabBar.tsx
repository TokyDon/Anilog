/**
 * TabBar
 *
 * Custom tab bar with an elevated, centred camera button.
 * Used as the tabBar prop in the bottom tab navigator.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_ICONS: Record<string, string> = {
  index: '🏠',
  anilog: '📖',
  milestones: '🏅',
  profile: '👤',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* Left two tabs */}
      {state.routes.slice(0, 2).map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === index}
          onPress={() => navigation.navigate(route.name)}
          descriptors={descriptors}
        />
      ))}

      {/* Centre gap for elevated camera button */}
      <View style={styles.cameraGap}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push('/camera')}
          activeOpacity={0.85}
        >
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Right two tabs */}
      {state.routes.slice(2, 4).map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === index + 2}
          onPress={() => navigation.navigate(route.name)}
          descriptors={descriptors}
        />
      ))}
    </View>
  );
}

function TabItem({
  route,
  isFocused,
  onPress,
  descriptors,
}: {
  route: { key: string; name: string };
  isFocused: boolean;
  onPress: () => void;
  descriptors: BottomTabBarProps['descriptors'];
}) {
  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
    >
      <Text style={styles.tabIcon}>{TAB_ICONS[route.name] ?? '•'}</Text>
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {descriptors[route.key]?.options?.title ?? route.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
    paddingTop: 8,
    height: 80,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: { fontSize: 20 },
  tabLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  tabLabelActive: { color: colors.primary },
  tabLabelInactive: { color: colors.text.secondary },
  cameraGap: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  cameraIcon: { fontSize: 26 },
});
