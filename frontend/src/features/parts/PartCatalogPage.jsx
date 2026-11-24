import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { listParts, searchParts } from '../../services/parts.js';
import PartSearchForm from './PartSearchForm.jsx';
import { createCatalogSearchState, searchFieldLabels } from './partSearchState.js';
import PartStatusBadge from './PartStatusBadge.jsx';

export default function PartCatalogPage({
  onView,
  onCreate,
  onImport,
  searchState,
  onSearchStateChange,
}) {
  const { draft, filters, offset } = searchState;
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    (filters
      ? searchParts(filters, offset, { signal: controller.signal })
      : listParts(offset, { signal: controller.signal })
    ).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: 'ready', ...data });
      },
      (error) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [offset, retry, filters]);
  function changePage(next) {
    setState({ status: 'loading' });
    onSearchStateChange((current) => ({ ...current, offset: next }));
  }
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 4 }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 36, sm: 48 } }}>
            Catálogo de peças
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Abra uma peça para consultar o cadastro, as aplicações e o saldo.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignSelf: 'flex-start' }}>
          <Button variant="outlined" onClick={onImport}>
            Importar planilha
          </Button>
          <Button variant="contained" onClick={onCreate}>
            Cadastrar peça
          </Button>
        </Stack>
      </Stack>
      <PartSearchForm
        draft={draft}
        onDraftChange={(next) => onSearchStateChange((current) => ({ ...current, draft: next }))}
        onSearch={(next) => {
          onSearchStateChange((current) => ({ ...current, filters: next, offset: 0 }));
          setState({ status: 'loading' });
        }}
        onClear={() => {
          onSearchStateChange(createCatalogSearchState());
          setRetry((current) => current + 1);
          setState({ status: 'loading' });
        }}
      />
      {filters && (
        <Typography role="status" color="text.secondary" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
          {`Filtros aplicados: ${Object.entries(filters)
            .map(([name, value]) => `${searchFieldLabels[name]}: ${value}`)
            .join(' · ')}`}
        </Typography>
      )}
      {state.status === 'loading' && <CircularProgress aria-label="Carregando catálogo" />}
      {state.status === 'error' && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => {
                setState({ status: 'loading' });
                setRetry((current) => current + 1);
              }}
            >
              Tentar novamente
            </Button>
          }
        >
          {state.error.message}
        </Alert>
      )}
      {state.status === 'ready' && (
        <>
          {state.items.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Typography>
                {filters
                  ? 'Nenhuma peça corresponde aos filtros informados.'
                  : 'Nenhuma peça cadastrada.'}
              </Typography>
            </Paper>
          ) : (
            <Stack component="ul" spacing={2} sx={{ p: 0, listStyle: 'none' }}>
              {state.items.map((part) => (
                <Paper component="li" variant="outlined" key={part.id} sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    sx={{ alignItems: { lg: 'center' } }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                      <Typography variant="overline" color="text.secondary">
                        {part.manufacturer_code}
                      </Typography>
                      <Typography variant="h2">{part.name}</Typography>
                      <Box sx={{ my: 1 }}>
                        <PartStatusBadge status={part.status} />
                      </Box>
                      <Typography color="text.secondary">{part.category}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {part.physical_location || 'Localização não informada'}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardRounded />}
                      aria-label={`Ver peça ${part.name}`}
                      onClick={() => onView(part.id)}
                    >
                      Ver peça
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 3, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Button disabled={offset === 0} onClick={() => changePage(Math.max(0, offset - 20))}>
              Anterior
            </Button>
            <Typography variant="body2">
              {state.total} peça(s) · Página {Math.floor(offset / 20) + 1}
            </Typography>
            <Button disabled={offset + 20 >= state.total} onClick={() => changePage(offset + 20)}>
              Próxima
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
