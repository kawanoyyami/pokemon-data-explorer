import { Box, Typography } from '@mui/material';

interface PokemonSpriteProps {
  src: string;
  alt: string;
  size?: number;
}

export const PokemonSprite = ({
  src,
  alt,
  size = 64,
}: PokemonSpriteProps) => {
  if (!src) {
    return (
      <Typography variant="body2" color="text.secondary">
        No image
      </Typography>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
    />
  );
};
