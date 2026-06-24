import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        width: '100%',
        minHeight: '100%',
      },
      body: {
        width: '100%',
        minHeight: '100%',
        margin: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '#root': {
        minHeight: '100vh',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      button: {
        fontFamily: 'inherit',
      },
      textarea: {
        fontFamily: 'inherit',
      },
    })}
  />
);