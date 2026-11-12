import { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppShell from './layouts/AppShell.jsx';
import PartRegistrationPage from './features/parts/PartRegistrationPage.jsx';
import { buildTheme } from './theme/theme.js';

export default function App() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('tsi-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const theme = useMemo(() => buildTheme(mode), [mode]);
  function toggleTheme() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try {
      localStorage.setItem('tsi-theme', next);
    } catch {
      // O tema continua funcionando quando o navegador bloqueia o armazenamento.
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell mode={mode} onToggleTheme={toggleTheme}>
        <PartRegistrationPage />
      </AppShell>
    </ThemeProvider>
  );
}
