/**
 * Anílog Collection Store — Zustand
 *
 * Manages the local Anímon collection state.
 * React Query handles server sync; this store manages UI state and cache.
 */

import { create } from 'zustand';
import type { Animon } from '../types/animon';

interface CollectionState {
  animons: Animon[];
  selectedAnimon: Animon | null;
  isCapturing: boolean;
  lastCaptured: Animon | null;

  // Actions
  setAnimons: (animons: Animon[]) => void;
  addAnimon: (animon: Animon) => void;
  removeAnimon: (id: string) => void;
  setSelectedAnimon: (animon: Animon | null) => void;
  setCapturing: (isCapturing: boolean) => void;
  setLastCaptured: (animon: Animon | null) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  animons: [],
  selectedAnimon: null,
  isCapturing: false,
  lastCaptured: null,

  setAnimons: (animons) => set({ animons }),

  addAnimon: (animon) =>
    set((state) => ({ animons: [animon, ...state.animons] })),

  removeAnimon: (id) =>
    set((state) => ({
      animons: state.animons.filter((a) => a.id !== id),
    })),

  setSelectedAnimon: (selectedAnimon) => set({ selectedAnimon }),
  setCapturing: (isCapturing) => set({ isCapturing }),
  setLastCaptured: (lastCaptured) => set({ lastCaptured }),
}));
