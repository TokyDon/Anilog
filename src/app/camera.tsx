/**
 * Camera Screen — Full-Screen Modal
 *
 * BioField Scanner MK-II — amber reticle, scan-line animation,
 * dark device chrome, result bottom sheet.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RarityBadge } from '../components/ui/RarityBadge';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { MOCK_ANIMONS } from '../data/mockAnimons';

const { width: W, height: H } = Dimensions.get('window');
const RETICLE_SIZE = 240;
const CORNER = 24;
const CORNER_T = 3;

const MOCK_RESULT = MOCK_ANIMONS[9]; // Red Fox — rare

type CaptureState = 'idle' | 'scanning' | 'result';

export default function CameraScreen() {
  const [captureState, setCaptureState] = useState<CaptureState>('idle');

  // Scan line Y offset (within reticle)
  const scanY = useSharedValue(0);
  // Blink text
  const blinkOpacity = useSharedValue(1);
  // Pulse ring
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  // Result card
  const resultY = useSharedValue(H);

  useEffect(() => {
    // Scan line loop
    scanY.value = withRepeat(
      withSequence(
        withTiming(RETICLE_SIZE - 4, { duration: 1600, easing: Easing.linear }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    // Blink
    blinkOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
      -1,
      false,
    );
    // Pulse ring
    pulseScale.value = withRepeat(
      withTiming(1.25, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.0, { duration: 1800 }),
        withTiming(0.4, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, []);

  const scanLine = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));
  const blinkStyle = useAnimatedStyle(() => ({ opacity: blinkOpacity.value }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: resultY.value }],
  }));

  function handleCapture() {
    if (captureState !== 'idle') return;
    setCaptureState('scanning');
    setTimeout(() => {
      setCaptureState('result');
      resultY.value = withSpring(0, { damping: 22, stiffness: 100 });
    }, 1800);
  }

  function handleRetry() {
    resultY.value = withTiming(H, { duration: 300 });
    setTimeout(() => setCaptureState('idle'), 320);
  }

  function handleAdd() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Viewfinder ──────────────────────────────────────────── */}
      <View style={styles.viewfinder}>
        <Image
          source={{ uri: MOCK_RESULT.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={captureState === 'scanning' ? 3 : 0}
        />
        <View style={styles.overlay} />

        {/* Reticle */}
        <View style={styles.reticleWrap}>
          {/* Pulse ring */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />

          {/* Amber corner brackets */}
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Animated scan line */}
            <View style={styles.scanLineClip}>
              <Animated.View style={[styles.scanLine, scanLine]} />
            </View>
          </View>

          {/* Status text */}
          <Animated.View style={[styles.statusWrap, blinkStyle]}>
            <Text style={styles.statusText}>
              {captureState === 'scanning' ? 'IDENTIFYING...' : 'SCANNING...'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topLabel}>SCANNER MK-II</Text>
        <View style={styles.modeToggle}>
          <Text style={styles.modeActive}>PHOTO</Text>
          <Text style={styles.modeInactive}>VIDEO</Text>
        </View>
      </View>

      {/* ── Shutter panel ──────────────────────────────────────── */}
      {captureState !== 'result' && (
        <View style={styles.shutterPanel}>
          {/* Gallery thumb placeholder */}
          <View style={styles.galleryThumb} />

          {/* Shutter button */}
          <TouchableOpacity
            onPress={handleCapture}
            disabled={captureState === 'scanning'}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                captureState === 'scanning'
                  ? ['#3A3530', '#2C2416', '#3A3530']
                  : ['#D4AF37', '#FFD700', '#B8860B', '#FFD700', '#D4AF37']
              }
              style={styles.shutterOuter}
            >
              <View style={styles.shutterInner} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Flash toggle */}
          <TouchableOpacity style={styles.flashToggle}>
            <Text style={styles.flashIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Result card ─────────────────────────────────────────── */}
      <Animated.View style={[styles.resultCard, resultStyle]}>
        <View style={styles.resultHandle} />

        <Text style={styles.captureConfirm}>CAPTURE CONFIRMED ✓</Text>

        <View style={styles.resultImageRow}>
          <Image
            source={{ uri: MOCK_RESULT.photoUrl }}
            style={styles.resultThumb}
            contentFit="cover"
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultSpecies}>{MOCK_RESULT.species}</Text>
            {MOCK_RESULT.breed && (
              <Text style={styles.resultBreed}>{MOCK_RESULT.breed}</Text>
            )}
            <Text style={styles.resultConfidence}>
              {Math.round(MOCK_RESULT.confidenceScore * 100)}% MATCH
            </Text>
          </View>
        </View>

        <View style={styles.resultTags}>
          {MOCK_RESULT.types.map((t) => (
            <TypeTagChip key={t} type={t} size="sm" />
          ))}
        </View>

        <View style={styles.resultRarity}>
          <RarityBadge rarity={MOCK_RESULT.rarity} size="lg" />
          <Text style={styles.resultRegion}>📍 {MOCK_RESULT.region}</Text>
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryBtnText}>RETRY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>ADD TO ANÍLOG</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A05',
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },

  // Reticle
  reticleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingTop: 60,
  },
  pulseRing: {
    position: 'absolute',
    width: RETICLE_SIZE + 28,
    height: RETICLE_SIZE + 28,
    borderRadius: (RETICLE_SIZE + 28) / 2,
    borderWidth: 2,
    borderColor: colors.amberGlow,
  },
  reticle: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.amberGlow,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_T,
    borderLeftWidth: CORNER_T,
    borderTopLeftRadius: 3,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_T,
    borderRightWidth: CORNER_T,
    borderTopRightRadius: 3,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_T,
    borderLeftWidth: CORNER_T,
    borderBottomLeftRadius: 3,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_T,
    borderRightWidth: CORNER_T,
    borderBottomRightRadius: 3,
  },
  scanLineClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.amberGlow,
    opacity: 0.75,
    shadowColor: colors.amberGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.80,
    shadowRadius: 6,
  },
  statusWrap: { alignItems: 'center' },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.amberReadout,
    letterSpacing: 2,
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deviceBezel,
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.metalBrush,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.textInverse,
    fontSize: 15,
    fontFamily: typography.fontFamily.bodyBold,
  },
  topLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.amberReadout,
    textAlign: 'center',
    letterSpacing: 2,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  modeActive: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 11,
    color: colors.amberReadout,
    letterSpacing: 1,
  },
  modeInactive: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
  },

  // Shutter panel
  shutterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deviceBezel,
    borderTopWidth: 1,
    borderTopColor: colors.metalBrush,
    paddingVertical: 24,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 44,
  },
  galleryThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.metalBrush,
    borderWidth: 1,
    borderColor: colors.metalBrushLight,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.amberGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 10,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(244,225,176,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  flashToggle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.metalBrush,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.metalBrushLight,
  },
  flashIcon: { fontSize: 20 },

  // Result card
  resultCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 14,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 24,
  },
  resultHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  captureConfirm: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.scannerGreenLight,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  resultImageRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  resultThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  resultInfo: { flex: 1, gap: 4 },
  resultSpecies: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.textPrimary,
    lineHeight: typography.fontSize['2xl'] * 1.12,
  },
  resultBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  resultConfidence: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.amberReadout,
    letterSpacing: 1,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resultRarity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultRegion: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  retryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  addBtn: {
    flex: 2,
    backgroundColor: colors.scannerGreen,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.scannerGreenGlow,
    shadowColor: colors.scannerGreenGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 7,
  },
  addBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textInverse,
    letterSpacing: 1,
  },
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RarityBadge } from '../components/ui/RarityBadge';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { MOCK_ANIMONS } from '../data/mockAnimons';

