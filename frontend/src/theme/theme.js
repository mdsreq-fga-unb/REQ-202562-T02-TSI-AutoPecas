import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#cc0024', dark: '#a8001d', light: '#fff0f2' },
    secondary: { main: '#202124' },
    background: { default: '#f6f7f9', paper: '#ffffff' },
    text: { primary: '#22252b', secondary: '#626975' },
    divider: '#e7e9ed',
    success: { main: '#28734b' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.045em' },
    h2: { fontSize: '1.1rem', fontWeight: 650, letterSpacing: '-0.02em' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44, paddingInline: 20 } },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    MuiTextField: { defaultProps: { fullWidth: true, variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#fff', fontSize: '0.875rem' },
        notchedOutline: { borderColor: '#d7dbe1' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { outlined: { borderColor: '#e7e9ed' } },
    },
  },
});

export default theme;
