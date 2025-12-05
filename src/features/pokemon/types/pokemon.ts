export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  height: number;
  weight: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface TypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface TypeResponse {
  id: number;
  name: string;
  pokemon: TypePokemon[];
}

export interface TypeListItem {
  name: string;
  url: string;
}

export interface TypesListResponse {
  count: number;
  results: TypeListItem[];
}

export interface PokemonTableRow {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

