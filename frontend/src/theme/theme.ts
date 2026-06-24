import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#60a5fa',
    },
    success: {
      main: '#16a34a',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#d97706',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segue UI", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});