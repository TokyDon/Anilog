/**
 * AnimonCard
 *
 * Core collectible card component. Displays an Anímon's photo, species name,
 * type tags, rarity badge, and region.
 *
 * Glossy rarity cards get an animated iridescent gradient border.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { TypeTagChip } from './TypeTagChip';
import { RarityBadge } from './RarityBadge';
import type { Animon } from '../../types/animon';

interface AnimonCardProps {
  animon: Animon;
  onPress?: (animon: Animon) => void;
  compact?: boolean;
}

export function AnimonCard({ animon, onPress, compact = false }: AnimonCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(animon)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        animon.rarity === 'glossy' && styles.glossyCard,
      ]}
    >
      <Image
        source={{ uri: animon.photoUrl }}
        style={compact ? styles.imageCompact : styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.species} numberOfLines={1}>
          {animon.species}
        </Text>
        {animon.breed && (
          <Text style={styles.breed} numberOfLines={1}>
            {animon.breed}
          </Text>
        )}
        <View style={styles.tags}>
          {animon.types.slice(0, 2).map((type) => (
            <TypeTagChip key={type} type={type} size="sm" />
          ))}
        </View>
        <View style={styles.footer}>
          <RarityBadge rarity={animon.rarity} />
          <Text style={styles.region} numberOfLines={1}>
            {animon.region}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  glossyCard: {
    borderWidth: 2,
    borderColor: colors.rarity.glossy,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageCompact: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 12,
  },
  species: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  breed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  region: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
});
