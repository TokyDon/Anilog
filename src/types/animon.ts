/**
 * Anílog Core Types — Anímon
 *
 * These are the fundamental domain types for the Anímon collectible system.
 * All AI identification, storage, and display logic references these types.
 */

import type { AnimonTypeName } from '../constants/typeSystem';

export type AnimonRarity = 'common' | 'uncommon' | 'rare' | 'glossy';

/** Re-export for convenience */
export type AnimonType = AnimonTypeName;

// ─── AI Identification ────────────────────────────────────────────────────────

/**
 * The structured result returned by the Gemini Vision AI service.
 * If confidenceScore < 0.7, alternativeCandidates will be populated
 * and the app will prompt the user to disambiguate.
 */
export interface AiIdentificationResult {
  species: string;
  breed: string | null;
  colour: string;
  gender: 'male' | 'female' | 'unknown';
  isGlossy: boolean;
  confidenceScore: number; // 0–1
  suggestedTypes: AnimonType[];
  alternativeCandidates?: Array<{
    species: string;
    confidence: number;
  }>;
}

// ─── Core Anímon Entity ───────────────────────────────────────────────────────

/**
 * A captured Anímon as stored in Supabase and displayed in the collection.
 *
 * Privacy note: `region` is ALWAYS city/region level.
 * Precise GPS coordinates are NEVER stored.
 */
export interface Animon {
  id: string;
  userId: string;
  species: string;
  breed: string | null;
  colour: string;
  gender: 'male' | 'female' | 'unknown';
  rarity: AnimonRarity;
  types: AnimonType[];
  photoUrl: string;
  /** City/region only — e.g. "London, UK". NEVER precise GPS. */
  region: string;
  capturedAt: string; // ISO 8601
  confidenceScore: number;
}

// ─── Collection Stats ─────────────────────────────────────────────────────────

export interface CollectionStats {
  total: number;
  byRarity: Record<AnimonRarity, number>;
  uniqueSpecies: number;
  uniqueRegions: number;
}
