import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { pokeapi } from '../services/pokeapi';
import type { PokemonTableRow } from '../types';
import { CACHE_TIMES, RETRY_CONFIG } from '../../../shared/constants';

interface UsePokemonByMultipleTypesParams {
  typeNames: string[];
  enabled: boolean;
  page: number;
  pageSize: number;
}

export const usePokemonByMultipleTypes = ({
  typeNames,
  enabled,
  page,
  pageSize,
}: UsePokemonByMultipleTypesParams) => {
  const typeQueries = useQueries({
    queries:
      typeNames.length > 0
        ? typeNames.map((typeName) => ({
            queryKey: ['pokemon-type', typeName],
            queryFn: () => pokeapi.getPokemonByType(typeName),
            enabled: enabled && typeNames.length > 0,
            staleTime: CACHE_TIMES.MEDIUM,
            gcTime: CACHE_TIMES.LONG,
            retry: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
            retryDelay: (attemptIndex: number) => Math.min(
              RETRY_CONFIG.DEFAULT_BASE_DELAY * 2 ** attemptIndex,
              RETRY_CONFIG.DEFAULT_MAX_DELAY
            ),
          }))
        : [],
  });

  const intersectionPokemon = useMemo(() => {
    if (typeNames.length === 0 || typeQueries.length === 0) return [];
    
    if (typeQueries.some((q) => !q.data || !q.data.pokemon)) return [];

    const pokemonSets = typeQueries
      .map((query) => {
        if (!query.data?.pokemon || !Array.isArray(query.data.pokemon)) {
          return null;
        }
        const pokemonUrls = new Set(
          query.data.pokemon.map((tp) => tp.pokemon.url)
        );
        return pokemonUrls;
      })
      .filter((set): set is Set<string> => set !== null);

    if (pokemonSets.length === 0) return [];

    const firstSet = pokemonSets[0];
    if (!firstSet || firstSet.size === 0) return [];

    const intersectionUrls: string[] = [];

    firstSet.forEach((url) => {
      if (pokemonSets.every((set) => set.has(url))) {
        intersectionUrls.push(url);
      }
    });

    return intersectionUrls;
  }, [typeQueries, typeNames.length]);

  const paginatedUrls = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return intersectionPokemon.slice(start, end);
  }, [intersectionPokemon, page, pageSize]);

  const detailQueries = useQueries({
    queries:
      paginatedUrls.map((url) => ({
        queryKey: ['pokemon', url],
        queryFn: async () => {
          const urlParts = url.split('/');
          const id = urlParts[urlParts.length - 2];
          return pokeapi.getPokemonById(id);
        },
        enabled: paginatedUrls.length > 0,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.LONG,
      })) || [],
  });

  const isLoading =
    typeQueries.some((q) => q.isLoading) || detailQueries.some((q) => q.isLoading);
  const error =
    typeQueries.find((q) => q.error)?.error ||
    detailQueries.find((q) => q.error)?.error;

  const data: PokemonTableRow[] =
    detailQueries
      .filter((q) => q.data)
      .map((q) => {
        if (!q.data) return null;
        return {
          id: q.data.id,
          name: q.data.name,
          types: q.data.types.map((t) => t.type.name),
          sprite: q.data.sprites.front_default || '',
        };
      })
      .filter((row): row is PokemonTableRow => row !== null);

  const totalCount = intersectionPokemon.length;

  return {
    data,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null,
    totalCount,
    refetch: () => {
      typeQueries.forEach((q) => q.refetch());
    },
  };
};
