/**
 * Party Tab — Your chosen Anímons
 *
 * Shows the trainer's 5-slot party.
 * Occupied slots display: photo thumbnail, nickname, species, level badge.
 * Empty slots display a dashed "+" invite.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { usePartyStore } from '../../store/partyStore';
import type { PartySlot } from '../../types/party';

const CARD_PHOTO_SIZE = 72;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface PartyCardProps {
  slot: PartySlot | null;
  slotIndex: number;
}

function PartyCard({ slot, slotIndex }: PartyCardProps) {
  if (!slot) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyPhotoPlaceholder}>
          <Text style={styles.emptyPlus}>+</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.emptySlotLabel}>SLOT {slotIndex + 1}</Text>
          <Text style={styles.emptySlotSub}>Empty — catch an Anímon to fill</Text>
        </View>
      </View>
    );
  }

  const { animon } = slot;

  return (
    <View style={styles.occupiedCard}>
      <Image
        source={{ uri: animon.photoUrl }}
        style={styles.photo}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <View style={styles.cardInfoTop}>
          <Text style={styles.nickname} numberOfLines={1}>{animon.nickname}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{animon.level}</Text>
          </View>
        </View>
        <Text style={styles.species} numberOfLines={1}>{animon.species}</Text>
        <View style={styles.typeRow}>
          {animon.types.slice(0, 2).map((t) => (
            <View key={t} style={styles.typeChip}>
              <Text style={styles.typeChipText}>{t.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PartyScreen() {
  const { slots } = usePartyStore();
  const filled = slots.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Dark header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.screenTitle}>Your Party</Text>
        </View>
        <View style={styles.partyBadge}>
          <Text style={styles.partyBadgeText}>{filled}/5</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {slots.map((slot, index) => (
          <PartyCard key={index} slot={slot} slotIndex={index} />
        ))}

        {filled < 5 && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              The world is out there. Go scan to grow your party.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: colors.navDark,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.accent,
    marginBottom: 2,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize['2xl'],
    color: colors.textInverse,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  partyBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  partyBadgeText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    letterSpacing: typography.letterSpacing.wide,
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },

  // ── Shared card ─────────────────────────────────────────────────────────────
  cardInfo: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
    gap: 4,
  },

  // ── Occupied card ───────────────────────────────────────────────────────────
  occupiedCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: CARD_PHOTO_SIZE,
    height: CARD_PHOTO_SIZE,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  cardInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nickname: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize.lg,
    color: colors.text1,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: colors.navDark,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.textInverse,
    letterSpacing: typography.letterSpacing.wide,
  },
  species: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  typeChip: {
    backgroundColor: colors.accentSoft,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeChipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.label,
  },

  // ── Empty slot card ─────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    opacity: 0.7,
  },
  emptyPhotoPlaceholder: {
    width: CARD_PHOTO_SIZE,
    height: CARD_PHOTO_SIZE,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlus: {
    fontFamily: typography.fontFamily.body,
    fontSize: 28,
    color: colors.text3,
    lineHeight: 32,
  },
  emptySlotLabel: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
  },
  emptySlotSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    marginTop: 2,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: typography.fontSize.sm * 1.6,
  },
});

