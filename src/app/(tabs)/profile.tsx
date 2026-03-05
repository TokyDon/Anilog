/**
 * Profile Tab — Naturalist Field Journal v2
 *
 * forestFloor hero zone, specimenCream scroll, cardStock stat strip,
 * inkRule borders, amberGlow upgrade banner.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from '../../components/ui/AnimonCard';
import { MOCK_ANIMONS, MOCK_USER } from '../../data/mockAnimons';
import type { Animon } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RARITY_SEGMENTS = [
  { rarity: 'common'   as const, count: 6  },
  { rarity: 'uncommon' as const, count: 3  },
  { rarity: 'rare'     as const, count: 2  },
  { rarity: 'glossy'   as const, count: 1  },
];
const TOTAL_CAUGHT = RARITY_SEGMENTS.reduce((sum, s) => sum + s.count, 0);

const STAT_PANELS = [
  { label: 'CAUGHT',    value: String(MOCK_USER.totalCaught) },
  { label: 'SPECIES',   value: String(MOCK_USER.uniqueSpecies) },
  { label: 'REGIONS',   value: String(MOCK_USER.regionsExplored) },
];

export default function ProfileScreen() {
  const recentThree = MOCK_ANIMONS.slice(0, 3);

  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero zone ─────────────────────────────────────────── */}
        <View style={styles.heroZone}>
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: colors.overlayDark },
            ]}
          />
          {/* Avatar */}
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{MOCK_USER.initials}</Text>
            </View>
          </View>
          <Text style={styles.username}>{MOCK_USER.username}</Text>
          <Text style={styles.memberSince}>
            TRAINER SINCE {MOCK_USER.memberSince.toUpperCase()}
          </Text>
        </View>

        {/* ── Stat strip ─────────────────────────────────────────── */}
        <View style={styles.statStrip}>
          {STAT_PANELS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statPanel}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Rarity breakdown bar ───────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RARITY BREAKDOWN</Text>
        </View>
        <View style={styles.rarityBarWrap}>
          <View style={styles.rarityBar}>
            {RARITY_SEGMENTS.map((seg) => (
              <View
                key={seg.rarity}
                style={[
                  styles.raritySegment,
                  {
                    flex: seg.count / TOTAL_CAUGHT,
                    backgroundColor: colors.rarity[seg.rarity],
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.rarityLegend}>
            {RARITY_SEGMENTS.map((seg) => (
              <View key={seg.rarity} style={styles.rarityLegendItem}>
                <View
                  style={[
                    styles.rarityDot,
                    { backgroundColor: colors.rarity[seg.rarity] },
                  ]}
                />
                <Text style={styles.rarityLegendText}>
                  {seg.rarity.toUpperCase()} {seg.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Catches ─────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT CATCHES</Text>
        </View>
        <View style={styles.recentList}>
          {recentThree.map((animon) => (
            <AnimonCard
              key={animon.id}
              animon={animon}
              compact
              onPress={handleCardPress}
            />
          ))}
        </View>

        {/* ── Anílog+ banner ─────────────────────────────────────── */}
        <View style={styles.bannerWrap}>
          <LinearGradient
            colors={[colors.navDark, colors.bezel, colors.navDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.upgradeBanner}
          >
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Anílog+ ✨</Text>
              <Text style={styles.upgradeSub}>
                Unlock unlimited captures + Glossy Radar
              </Text>
            </View>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>UPGRADE</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: { paddingBottom: 16 },

  // Hero zone
  heroZone: {
    height: 210,
    backgroundColor: colors.navDark,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    marginBottom: 0,
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: colors.borderStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.bezel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xl,
    color: colors.accent,
  },
  username: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize['2xl'],
    color: colors.textInverse,
  },
  memberSince: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
    letterSpacing: 1,
  },

  // Stat strip
  statStrip: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    marginHorizontal: 20,
    marginTop: -1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  statPanel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  statValue: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  statLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.text3,
    marginTop: 4,
    letterSpacing: 1.5,
  },

  // Section labels
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Rarity bar
  rarityBarWrap: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  rarityBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    gap: 2,
  },
  raritySegment: {
    height: 16,
    borderRadius: 4,
  },
  rarityLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  rarityLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityLegendText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.text2,
    letterSpacing: 0.8,
  },

  // Recent catches
  recentList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },

  // Upgrade banner
  bannerWrap: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  upgradeBanner: {
    borderRadius: 4,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    shadowColor: colors.text3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeText: { flex: 1, gap: 3 },
  upgradeTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.lg,
    color: colors.textInverse,
  },
  upgradeSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: typography.fontSize.sm * 1.5,
  },
  upgradeBtn: {
    backgroundColor: colors.accentDeep,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  upgradeBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textInverse,
    letterSpacing: 1,
  },
});
