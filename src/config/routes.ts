export const ROUTES = {
  HOME: '/',
  POKEMON_DETAIL: (id: string | number) => `/pokemon/${id}`,
} as const;
