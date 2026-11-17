import { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppShell from './layouts/AppShell.jsx';
import DiscardChangesDialog from './components/DiscardChangesDialog.jsx';
import PartRegistrationPage from './features/parts/PartRegistrationPage.jsx';
import PartCatalogPage from './features/parts/PartCatalogPage.jsx';
import PartEditPage from './features/parts/PartEditPage.jsx';
import { buildTheme } from './theme/theme.js';

export default function App() {
  const [view, setView] = useState({ page: 'new' });
  const [navigationState, setNavigationState] = useState({ isDirty: false, isLocked: false });
  const [pendingPage, setPendingPage] = useState(null);
  useEffect(() => {
    const title = { new: 'Nova peça', catalog: 'Catálogo', edit: 'Editar peça' }[view.page];
    document.title = `${title} · TSI Peças`;
  }, [view.page]);
  const openCatalog = () => setView({ page: 'catalog' });
  const openCreate = () => setView({ page: 'new' });
  const openEdit = (partId) => setView({ page: 'edit', partId });
  function navigate(page) {
    if (page === view.page) return;
    if (view.page === 'new' && navigationState.isLocked) return;
    if (view.page === 'new' && navigationState.isDirty) {
      setPendingPage(page);
    } else {
      setView({ page });
    }
  }
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
      <AppShell
        mode={mode}
        onToggleTheme={toggleTheme}
        page={view.page}
        onNavigate={navigate}
        isNavigationLocked={view.page === 'new' && navigationState.isLocked}
      >
        {view.page === 'new' && (
          <PartRegistrationPage onEdit={openEdit} onNavigationStateChange={setNavigationState} />
        )}
        {view.page === 'catalog' && <PartCatalogPage onEdit={openEdit} onCreate={openCreate} />}
        {view.page === 'edit' && (
          <PartEditPage key={view.partId} partId={view.partId} onDone={openCatalog} />
        )}
      </AppShell>
      <DiscardChangesDialog
        open={pendingPage !== null}
        onContinue={() => setPendingPage(null)}
        onDiscard={() => {
          setView({ page: pendingPage });
          setPendingPage(null);
        }}
      />
    </ThemeProvider>
  );
}
