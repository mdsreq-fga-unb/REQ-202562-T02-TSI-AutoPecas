import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { listVehicleApplications } from '../../services/parts.js';
import useVehicleAssociation from './useVehicleAssociation.js';
import useVehicleApplicationChange from './useVehicleApplicationChange.js';
import VehicleApplicationDialog from './VehicleApplicationDialog.jsx';

export default function VehicleApplicationsSection({ partId, onNavigationStateChange }) {
  const [state, setState] = useState({ status: 'loading', items: [], total: 0 });
  const [offset, setOffset] = useState(0);
  const [retry, setRetry] = useState(0);
  const change = useVehicleApplicationChange(partId, () => {
    setState((current) => ({ ...current, status: 'loading' }));
    setRetry((current) => current + 1);
  });
  const association = useVehicleAssociation(partId, (application) => {
    if (state.items.some((item) => item.id === application.id)) return;
    if (offset + state.items.length === state.total && state.items.length < 20) {
      setState((current) => ({
        ...current,
        items: [...current.items, application],
        total: current.total + 1,
      }));
    } else {
      setState((current) => ({ ...current, status: 'loading' }));
      setOffset(Math.floor(state.total / 20) * 20);
      setRetry((current) => current + 1);
    }
  });
  useEffect(() => {
    const controller = new AbortController();
    listVehicleApplications(partId, offset, { signal: controller.signal }).then(
      (data) => {
        if (controller.signal.aborted) return;
        if (offset > 0 && data.items.length === 0 && data.total > 0) {
          setOffset(Math.floor((data.total - 1) / 20) * 20);
          return;
        }
        setState({ status: 'ready', ...data });
      },
      (error) => {
        if (!controller.signal.aborted)
          setState((current) => ({ ...current, status: 'error', error }));
      },
    );
    return () => controller.abort();
  }, [partId, offset, retry]);
  function changePage(next) {
    setState((current) => ({ ...current, status: 'loading' }));
    setOffset(next);
  }
  const isLocked = association.isLocked || change.isLocked;
  const isDirty = association.isDirty;
  useEffect(() => {
    onNavigationStateChange({ isLocked, isDirty });
  }, [isLocked, isDirty, onNavigationStateChange]);
  const canSubmit = state.status === 'ready' && !association.isSaving;
  return (
    <Stack component="section" aria-labelledby="part-applications-title" spacing={2}>
      <Box>
        <Typography id="part-applications-title" variant="h2" sx={{ fontSize: 20 }}>
          Aplicações por veículo
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Informe os veículos compatíveis com esta peça. Cadastre uma associação para cada ano.
        </Typography>
      </Box>
      {change.notice && (
        <Alert severity="success" role="status">
          {change.notice}
        </Alert>
      )}
      {association.success && (
        <Alert severity="success" role="status">
          Aplicação associada com sucesso.
        </Alert>
      )}
      {association.error && (
        <Alert
          severity={association.error.isUncertain ? 'warning' : 'error'}
          sx={{ overflowWrap: 'anywhere' }}
        >
          {association.error.message}
        </Alert>
      )}
      {state.status === 'error' && (
        <Stack spacing={1}>
          <Alert severity="error">{state.error.message}</Alert>
          <Button
            onClick={() => {
              setState((current) => ({ ...current, status: 'loading' }));
              setRetry((current) => current + 1);
            }}
          >
            Tentar carregar novamente
          </Button>
        </Stack>
      )}
      <Paper
        component="form"
        noValidate
        onSubmit={(event) => {
          if (canSubmit) association.submit(event);
          else event.preventDefault();
        }}
        variant="outlined"
        sx={{ p: { xs: 2, sm: 3 } }}
      >
        <Typography variant="h2" component="h3" sx={{ mb: 3 }}>
          Associar veículo
        </Typography>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          {Object.entries({ brand: 'Marca', model: 'Modelo', year: 'Ano' }).map(([name, label]) => (
            <TextField
              fullWidth
              sx={{ '& .MuiInputBase-input': { minHeight: 44, boxSizing: 'border-box' } }}
              key={name}
              name={name}
              label={label}
              required
              value={association.form[name]}
              disabled={association.isLocked || state.status !== 'ready'}
              error={Boolean(association.errors[name])}
              helperText={
                association.errors[name] ||
                (name === 'year' ? 'Um ano de quatro dígitos, por exemplo 2010.' : ' ')
              }
              slotProps={{
                htmlInput:
                  name === 'year'
                    ? { inputMode: 'numeric' }
                    : { maxLength: name === 'brand' ? 100 : 200 },
              }}
              onChange={(event) => association.update(name, event.target.value)}
            />
          ))}
        </Stack>
        <Button type="submit" variant="contained" disabled={!canSubmit} sx={{ mt: 3 }}>
          {association.isSaving
            ? 'Salvando…'
            : association.error?.isUncertain
              ? 'Tentar novamente'
              : 'Associar veículo'}
        </Button>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h2" component="h3" sx={{ mb: 2 }}>
          Aplicações cadastradas
        </Typography>
        {state.status === 'loading' && <CircularProgress aria-label="Carregando aplicações" />}
        {state.status === 'ready' && (
          <>
            {state.items.length ? (
              <Stack component="ul" spacing={1} sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {state.items.map((item) => (
                  <Stack
                    component="li"
                    key={item.id}
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <Typography>
                      {item.brand} · {item.model} · {item.year}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                      <Button
                        aria-label={`Editar aplicação ${item.brand} ${item.model} ${item.year}`}
                        disabled={association.isLocked || association.isDirty}
                        onClick={() => change.startEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        color="error"
                        aria-label={`Remover aplicação ${item.brand} ${item.model} ${item.year}`}
                        disabled={association.isLocked || association.isDirty}
                        onClick={() => change.startRemove(item)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">Nenhuma aplicação cadastrada.</Typography>
            )}
            {state.total > 0 && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {offset + 1}–{offset + state.items.length} de {state.total}
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <Button
                    disabled={offset === 0 || association.isLocked}
                    onClick={() => changePage(offset - 20)}
                  >
                    Página anterior
                  </Button>
                  <Button
                    disabled={offset + 20 >= state.total || association.isLocked}
                    onClick={() => changePage(offset + 20)}
                  >
                    Próxima página
                  </Button>
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Paper>
      <VehicleApplicationDialog change={change} />
    </Stack>
  );
}
