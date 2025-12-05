import { useQuery } from '@tanstack/react-query';
import { pokeapi } from '../services/pokeapi';
import { CACHE_TIMES, RETRY_CONFIG } from '../../../shared/constants';

export const usePokemonTypes = () => {
  return useQuery({
    queryKey: ['pokemon-types'],
    queryFn: () => pokeapi.getAllTypes(),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    retry: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(
      RETRY_CONFIG.DEFAULT_BASE_DELAY * 2 ** attemptIndex,
      RETRY_CONFIG.DEFAULT_MAX_DELAY
    ),
    select: (data) => {
      const excludedTypes = ['unknown', 'shadow'];
      return data.results
        .map((type) => type.name)
        .filter((name) => !excludedTypes.includes(name))
        .sort();
    },
  });
};
