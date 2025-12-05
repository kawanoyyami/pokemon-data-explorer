# Pokémon Data Explorer

React app for exploring Pokémon data from PokéAPI.

## Setup

### Requirements

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd asessment

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs on `http://localhost:5173`

### Production build

```bash
npm run build
```

Build output goes to `dist/` folder.

## Features

- **Pokémon List** - Table with pagination (10, 20, 50, 100 per page)
- **Search** - Search Pokémon by name (searches entire database)
- **Type Filter** - Select one or multiple types (AND logic - Pokémon must have all selected types)
- **Pokémon Details** - Full info page for each Pokémon

## Project Structure

```
src/
├── features/pokemon/     # Main Pokémon feature
│   ├── components/       # UI components
│   ├── hooks/           # Custom hooks for logic
│   ├── services/        # API calls
│   └── types/           # TypeScript types
├── shared/              # Shared code
│   ├── components/     # Reusable components
│   ├── hooks/          # Shared hooks
│   ├── utils/          # Utility functions
│   └── constants/      # Constants
├── config/             # Config (routes, etc.)
└── lib/                # External library setup
```

## Assumptions and Decisions

1. **Server-side pagination** - Data loads per page, not all at once
2. **Global search** - When searching by name, queries API directly for that Pokémon
3. **Multi-type filter** - When selecting multiple types, finds Pokémon that have ALL selected types (AND logic)
4. **Caching** - React Query caches data for 5-30 minutes depending on data type
5. **Error handling** - Automatic retry with exponential backoff for failed requests

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI
- React Query
- React Router
- Axios

## Notes

- App uses public PokéAPI (https://pokeapi.co/)
- No environment variables needed for basic usage (uses default URL)
- For customization, set `VITE_API_BASE_URL` and `VITE_API_TIMEOUT` in `.env`