const { width: W, height: H } = Dimensions.get('window');
const RETICLE_SIZE = W * 0.72;

// The mock result the camera will "identify"
const MOCK_RESULT = MOCK_ANIMONS[9]; // Red Fox — rare

type CaptureState = 'idle' | 'scanning' | 'result';

export default function CameraScreen() {
  const [captureState, setCaptureState] = useState<CaptureState>('idle');

  // Scanning reticle pulse
  const reticleOpacity = useSharedValue(0.5);
  // Result card slide up
  const resultY = useSharedValue(H);

  useEffect(() => {
    reticleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.35, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, []);

  const reticleStyle = useAnimatedStyle(() => ({
    opacity: reticleOpacity.value,
  }));

  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: resultY.value }],
  }));

  function handleCapture() {
    if (captureState !== 'idle') return;
    setCaptureState('scanning');
    // After 1500ms reveal result card
    setTimeout(() => {
      setCaptureState('result');
      resultY.value = withSpring(0, { damping: 22, stiffness: 100 });
    }, 1500);
  }

  function handleRetry() {
    resultY.value = withTiming(H, { duration: 300 });
    setTimeout(() => setCaptureState('idle'), 320);
  }

  function handleAdd() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Simulated viewfinder ─────────────────────────────────── */}
      <View style={styles.viewfinder}>
        {/* Background image to simulate "what the camera sees" */}
        <Image
          source={{ uri: MOCK_RESULT.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={captureState === 'scanning' ? 2 : 0}
        />
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Reticle — animated corner brackets */}
        <View style={styles.reticleContainer}>
          <Animated.View style={[styles.reticle, reticleStyle]}>
            {/* Top-left corner */}
            <View style={[styles.corner, styles.cornerTL]} />
            {/* Top-right corner */}
            <View style={[styles.corner, styles.cornerTR]} />
            {/* Bottom-left corner */}
            <View style={[styles.corner, styles.cornerBL]} />
            {/* Bottom-right corner */}
            <View style={[styles.corner, styles.cornerBR]} />
          </Animated.View>

          {captureState === 'scanning' && (
            <Text style={styles.scanningText}>Scanning... 🔍</Text>
          )}
        </View>
      </View>

      {/* ── Top controls ─────────────────────────────────────────── */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Catch Anímon</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Capture button ──────────────────────────────────────── */}
      {captureState !== 'result' && (
        <View style={styles.captureArea}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              captureState === 'scanning' && styles.captureButtonScanning,
            ]}
            onPress={handleCapture}
            disabled={captureState === 'scanning'}
            activeOpacity={0.8}
          >
            <Text style={styles.captureIcon}>
              {captureState === 'scanning' ? '⌛' : '🐾'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.captureHint}>
            {captureState === 'scanning' ? 'Identifying...' : 'Tap to capture'}
          </Text>
        </View>
      )}

      {/* ── Result card (slides up) ──────────────────────────────── */}
      <Animated.View style={[styles.resultCard, resultStyle]}>
        <View style={styles.resultHandle} />

        <View style={styles.resultImageRow}>
          <Image
            source={{ uri: MOCK_RESULT.photoUrl }}
            style={styles.resultThumb}
            contentFit="cover"
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>
              {MOCK_RESULT.species} identified! 🦊
            </Text>
            {MOCK_RESULT.breed && (
              <Text style={styles.resultBreed}>{MOCK_RESULT.breed}</Text>
            )}
            <Text style={styles.resultConfidence}>
              {Math.round(MOCK_RESULT.confidenceScore * 100)}% confident
            </Text>
          </View>
        </View>

        {/* Type chips */}
        <View style={styles.resultTags}>
          {MOCK_RESULT.types.map((t) => (
            <TypeTagChip key={t} type={t} size="sm" />
          ))}
        </View>

        {/* Rarity */}
        <View style={styles.resultRarity}>
          <RarityBadge rarity={MOCK_RESULT.rarity} size="lg" />
          <Text style={styles.resultRegion}>📍 {MOCK_RESULT.region}</Text>
        </View>

        {/* Actions */}
        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Add to Anílog ✓</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const CORNER = 22;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  // Reticle
  reticleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  scanningText: {
    marginTop: RETICLE_SIZE / 2 + 20,
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.base,
  },
  // Top controls
  topControls: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: typography.fontFamily.bodyBold,
  },
  topTitle: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
  },
  // Capture button
  captureArea: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  captureButtonScanning: {
    backgroundColor: '#4A4A4A',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  captureIcon: { fontSize: 32 },
  captureHint: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
  },
  // Result card
  resultCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
  },
  resultHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  resultImageRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  resultThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    gap: 4,
  },
  resultTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  resultBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  resultConfidence: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resultRarity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultRegion: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  retryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  addBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.inverse,
  },
});
