/**
 * Anímon CRUD Operations — Supabase
 *
 * All database operations for the `animons` table.
 * The table schema mirrors the Animon interface exactly.
 */

import { supabase } from './client';
import type { Animon } from '../../types/animon';

const TABLE = 'animons';

export async function getCollection(userId: string): Promise<Animon[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('captured_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Animon[];
}

export async function getAnimon(id: string): Promise<Animon | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Animon | null;
}

export async function createAnimon(
  animon: Omit<Animon, 'id' | 'capturedAt'>,
): Promise<Animon> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: animon.userId,
      species: animon.species,
      breed: animon.breed,
      colour: animon.colour,
      gender: animon.gender,
      rarity: animon.rarity,
      types: animon.types,
      photo_url: animon.photoUrl,
      region: animon.region,
      confidence_score: animon.confidenceScore,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Animon;
}

export async function deleteAnimon(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
