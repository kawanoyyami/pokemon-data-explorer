import { useQuery } from '@tanstack/react-query';
import { pokeapi } from '../services/pokeapi';
import { CACHE_TIMES, RETRY_CONFIG } from '../../../shared/constants';

export const usePokemonDetailQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => {
      if (!id) throw new Error('Pokémon ID is required');
      return pokeapi.getPokemonById(id);
    },
    enabled: !!id,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    retry: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(
      RETRY_CONFIG.DEFAULT_BASE_DELAY * 2 ** attemptIndex,
      RETRY_CONFIG.DEFAULT_MAX_DELAY
    ),
  });
};
