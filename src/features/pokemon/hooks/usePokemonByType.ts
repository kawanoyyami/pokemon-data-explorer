import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { pokeapi } from '../services/pokeapi';
import type { PokemonTableRow } from '../types';
import { CACHE_TIMES, RETRY_CONFIG } from '../../../shared/constants';

interface UsePokemonByTypeParams {
  typeName: string;
  enabled: boolean;
  page: number;
  pageSize: number;
}

export const usePokemonByType = ({
  typeName,
  enabled,
  page,
  pageSize,
}: UsePokemonByTypeParams) => {
  const typeQuery = useQuery({
    queryKey: ['pokemon-type', typeName],
    queryFn: () => pokeapi.getPokemonByType(typeName),
    enabled: enabled && typeName !== 'all',
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    retry: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(
      RETRY_CONFIG.DEFAULT_BASE_DELAY * 2 ** attemptIndex,
      RETRY_CONFIG.DEFAULT_MAX_DELAY
    ),
  });

  const paginatedPokemon = useMemo(() => {
    if (!typeQuery.data?.pokemon) return [];
    const start = page * pageSize;
    const end = start + pageSize;
    return typeQuery.data.pokemon.slice(start, end);
  }, [typeQuery.data?.pokemon, page, pageSize]);

  const detailQueries = useQueries({
    queries:
      paginatedPokemon.map((typePokemon) => ({
        queryKey: ['pokemon', typePokemon.pokemon.url],
        queryFn: async () => {
          const urlParts = typePokemon.pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          return pokeapi.getPokemonById(id);
        },
        enabled: !!typeQuery.data,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.LONG,
      })) || [],
  });

  const isLoading = typeQuery.isLoading || detailQueries.some((q) => q.isLoading);
  const error = typeQuery.error || detailQueries.find((q) => q.error)?.error;

  const data: PokemonTableRow[] =
    detailQueries
      .filter((q) => q.data)
      .map((q) => ({
        id: q.data!.id,
        name: q.data!.name,
        types: q.data!.types.map((t) => t.type.name),
        sprite: q.data!.sprites.front_default || '',
      })) || [];

  const totalCount = typeQuery.data?.pokemon.length || 0;

  return {
    data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null,
    totalCount,
    refetch: typeQuery.refetch,
  };
};
