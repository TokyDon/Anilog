/**
 * useCapture — Camera + AI Identification Hook
 *
 * Orchestrates the full capture flow:
 * 1. Snap photo via expo-camera
 * 2. Get fuzzy location (city level only)
 * 3. Send to Gemini Vision for identification
 * 4. Derive rarity
 * 5. Save to Supabase
 * 6. Add to local Zustand store
 *
 * Returns state for the 900ms reveal animation.
 */

import { useState, useCallback } from 'react';
import { identifyAnimal, deriveRarity } from '../../services/ai/geminiVision';
import { requestFuzzyLocation, formatRegion } from '../../services/location/fuzzyLocation';
import { createAnimon } from '../../services/supabase/animons';
import { useCollectionStore } from '../../store/collectionStore';
import { useAuthStore } from '../../store/authStore';
import type { Animon, AiIdentificationResult } from '../../types/animon';

interface CaptureState {
  isIdentifying: boolean;
  isRevealing: boolean;
  captured: Animon | null;
  error: string | null;
  needsDisambiguation: boolean;
  candidates: AiIdentificationResult['alternativeCandidates'];
}

export function useCapture() {
  const user = useAuthStore((s) => s.user);
  const addAnimon = useCollectionStore((s) => s.addAnimon);

  const [state, setState] = useState<CaptureState>({
    isIdentifying: false,
    isRevealing: false,
    captured: null,
    error: null,
    needsDisambiguation: false,
    candidates: undefined,
  });

  const capture = useCallback(
    async (base64Image: string, photoUrl: string) => {
      if (!user) return;

      setState((s) => ({ ...s, isIdentifying: true, error: null }));

      try {
        const [result, location] = await Promise.all([
          identifyAnimal(base64Image),
          requestFuzzyLocation(),
        ]);

        // Low confidence — ask user to pick from candidates
        if (result.confidenceScore < 0.7 && result.alternativeCandidates?.length) {
          setState((s) => ({
            ...s,
            isIdentifying: false,
            needsDisambiguation: true,
            candidates: result.alternativeCandidates,
          }));
          return;
        }

        const rarity = deriveRarity(result);
        const region = location ? formatRegion(location) : 'Unknown';

        const animon = await createAnimon({
          userId: user.id,
          species: result.species,
          breed: result.breed,
          colour: result.colour,
          gender: result.gender,
          rarity,
          types: result.suggestedTypes,
          photoUrl,
          region,
          confidenceScore: result.confidenceScore,
        });

        addAnimon(animon);

        // Trigger 900ms reveal animation window
        setState((s) => ({
          ...s,
          isIdentifying: false,
          isRevealing: true,
          captured: animon,
        }));

        setTimeout(() => {
          setState((s) => ({ ...s, isRevealing: false }));
        }, 900);
      } catch (err) {
        setState((s) => ({
          ...s,
          isIdentifying: false,
          error: err instanceof Error ? err.message : 'Capture failed',
        }));
      }
    },
    [user, addAnimon],
  );

  const reset = useCallback(() => {
    setState({
      isIdentifying: false,
      isRevealing: false,
      captured: null,
      error: null,
      needsDisambiguation: false,
      candidates: undefined,
    });
  }, []);

  return { ...state, capture, reset };
}
