import { POKEMON_TYPE_COLORS } from '../constants';

export const getTypeColor = (type: string): string => {
  return POKEMON_TYPE_COLORS[type.toLowerCase()] || POKEMON_TYPE_COLORS.normal;
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatAbilityName = (abilityName: string): string => {
  return abilityName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatStatName = (statName: string): string => {
  return statName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatPokemonId = (id: number, padding: number = 3): string => {
  return `#${String(id).padStart(padding, '0')}`;
};

export const decimetersToMeters = (decimeters: number): number => {
  return decimeters / 10;
};

export const hectogramsToKilograms = (hectograms: number): number => {
  return hectograms / 10;
};
