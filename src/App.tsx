import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { theme } from './theme';
import { ErrorBoundary, LoadingSpinner } from './shared/components';
import { queryClient } from './lib/react-query';
import { ROUTES } from './config/routes';

const PokemonTable = lazy(() =>
  import('./features/pokemon').then((module) => ({
    default: module.PokemonTable,
  }))
);

const PokemonDetail = lazy(() =>
  import('./features/pokemon').then((module) => ({
    default: module.PokemonDetail,
  }))
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ErrorBoundary>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <AppBar
                position="static"
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <Toolbar>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                    Pokémon Data Explorer
                  </Typography>
                </Toolbar>
              </AppBar>
              <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path={ROUTES.HOME} element={<PokemonTable />} />
                    <Route path="/pokemon/:id" element={<PokemonDetail />} />
                  </Routes>
                </Suspense>
              </Container>
            </Box>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
