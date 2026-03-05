/**
 * Milestones Tab
 *
 * BioField Scanner MK-II — progress gauges, rarity breakdown, achievements.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { MOCK_ANIMONS } from '../../data/mockAnimons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SPECIES_TARGET = 100;
const UNIQUE_SPECIES = new Set(MOCK_ANIMONS.map((a) => a.species)).size;

const RARITY_DATA = [
  { rarity: 'common'   as const, label: 'Common',   count: 6,  target: 20 },
  { rarity: 'uncommon' as const, label: 'Uncommon', count: 3,  target: 10 },
  { rarity: 'rare'     as const, label: 'Rare',     count: 2,  target: 5  },
  { rarity: 'glossy'   as const, label: 'Glossy',   count: 1,  target: 1  },
];

const ACHIEVEMENTS = [
  { id: 'first_catch',    title: 'First Catch',      description: 'Caught your first Anímon',              emoji: '🎯', tier: 'Bronze' as const, unlocked: true  },
  { id: 'explorer',       title: 'Explorer',         description: 'Caught Anímon in 3 different regions',  emoji: '🗺️', tier: 'Silver' as const, unlocked: true  },
  { id: 'rare_finder',    title: 'Rare Finder',      description: 'Caught a rare Anímon',                  emoji: '🔮', tier: 'Gold'   as const, unlocked: true  },
  { id: 'glossy_hunter',  title: 'Glossy Hunter',    description: 'Catch a glossy Anímon',                 emoji: '✨', tier: 'Gold'   as const, unlocked: false },
  { id: 'century_club',   title: 'Century Club',     description: 'Catch 100 unique species',              emoji: '💯', tier: 'Gold'   as const, unlocked: false },
  { id: 'global_trainer', title: 'Global Trainer',   description: 'Catch Anímon on 5 continents',          emoji: '🌎', tier: 'Gold'   as const, unlocked: false },
];

const TIER_COLORS = { Bronze: '#CD7F32', Silver: '#A8A9AD', Gold: '#F59E0B' };

export default function MilestonesScreen() {
  const progressPct = Math.min(UNIQUE_SPECIES / TOTAL_SPECIES_TARGET, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Milestones</Text>
          <View style={styles.subBadge}>
            <Text style={styles.subBadgeText}>
              {UNIQUE_SPECIES}/{TOTAL_SPECIES_TARGET} SPECIES
            </Text>
          </View>
        </View>

        {/* ── Species progress gauge ─────────────────────────────── */}
        <View style={styles.gaugePanel}>
          <View style={styles.gaugeLabelRow}>
            <Text style={styles.gaugeLabel}>ANÍMON COLLECTOR</Text>
            <Text style={styles.gaugeFraction}>{UNIQUE_SPECIES} / {TOTAL_SPECIES_TARGET}</Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${progressPct * 100}%` as any }]} />
          </View>
          <Text style={styles.gaugePct}>{Math.round(progressPct * 100)}% COMPLETE</Text>
        </View>

        {/* ── Rarity breakdown grid ──────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RARITY COLLECTION</Text>
        </View>
        <View style={styles.rarityGrid}>
          {RARITY_DATA.map((r) => (
            <View key={r.rarity} style={styles.rarityCell}>
              <RarityBadge rarity={r.rarity} size="lg" />
              <Text style={[styles.rarityCount, { color: colors.rarity[r.rarity] }]}>
                {r.count}
              </Text>
              <Text style={styles.rarityLabel}>SPECIMENS</Text>
            </View>
          ))}
        </View>

        {/* ── Achievement cards ──────────────────────────────────── */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        </View>
        <View style={styles.achievementList}>
          {ACHIEVEMENTS.map((a) => {
            const accentColor = TIER_COLORS[a.tier];
            return (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  !a.unlocked && styles.achievementLocked,
                ]}
              >
                {/* Left accent stripe */}
                <View
                  style={[
                    styles.achievementStripe,
                    { backgroundColor: a.unlocked ? accentColor : '#6B6B6B' },
                  ]}
                />
                {/* Content */}
                <Text style={styles.achievementEmoji}>{a.unlocked ? a.emoji : '🔒'}</Text>
                <View style={styles.achievementText}>
                  <Text style={[styles.achievementTitle, !a.unlocked && styles.dimText]}>
                    {a.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                </View>
                {a.unlocked && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  scrollContent: { paddingBottom: 16 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heading: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.textPrimary,
  },
  subBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: colors.deviceBezel,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.amberReadout,
  },
  // Progress gauge
  gaugePanel: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.deviceBezel,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.metalBrush,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 5,
    elevation: 5,
  },
  gaugeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 14,
    color: colors.amberReadout,
    letterSpacing: 0.5,
  },
  gaugeFraction: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.amberReadout,
  },
  gaugeTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D0A05',
    borderWidth: 1,
    borderColor: colors.deviceBody,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.scannerGreenLight,
    shadowColor: colors.scannerGreenGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.60,
    shadowRadius: 4,
  },
  gaugePct: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 1,
  },
  // Section header
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Rarity grid
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  rarityCell: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: colors.surfaceCard,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#1A0F00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['4xl'],
    marginTop: 8,
  },
  rarityLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 1,
  },
  // Achievements
  achievementList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfacePanel,
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingLeft: 22,
    paddingRight: 16,
    gap: 14,
    position: 'relative',
  },
  achievementLocked: { opacity: 0.45 },
  achievementStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
  },
  achievementEmoji: { fontSize: 36 },
  achievementText: { flex: 1, gap: 2 },
  achievementTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  dimText: { color: colors.textSecondary },
  achievementDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.scannerGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyBold,
  },
});


const TOTAL_SPECIES_TARGET = 100;
const UNIQUE_SPECIES = new Set(MOCK_ANIMONS.map((a) => a.species)).size;

const RARITY_DATA = [
  { rarity: 'common',   emoji: '⚪', label: 'Common',   count: 6,  target: 20, color: colors.rarity.common },
  { rarity: 'uncommon', emoji: '🟢', label: 'Uncommon', count: 3,  target: 10, color: colors.rarity.uncommon },
  { rarity: 'rare',     emoji: '🔵', label: 'Rare',     count: 2,  target: 5,  color: colors.rarity.rare },
  { rarity: 'glossy',   emoji: '✨', label: 'Glossy',   count: 1,  target: 1,  color: colors.rarity.glossy },
] as const;

const ACHIEVEMENTS = [
  {
    id: 'first_catch',
    title: 'First Catch',
    description: 'Caught your first Anímon',
    emoji: '🎯',
    unlocked: true,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Caught Anímon in 3 different regions',
    emoji: '🗺️',
    unlocked: true,
  },
  {
    id: 'rare_finder',
    title: 'Rare Finder',
    description: 'Caught a rare Anímon',
    emoji: '🔮',
    unlocked: true,
  },
  {
    id: 'glossy_hunter',
    title: 'Glossy Hunter',
    description: 'Catch a glossy Anímon',
    emoji: '✨',
    unlocked: false,
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Catch 100 unique species',
    emoji: '💯',
    unlocked: false,
  },
  {
    id: 'global_trainer',
    title: 'Global Trainer',
    description: 'Catch Anímon on 5 continents',
    emoji: '🌎',
    unlocked: false,
  },
];

export default function MilestonesScreen() {
  const progressPct = Math.min(UNIQUE_SPECIES / TOTAL_SPECIES_TARGET, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Milestones</Text>
        </View>

        {/* Progress overview card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Anímon Collector</Text>
          <Text style={styles.progressSub}>
            {UNIQUE_SPECIES} / {TOTAL_SPECIES_TARGET} unique species
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPct * 100}%` as any },
              ]}
            />
          </View>
          <Text style={styles.progressPct}>
            {Math.round(progressPct * 100)}% complete
          </Text>
        </View>

        {/* Rarity Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rarity Collection</Text>
          <View style={styles.rarityGrid}>
            {RARITY_DATA.map((r) => (
              <View
                key={r.rarity}
                style={[
                  styles.rarityCard,
                  r.count >= r.target && { borderColor: r.color, borderWidth: 2 },
                ]}
              >
                <Text style={styles.rarityEmoji}>{r.emoji}</Text>
                <Text style={[styles.rarityLabel, { color: r.color }]}>{r.label}</Text>
                <Text style={styles.rarityCount}>
                  <Text style={styles.rarityCountBold}>{r.count}</Text>
                  /{r.target}
                </Text>
                <View style={styles.rarityTrack}>
                  <View
                    style={[
                      styles.rarityFill,
                      {
                        width: `${Math.min(r.count / r.target, 1) * 100}%` as any,
                        backgroundColor: r.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementList}>
            {ACHIEVEMENTS.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  a.unlocked
                    ? styles.achievementUnlocked
                    : styles.achievementLocked,
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    a.unlocked
                      ? styles.achievementIconUnlocked
                      : styles.achievementIconLocked,
                  ]}
                >
                  <Text style={styles.achievementEmoji}>
                    {a.unlocked ? a.emoji : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementText}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !a.unlocked && styles.achievementTitleLocked,
                    ]}
                  >
                    {a.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                </View>
                {a.unlocked && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: { paddingBottom: 16 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
  },
  // Progress card
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  progressTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text.inverse,
    marginBottom: 2,
  },
  progressSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressPct: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    textAlign: 'right',
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: 14,
  },
  // Rarity grid
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rarityCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  rarityEmoji: { fontSize: 24 },
  rarityLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  rarityCountBold: {
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  rarityTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  rarityFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Achievements
  achievementList: { gap: 10 },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1.5,
  },
  achievementUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.primary,
  },
  achievementLocked: {
    backgroundColor: colors.surface,
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: '#D1FAE5',
  },
  achievementIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  achievementEmoji: { fontSize: 22 },
  achievementText: { flex: 1, gap: 2 },
  achievementTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  achievementTitleLocked: {
    color: colors.text.secondary,
  },
  achievementDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontFamily: typography.fontFamily.bodyBold,
  },
});
