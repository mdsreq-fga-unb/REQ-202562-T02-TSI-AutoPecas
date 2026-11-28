import { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppShell from './layouts/AppShell.jsx';
import DiscardChangesDialog from './components/DiscardChangesDialog.jsx';
import PartRegistrationPage from './features/parts/PartRegistrationPage.jsx';
import PartCatalogPage from './features/parts/PartCatalogPage.jsx';
import PartEditPage from './features/parts/PartEditPage.jsx';
import PartImportPage from './features/parts/PartImportPage.jsx';
import { readPendingImport } from './features/parts/pendingPartImport.js';
import PartDetailsPage from './features/parts/PartDetailsPage.jsx';
import StockEntryPage from './features/stock/StockEntryPage.jsx';
import SaleRegistrationPage from './features/sales/SaleRegistrationPage.jsx';
import { readPendingSale } from './features/sales/pendingSale.js';
import { readPendingEntry } from './features/stock/pendingStockEntry.js';
import StockExitPage from './features/stock/StockExitPage.jsx';
import { readPendingExit } from './features/stock/pendingStockExit.js';
import { readPendingAssociation } from './features/parts/pendingVehicleAssociation.js';
import { readPendingVehicleChange } from './features/parts/pendingVehicleApplicationChange.js';
import { createCatalogSearchState } from './features/parts/partSearchState.js';
import { buildTheme } from './theme/theme.js';

export default function App() {
  const [catalogSearch, setCatalogSearch] = useState(createCatalogSearchState);
  const [view, setView] = useState(() => {
    const pendingExit = readPendingExit();
    if (pendingExit) return { page: 'exit', partId: pendingExit.partId };
    const entry = readPendingEntry();
    if (entry) return { page: 'entry', partId: entry.partId };
    if (readPendingSale()) return { page: 'sale' };
    const change = readPendingVehicleChange();
    if (change) return { page: 'details', partId: change.partId };
    const pending = readPendingAssociation();
    if (pending) return { page: 'details', partId: pending.partId };
    return readPendingImport() ? { page: 'import' } : { page: 'new' };
  });
  const [navigationState, setNavigationState] = useState({ isDirty: false, isLocked: false });
  const [detailsNavigation, setDetailsNavigation] = useState({ isDirty: false, isLocked: false });
  const [saleNavigation, setSaleNavigation] = useState({ isDirty: false, isLocked: false });
  const [pendingView, setPendingView] = useState(null);
  useEffect(() => {
    const title = {
      new: 'Nova peça',
      catalog: 'Catálogo',
      edit: 'Editar peça',
      details: 'Detalhes da peça',
      entry: 'Registrar entrada',
      exit: 'Registrar saída',
      sale: 'Registrar venda',
      import: 'Importar peças',
    }[view.page];
    document.title = `${title} · TSI Peças`;
  }, [view.page]);
  const openCatalog = () => setView({ page: 'catalog' });
  const openCreate = () => setView({ page: 'new' });
  const openEdit = (partId) => setView({ page: 'edit', partId });
  const openDetails = (partId) => setView({ page: 'details', partId });
  function changeView(next) {
    setDetailsNavigation({ isDirty: false, isLocked: false });
    setSaleNavigation({ isDirty: false, isLocked: false });
    setView(next);
  }
  function requestNavigation(next) {
    const current =
      view.page === 'new'
        ? navigationState
        : view.page === 'details'
          ? detailsNavigation
          : view.page === 'sale'
            ? saleNavigation
            : null;
    if (current?.isLocked) return;
    if (current?.isDirty) setPendingView(next);
    else changeView(next);
  }
  function navigate(page) {
    if (page !== view.page) requestNavigation({ page });
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
        isNavigationLocked={
          view.page === 'entry' ||
          view.page === 'exit' ||
          view.page === 'import' ||
          (view.page === 'details' && detailsNavigation.isLocked) ||
          (view.page === 'sale' && saleNavigation.isLocked) ||
          (view.page === 'new' && navigationState.isLocked)
        }
      >
        {view.page === 'new' && (
          <PartRegistrationPage onEdit={openEdit} onNavigationStateChange={setNavigationState} />
        )}
        {view.page === 'catalog' && (
          <PartCatalogPage
            searchState={catalogSearch}
            onSearchStateChange={setCatalogSearch}
            onView={openDetails}
            onCreate={openCreate}
            onImport={() => setView({ page: 'import' })}
          />
        )}
        {view.page === 'details' && (
          <PartDetailsPage
            key={view.partId}
            partId={view.partId}
            onBack={() => requestNavigation({ page: 'catalog' })}
            onEdit={() =>
              requestNavigation({ page: 'edit', partId: view.partId, fromDetails: true })
            }
            onEntry={() => requestNavigation({ page: 'entry', partId: view.partId })}
            onExit={() => requestNavigation({ page: 'exit', partId: view.partId })}
            isNavigationLocked={detailsNavigation.isLocked}
            onNavigationStateChange={setDetailsNavigation}
          />
        )}
        {view.page === 'entry' && (
          <StockEntryPage
            key={view.partId}
            partId={view.partId}
            onDone={() => openDetails(view.partId)}
            backLabel="Voltar à peça"
          />
        )}
        {view.page === 'exit' && (
          <StockExitPage
            key={view.partId}
            partId={view.partId}
            onDone={() => openDetails(view.partId)}
            backLabel="Voltar à peça"
          />
        )}
        {view.page === 'edit' && (
          <PartEditPage
            key={view.partId}
            partId={view.partId}
            onDone={view.fromDetails ? () => openDetails(view.partId) : openCatalog}
            backLabel={view.fromDetails ? 'Voltar à peça' : 'Voltar ao catálogo'}
          />
        )}
        {view.page === 'import' && <PartImportPage onDone={openCatalog} />}
        {view.page === 'sale' && (
          <SaleRegistrationPage onNavigationStateChange={setSaleNavigation} />
        )}
      </AppShell>
      <DiscardChangesDialog
        open={pendingView !== null}
        onContinue={() => setPendingView(null)}
        onDiscard={() => {
          changeView(pendingView);
          setPendingView(null);
        }}
      />
    </ThemeProvider>
  );
}
