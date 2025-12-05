import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pokeapi } from '../services/pokeapi';
import type { PokemonTableRow } from '../types';
import { CACHE_TIMES } from '../../../shared/constants';

interface UsePokemonSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: PokemonTableRow[];
  isSearching: boolean;
  searchError: string | null;
}

export const usePokemonSearch = (): UsePokemonSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonTableRow[]>([]);

  const { data: searchPokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon-search', searchQuery.toLowerCase()],
    queryFn: () => {
      if (!searchQuery.trim()) return null;
      return pokeapi.getPokemonById(searchQuery.trim().toLowerCase());
    },
    enabled: !!searchQuery.trim(),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    retry: false,
  });

  useEffect(() => {
    if (searchPokemon) {
      setSearchResults([
        {
          id: searchPokemon.id,
          name: searchPokemon.name,
          types: searchPokemon.types.map((t) => t.type.name),
          sprite: searchPokemon.sprites.front_default || '',
        },
      ]);
    } else if (!searchQuery.trim()) {
      setSearchResults([]);
    } else if (error) {
      setSearchResults([]);
    }
  }, [searchPokemon, searchQuery, error]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: isLoading,
    searchError: error ? (error instanceof Error ? error.message : 'Search failed') : null,
  };
};
