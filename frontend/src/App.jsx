import { CssBaseline, ThemeProvider } from '@mui/material';
import AppShell from './layouts/AppShell.jsx';
import PartRegistrationPage from './features/parts/PartRegistrationPage.jsx';
import theme from './theme/theme.js';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell>
        <PartRegistrationPage />
      </AppShell>
    </ThemeProvider>
  );
}
