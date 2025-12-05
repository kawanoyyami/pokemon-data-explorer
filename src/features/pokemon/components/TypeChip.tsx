import { Chip } from '@mui/material';
import { getTypeColor } from '../../../shared/utils';

interface TypeChipProps {
  type: string;
  size?: 'small' | 'medium';
  sx?: object;
}

export const TypeChip = ({ type, size = 'small', sx }: TypeChipProps) => {
  return (
    <Chip
      label={type}
      size={size}
      sx={{
        backgroundColor: getTypeColor(type),
        color: 'white',
        fontWeight: 500,
        textTransform: 'capitalize',
        ...sx,
      }}
    />
  );
};
