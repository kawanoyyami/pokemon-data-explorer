import { useState, useMemo } from 'react';
import { usePokemonListQuery } from './usePokemonListQuery';
import { usePokemonSearch } from './usePokemonSearch';
import { usePokemonByType } from './usePokemonByType';
import { usePokemonByMultipleTypes } from './usePokemonByMultipleTypes';
import { usePokemonTypes } from './usePokemonTypes';
import type { PokemonTableRow } from '../types';

interface UsePokemonListWithSearchParams {
  page: number;
  pageSize: number;
}

interface UsePokemonListWithSearchReturn {
  data: PokemonTableRow[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  availableTypes: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  filteredData: PokemonTableRow[];
  refetch: () => void;
}

export const usePokemonListWithSearch = ({
  page,
  pageSize,
}: UsePokemonListWithSearchParams): UsePokemonListWithSearchReturn => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: allTypes = [] } = usePokemonTypes();

  const {
    data: listData,
    loading: listLoading,
    error: listError,
    totalCount,
    availableTypes: pageTypes,
    refetch,
  } = usePokemonListQuery({ page, pageSize });

  const availableTypes = allTypes.length > 0 ? allTypes : pageTypes;

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: searchLoading,
    searchError,
  } = usePokemonSearch();

  const {
    data: singleTypeData,
    loading: singleTypeLoading,
    error: singleTypeError,
    totalCount: singleTypeTotalCount,
    refetch: singleTypeRefetch,
  } = usePokemonByType({
    typeName: selectedTypes.length === 1 ? selectedTypes[0] : '',
    enabled: selectedTypes.length === 1 && !searchQuery.trim(),
    page,
    pageSize,
  });

  const {
    data: multipleTypesData,
    loading: multipleTypesLoading,
    error: multipleTypesError,
    totalCount: multipleTypesTotalCount,
    refetch: multipleTypesRefetch,
  } = usePokemonByMultipleTypes({
    typeNames: selectedTypes,
    enabled: selectedTypes.length > 1 && !searchQuery.trim(),
    page,
    pageSize,
  });

  const isSearchMode = !!searchQuery.trim();
  const isTypeFilterMode = selectedTypes.length > 0 && !isSearchMode;
  const isMultipleTypesFilter = selectedTypes.length > 1;

  let data: PokemonTableRow[];
  let loading: boolean;
  let error: string | null;
  let finalTotalCount: number;

  if (isSearchMode) {
    data = searchResults || [];
    loading = searchLoading;
    error = searchError;
    finalTotalCount = searchResults?.length || 0;
  } else if (isTypeFilterMode) {
    if (isMultipleTypesFilter) {
      data = multipleTypesData || [];
      loading = multipleTypesLoading;
      error = multipleTypesError;
      finalTotalCount = multipleTypesTotalCount || 0;
    } else {
      data = singleTypeData || [];
      loading = singleTypeLoading;
      error = singleTypeError;
      finalTotalCount = singleTypeTotalCount || 0;
    }
  } else {
    data = listData || [];
    loading = listLoading;
    error = listError;
    finalTotalCount = totalCount || 0;
  }

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    if (isSearchMode && selectedTypes.length > 0) {
      return data.filter((pokemon) =>
        pokemon?.types && selectedTypes.every((type) => pokemon.types.includes(type))
      );
    }
    return data;
  }, [data, selectedTypes, isSearchMode]);

  return {
    data,
    loading,
    error,
    totalCount: finalTotalCount,
    availableTypes,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    filteredData,
    refetch: isTypeFilterMode
      ? isMultipleTypesFilter
        ? multipleTypesRefetch
        : singleTypeRefetch
      : refetch,
  };
};
