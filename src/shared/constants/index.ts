export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pokeapi.co/api/v2',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
} as const;

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  grass: '#78c850',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
} as const;

export const PAGINATION_OPTIONS = [10, 20, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_STAT_VALUE = 255;

export const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 10 * 60 * 1000,
  LONG: 30 * 60 * 1000,
  VERY_LONG: 60 * 60 * 1000,
} as const;

export const RETRY_CONFIG = {
  DEFAULT_MAX_RETRIES: 3,
  DEFAULT_BASE_DELAY: 1000,
  DEFAULT_MAX_DELAY: 30000,
  BATCH_MAX_RETRIES: 2,
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 500,
  DEFAULT: 300,
} as const;

export const UI_CONSTANTS = {
  MAX_CONTENT_WIDTH: 1200,
  TYPE_CHIP_MAX_WIDTH: 200,
  ABILITY_CHIP_MAX_WIDTH: 250,
  DEFAULT_FONT_WEIGHT: 500,
} as const;

export const API_LIMITS = {
  TYPES_LIMIT: 100,
} as const;
