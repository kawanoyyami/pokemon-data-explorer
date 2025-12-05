import { useQuery, useQueries } from '@tanstack/react-query';
import { pokeapi } from '../services/pokeapi';
import type { PokemonTableRow } from '../types';
import { CACHE_TIMES, RETRY_CONFIG } from '../../../shared/constants';

interface UsePokemonListQueryParams {
  page: number;
  pageSize: number;
}

export const usePokemonListQuery = ({ page, pageSize }: UsePokemonListQueryParams) => {
  const offset = page * pageSize;

  const listQuery = useQuery({
    queryKey: ['pokemon-list', offset, pageSize],
    queryFn: () => pokeapi.getPokemonList(offset, pageSize),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    retry: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(
      RETRY_CONFIG.DEFAULT_BASE_DELAY * 2 ** attemptIndex,
      RETRY_CONFIG.DEFAULT_MAX_DELAY
    ),
  });

  const detailQueries = useQueries({
    queries:
      listQuery.data?.results.map((pokemon) => ({
        queryKey: ['pokemon', pokemon.url],
        queryFn: async () => {
          const urlParts = pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          return pokeapi.getPokemonById(id);
        },
        enabled: !!listQuery.data,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.LONG,
      })) || [],
  });

  const isLoading = listQuery.isLoading || detailQueries.some((q) => q.isLoading);
  const error = listQuery.error || detailQueries.find((q) => q.error)?.error;

  const data: PokemonTableRow[] =
    detailQueries
      .filter((q) => q.data)
      .map((q) => ({
        id: q.data!.id,
        name: q.data!.name,
        types: q.data!.types.map((t) => t.type.name),
        sprite: q.data!.sprites.front_default || '',
      })) || [];

  const availableTypes = Array.from(
    new Set(data.flatMap((p) => p.types))
  ).sort();

  return {
    data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null,
    totalCount: listQuery.data?.count || 0,
    availableTypes,
    refetch: listQuery.refetch,
  };
};
