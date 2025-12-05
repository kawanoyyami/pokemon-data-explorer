import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  Checkbox,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePokemonListWithSearch } from '../../hooks';
import { PokemonTableRow } from './PokemonTableRow';
import { ErrorDisplay, SkeletonTable } from '../../../../shared/components';
import { formatPokemonName, getTypeColor } from '../../../../shared/utils';
import { PAGINATION_OPTIONS, DEFAULT_PAGE_SIZE, UI_CONSTANTS } from '../../../../shared/constants';
import { ROUTES } from '../../../../config/routes';

export const PokemonTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);

  const {
    loading,
    error,
    totalCount,
    availableTypes,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    filteredData,
    refetch,
  } = usePokemonListWithSearch({
    page,
    pageSize: rowsPerPage,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (pokemonId: number) => {
    navigate(ROUTES.POKEMON_DETAIL(pokemonId));
  };

  const memoizedFilteredData = useMemo(() => filteredData, [filteredData]);

  const showPagination = !searchQuery.trim();

  if (loading && filteredData.length === 0) {
    return (
      <Box sx={{ p: 3, maxWidth: UI_CONSTANTS.MAX_CONTENT_WIDTH, mx: 'auto' }}>
        <SkeletonTable rows={5} />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={() => refetch()}
        retryLabel="Retry"
      />
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: UI_CONSTANTS.MAX_CONTENT_WIDTH, mx: 'auto' }}>
      <Box
        display="flex"
        gap={2}
        mb={3}
        flexWrap="wrap"
        alignItems="center"
        role="search"
        aria-label="Pokémon search and filter"
      >
        <TextField
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
          aria-label="Search Pokémon by name"
        />
        <FormControl sx={{ minWidth: 300, maxWidth: 400 }}>
          <InputLabel id="type-filter-label">Filter by Type(s)</InputLabel>
          <Select
            multiple
            value={selectedTypes}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedTypes(typeof value === 'string' ? value.split(',') : value);
            }}
            input={<OutlinedInput label="Filter by Type(s)" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((type) => (
                  <Chip
                    key={type}
                    label={formatPokemonName(type)}
                    size="small"
                    sx={{
                      backgroundColor: getTypeColor(type),
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            )}
            labelId="type-filter-label"
            aria-label="Filter Pokémon by type(s)"
          >
            {availableTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={selectedTypes.indexOf(type) > -1} />
                {formatPokemonName(type)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTypes.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} selected
            </Typography>
            <Chip
              label="Clear"
              size="small"
              onClick={() => setSelectedTypes([])}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table role="table" aria-label="Pokémon list">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sprite</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type(s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memoizedFilteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No Pokémon found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              memoizedFilteredData.map((pokemon) => (
                <PokemonTableRow
                  key={pokemon.id}
                  pokemon={pokemon}
                  onRowClick={handleRowClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={PAGINATION_OPTIONS}
          labelRowsPerPage="Items per page:"
          aria-label="Table pagination"
        />
      )}
      {!showPagination && filteredData.length > 0 && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Showing search results. Clear search to see paginated list.
          </Typography>
        </Box>
      )}
      {showPagination && selectedTypes.length > 0 && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Showing Pokémon with{' '}
            {selectedTypes.map((t) => formatPokemonName(t)).join(' + ')} type
            {selectedTypes.length > 1 ? 's' : ''} ({totalCount} total)
          </Typography>
        </Box>
      )}
    </Box>
  );
};
