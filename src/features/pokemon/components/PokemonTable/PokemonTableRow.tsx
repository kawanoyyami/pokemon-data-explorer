import { memo } from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { PokemonSprite, TypeChip } from '../..';
import type { PokemonTableRow as PokemonTableRowType } from '../../types';

interface PokemonTableRowProps {
  pokemon: PokemonTableRowType;
  onRowClick: (id: number) => void;
}

export const PokemonTableRow = memo<PokemonTableRowProps>(
  ({ pokemon, onRowClick }) => {
    const handleClick = () => {
      onRowClick(pokemon.id);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <TableRow
        role="button"
        tabIndex={0}
        aria-label={`View details for ${pokemon.name}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: -2,
          },
        }}
      >
        <TableCell>{pokemon.id}</TableCell>
        <TableCell>
          <PokemonSprite src={pokemon.sprite} alt={pokemon.name} size={64} />
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, textTransform: 'capitalize' }}
          >
            {pokemon.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Box display="flex" gap={1} flexWrap="wrap">
            {pokemon.types.map((type) => (
              <TypeChip key={type} type={type} />
            ))}
          </Box>
        </TableCell>
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.pokemon.id === nextProps.pokemon.id &&
      prevProps.pokemon.name === nextProps.pokemon.name &&
      prevProps.pokemon.sprite === nextProps.pokemon.sprite &&
      JSON.stringify(prevProps.pokemon.types) === JSON.stringify(nextProps.pokemon.types)
    );
  }
);

PokemonTableRow.displayName = 'PokemonTableRow';
