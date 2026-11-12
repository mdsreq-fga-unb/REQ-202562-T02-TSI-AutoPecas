import { createTheme } from '@mui/material/styles';

export function buildTheme(mode = 'light') {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#ff5275' : '#c9002c',
        dark: '#a80024',
        light: isDark ? '#38212b' : '#fff0f3',
        contrastText: '#ffffff',
      },
      secondary: { main: isDark ? '#e6e8ed' : '#30343c' },
      background: {
        default: isDark ? '#111215' : '#f6f7f9',
        paper: isDark ? '#1e2127' : '#ffffff',
      },
      text: { primary: isDark ? '#f3f4f6' : '#20232a', secondary: isDark ? '#adb3bf' : '#626975' },
      divider: isDark ? '#363a44' : '#dde1e7',
      success: { main: isDark ? '#7ed6a4' : '#28734b' },
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      h1: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.055em', lineHeight: 1.15 },
      h2: { fontSize: '0.9375rem', fontWeight: 700 },
      body1: { fontSize: '0.875rem', lineHeight: 1.65 },
      body2: { fontSize: '0.75rem', lineHeight: 1.65 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { colorScheme: mode },
          '.skip-link': {
            background: isDark ? '#1e2127' : '#fff',
            color: isDark ? '#ff829d' : '#a8001d',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { minHeight: 46, paddingInline: 20 },
          containedPrimary: {
            backgroundColor: '#c9002c',
            color: '#fff',
            '&:hover': { backgroundColor: '#a80024' },
          },
        },
      },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiTextField: { defaultProps: { fullWidth: true, variant: 'outlined', size: 'small' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#16181d' : '#fafbfc',
            fontSize: '0.875rem',
            borderRadius: 6,
            minHeight: 46,
          },
          notchedOutline: { borderColor: isDark ? '#3d424d' : '#d7dbe1' },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: { borderColor: isDark ? '#2c3038' : '#dde1e7' },
        },
      },
    },
  });
}
