/**
 * Anilog Root Layout
 *
 * Sets up fonts, React Query provider, and root navigation.
 * v3: Plus Jakarta Sans replaces Playfair Display + DM Sans.
 */

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePartyStore } from '../store/partyStore';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      AsyncStorage.getItem('onboarding_complete').then((val) => {
        if (!val) router.replace('/onboarding');
      });
      // DEV SEED — one-time gift: Domestic Shorthair Cat
      AsyncStorage.getItem('dev_seed_v1').then((seeded) => {
        if (seeded) return;
        usePartyStore.getState().addToParty(
          {
            id: 'dev_cat_001',
            userId: 'local',
            species: 'Domestic Shorthair Cat',
            breed: 'Shorthair',
            colour: 'Orange Tabby',
            gender: 'unknown',
            rarity: 'common',
            types: ['light', 'psychic'],
            photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
            region: 'Home',
            capturedAt: new Date().toISOString(),
            confidenceScore: 1.0,
          },
          'Biscuit',
        );
        AsyncStorage.setItem('dev_seed_v1', 'true');
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#FAFAF5' }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="animon/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}