/**
 * useCollection — Collection Data Hook
 *
 * Uses React Query to fetch and cache the user's Anímon collection from Supabase.
 */

import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../../services/supabase/animons';
import { useAuthStore } from '../../store/authStore';

export function useCollection() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['collection', userId],
    queryFn: () => getCollection(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
