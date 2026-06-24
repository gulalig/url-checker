import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { GlobalStyles } from '@/shared';
import { store } from '@/store';
import { appTheme } from '@/theme';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  </Provider>
);