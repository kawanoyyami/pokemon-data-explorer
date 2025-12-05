import axios, { AxiosError } from 'axios';
import type {
  Pokemon,
  PokemonListResponse,
  TypeResponse,
  TypesListResponse,
} from '../types';
import { API_CONFIG, RETRY_CONFIG, API_LIMITS, DEFAULT_PAGE_SIZE } from '../../../shared/constants';
import { retryWithBackoff } from '../../../shared/utils';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

export class PokeAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'PokeAPIError';
  }
}

export const pokeapi = {
  async getPokemonList(offset: number = 0, limit: number = DEFAULT_PAGE_SIZE): Promise<PokemonListResponse> {
    return retryWithBackoff(
      async () => {
        try {
          const response = await api.get<PokemonListResponse>('/pokemon', {
            params: { offset, limit },
          });
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          throw new PokeAPIError(
            `Failed to fetch Pokémon list: ${axiosError.message}`,
            axiosError.response?.status,
            error
          );
        }
      },
      {
        maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
        baseDelay: RETRY_CONFIG.DEFAULT_BASE_DELAY,
      }
    );
  },

  async getPokemonById(idOrName: string | number): Promise<Pokemon> {
    return retryWithBackoff(
      async () => {
        try {
          const response = await api.get<Pokemon>(`/pokemon/${idOrName}`);
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            throw new PokeAPIError(
              `Pokémon not found: ${idOrName}`,
              404,
              error
            );
          }
          throw new PokeAPIError(
            `Failed to fetch Pokémon: ${axiosError.message}`,
            axiosError.response?.status,
            error
          );
        }
      },
      {
        maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
        baseDelay: RETRY_CONFIG.DEFAULT_BASE_DELAY,
      }
    );
  },

  async getPokemonBatch(urls: string[]): Promise<Pokemon[]> {
    return retryWithBackoff(
      async () => {
        try {
          const promises = urls.map((url) =>
            api.get<Pokemon>(url.replace(API_CONFIG.BASE_URL, ''))
          );
          const responses = await Promise.all(promises);
          return responses.map((response) => response.data);
        } catch (error) {
          const axiosError = error as AxiosError;
          throw new PokeAPIError(
            `Failed to fetch Pokémon batch: ${axiosError.message}`,
            axiosError.response?.status,
            error
          );
        }
      },
      {
        maxRetries: RETRY_CONFIG.BATCH_MAX_RETRIES,
        baseDelay: RETRY_CONFIG.DEFAULT_BASE_DELAY,
      }
    );
  },

  async getPokemonByType(typeName: string): Promise<TypeResponse> {
    return retryWithBackoff(
      async () => {
        try {
          const response = await api.get<TypeResponse>(`/type/${typeName.toLowerCase()}`);
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            throw new PokeAPIError(
              `Type not found: ${typeName}`,
              404,
              error
            );
          }
          throw new PokeAPIError(
            `Failed to fetch Pokémon by type: ${axiosError.message}`,
            axiosError.response?.status,
            error
          );
        }
      },
      {
        maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
        baseDelay: RETRY_CONFIG.DEFAULT_BASE_DELAY,
      }
    );
  },

  async getAllTypes(): Promise<TypesListResponse> {
    return retryWithBackoff(
      async () => {
        try {
          const response = await api.get<TypesListResponse>('/type', {
            params: { limit: API_LIMITS.TYPES_LIMIT },
          });
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError;
          throw new PokeAPIError(
            `Failed to fetch types: ${axiosError.message}`,
            axiosError.response?.status,
            error
          );
        }
      },
      {
        maxRetries: RETRY_CONFIG.DEFAULT_MAX_RETRIES,
        baseDelay: RETRY_CONFIG.DEFAULT_BASE_DELAY,
      }
    );
  },
};
