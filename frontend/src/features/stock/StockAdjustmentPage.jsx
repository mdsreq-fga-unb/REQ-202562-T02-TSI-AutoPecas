import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PartStatusBadge from '../parts/PartStatusBadge.jsx';
import useStockAdjustment from './useStockAdjustment.js';

export default function StockAdjustmentPage({ partId, onDone, backLabel = 'Voltar ao catálogo' }) {
  const { state, form, setForm, result, error, isLocked, isSaving, submit } =
    useStockAdjustment(partId);
  const formattedDelta =
    result &&
    (result.quantity_delta > 0 ? `+${result.quantity_delta}` : `${result.quantity_delta}`);
  return (
    <Stack spacing={3}>
      <Typography variant="h1">Registrar ajuste de inventário</Typography>
      {state.status === 'loading' && <CircularProgress aria-label="Carregando estoque" />}
      {state.status === 'error' && <Alert severity="error">{state.error.message}</Alert>}
      {state.status === 'ready' && (
        <>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="overline">{state.part.manufacturer_code}</Typography>
            <Typography variant="h2">{state.part.name}</Typography>
            <PartStatusBadge status={state.part.status} />
            <Typography sx={{ mt: 2 }}>
              {state.balance
                ? `Saldo atual: ${state.balance.stock_balance} unidades`
                : 'Saldo atual indisponível'}
            </Typography>
          </Paper>
          {result && (
            <Alert severity="success">
              Ajuste registrado ({formattedDelta} unidades). Saldo após este ajuste:{' '}
              {result.stock_balance} unidades. Justificativa: {result.justification}.
            </Alert>
          )}
          {error && <Alert severity="error">{error.message}</Alert>}
          {!result && (
            <Paper
              component="form"
              onSubmit={submit}
              noValidate
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 } }}
            >
              <Stack spacing={3}>
                <TextField
                  name="quantity_delta"
                  label="Diferença de quantidade"
                  sx={{ '& input': { minHeight: 44, boxSizing: 'border-box' } }}
                  type="text"
                  error={Boolean(error?.fields?.quantity_delta)}
                  helperText={
                    error?.fields?.quantity_delta ||
                    'Informe a diferença em relação ao saldo atual (ex.: +2 ou -3), não o saldo final.'
                  }
                  disabled={isLocked}
                  value={form.quantity_delta}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { inputMode: 'text' },
                  }}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, quantity_delta: e.target.value }))
                  }
                />
                <TextField
                  name="justification"
                  label="Justificativa"
                  sx={{ '& input': { minHeight: 44, boxSizing: 'border-box' } }}
                  type="text"
                  error={Boolean(error?.fields?.justification)}
                  helperText={error?.fields?.justification}
                  disabled={isLocked}
                  value={form.justification}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { maxLength: 120 },
                  }}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, justification: e.target.value }))
                  }
                />
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving
                    ? 'Confirmando…'
                    : error?.isUncertain
                      ? 'Tentar novamente'
                      : 'Confirmar ajuste'}
                </Button>
              </Stack>
            </Paper>
          )}
        </>
      )}
      <Button onClick={onDone} disabled={isLocked}>
        {backLabel}
      </Button>
    </Stack>
  );
}
