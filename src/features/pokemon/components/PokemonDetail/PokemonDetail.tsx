import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { usePokemonDetailQuery } from '../../hooks';
import { TypeChip } from '../TypeChip';
import { ErrorDisplay, SkeletonCard } from '../../../../shared/components';
import {
  formatPokemonName,
  formatAbilityName,
  formatStatName,
  formatPokemonId,
  decimetersToMeters,
  hectogramsToKilograms,
} from '../../../../shared/utils';
import { MAX_STAT_VALUE, UI_CONSTANTS } from '../../../../shared/constants';
import { ROUTES } from '../../../../config/routes';

export const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, error, refetch } = usePokemonDetailQuery(id);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: UI_CONSTANTS.MAX_CONTENT_WIDTH, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.HOME)}
          sx={{ mb: 3 }}
          aria-label="Go back to Pokémon list"
        >
          Back to List
        </Button>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SkeletonCard />
          </Grid>
          <Grid item xs={12} md={8}>
            <SkeletonCard />
            <SkeletonCard />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !pokemon) {
    return (
      <ErrorDisplay
        message={error?.message || 'Pokémon not found'}
        onRetry={() => {
          if (id) {
            refetch();
          } else {
            navigate(ROUTES.HOME);
          }
        }}
        retryLabel={id ? 'Retry' : 'Back to List'}
      />
    );
  }

  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default ||
    '';

  return (
    <Box sx={{ p: 3, maxWidth: UI_CONSTANTS.MAX_CONTENT_WIDTH, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.HOME)}
        sx={{ mb: 3 }}
        aria-label="Go back to Pokémon list"
      >
        Back to List
      </Button>

      <Paper sx={{ p: 4 }} role="article" aria-label={`Details for ${pokemon.name}`}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              {imageUrl && (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Official artwork of ${pokemon.name}`}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    imageRendering: 'pixelated',
                  }}
                />
              )}
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                component="h1"
              >
                {formatPokemonName(pokemon.name)}
              </Typography>
              <Typography variant="h6" color="text.secondary" component="p">
                {formatPokemonId(pokemon.id)}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                {pokemon.types.map((type) => (
                  <TypeChip
                    key={type.type.name}
                    type={type.type.name}
                    size="medium"
                    sx={{ fontSize: '1rem', padding: '4px 16px' }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ fontWeight: 600, textAlign: 'center' }} 
                      component="h2"
                    >
                      Physical Attributes
                    </Typography>
                    <Box 
                      mt={2} 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        maxWidth={UI_CONSTANTS.TYPE_CHIP_MAX_WIDTH}
                        pb={1}
                        borderBottom="1px solid"
                        borderColor="divider"
                      >
                        <Typography variant="body1" color="text.secondary">
                          Height:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {decimetersToMeters(pokemon.height).toFixed(1)} m
                        </Typography>
                      </Box>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        width="100%"
                        maxWidth={UI_CONSTANTS.TYPE_CHIP_MAX_WIDTH}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Weight:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {hectogramsToKilograms(pokemon.weight).toFixed(1)} kg
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ fontWeight: 600, textAlign: 'center' }} 
                      component="h2"
                    >
                      Abilities
                    </Typography>
                    <Box 
                      mt={2} 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center"
                      justifyContent="center"
                      gap={1} 
                      role="list"
                    >
                      {pokemon.abilities.map((ability) => (
                        <Box
                          key={ability.ability.name}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={1.5}
                          width="100%"
                          maxWidth={UI_CONSTANTS.ABILITY_CHIP_MAX_WIDTH}
                          sx={{
                            backgroundColor: 'background.default',
                            borderRadius: 1,
                          }}
                          role="listitem"
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                          >
                            {formatAbilityName(ability.ability.name)}
                          </Typography>
                          {ability.is_hidden && (
                            <Box
                              component="span"
                              sx={{
                                padding: '4px 8px',
                                backgroundColor: 'warning.main',
                                color: 'white',
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                              }}
                              aria-label="Hidden ability"
                            >
                              Hidden
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }} component="h2">
                      Base Stats
                    </Typography>
                    <Box mt={2} display="flex" flexDirection="column" gap={2} role="list">
                      {pokemon.stats.map((stat) => {
                        const statName = formatStatName(stat.stat.name);
                        const percentage = (stat.base_stat / MAX_STAT_VALUE) * 100;

                        return (
                          <Box key={stat.stat.name} role="listitem">
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={0.5}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {statName}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600, color: 'primary.main' }}
                                aria-label={`${statName}: ${stat.base_stat}`}
                              >
                                {stat.base_stat}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              aria-label={`${statName} progress: ${percentage.toFixed(0)}%`}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
