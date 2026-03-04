/**
 * Anílog Auth Store — Zustand
 *
 * Manages authentication state across the app.
 * Synced with Supabase Auth via onAuthStateChange listener.
 */

import { create } from 'zustand';
import type { UserProfile } from '../types/user';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  signOut: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
}));
