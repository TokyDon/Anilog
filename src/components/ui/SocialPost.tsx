import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from './AnimonCard';
import type { Animon } from '../../types/animon';

interface SocialPostUser {
  name: string;
  handle: string;
  avatarGradient: string[];
}

interface SocialPostProps {
  user: SocialPostUser;
  timeAgo: string;
  location: string;
  text: string;
  embeddedCard?: Animon;
  likeCount: number;
  commentCount: number;
  canTrade?: boolean;
  onTrade?: () => void;
  style?: ViewStyle;
}

export function SocialPost({
  user,
  timeAgo,
  location,
  text,
  embeddedCard,
  likeCount,
  commentCount,
  canTrade,
  onTrade,
  style,
}: SocialPostProps) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.card, style]}>
      {/* Header row */}
      <View style={styles.header}>
        <LinearGradient
          colors={user.avatarGradient as [string, string, ...string[]]}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>

        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
          <Text style={styles.sub} numberOfLines={1}>
            {user.handle}  ·  {timeAgo}  ·  {location}
          </Text>
        </View>
      </View>

      {/* Body */}
      {text ? <Text style={styles.body}>{text}</Text> : null}

      {/* Embedded card */}
      {embeddedCard ? (
        <View style={styles.embed}>
          <AnimonCard animon={embeddedCard} compact />
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Text style={styles.actionText}>♥  {likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Text style={styles.actionText}>💬  {commentCount}</Text>
        </TouchableOpacity>
        {canTrade && onTrade ? (
          <TouchableOpacity style={styles.tradePill} onPress={onTrade} activeOpacity={0.75}>
            <Text style={styles.tradeText}>⇄  Offer Trade</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  meta: {
    flex: 1,
  },
  name: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text1,
    marginBottom: 2,
  },
  sub: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: 0.3,
  },
  body: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text2,
    lineHeight: 20,
    marginBottom: 10,
  },
  embed: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  action: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  actionText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
  },
  tradePill: {
    marginLeft: 'auto',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tradeText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
  },
});