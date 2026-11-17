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
import useStockEntry from './useStockEntry.js';

export default function StockEntryPage({ partId, onDone }) {
  const { state, form, setForm, result, error, isLocked, isSaving, submit } = useStockEntry(partId);
  return (
    <Stack spacing={3}>
      <Typography variant="h1">Registrar entrada</Typography>
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
              Entrada registrada. Saldo após esta entrada: {result.stock_balance} unidades.
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
                {[
                  ['quantity', 'Quantidade'],
                  ['entry_date', 'Data da entrada'],
                  ['unit_cost', 'Custo unitário (R$)'],
                ].map(([name, label]) => (
                  <TextField
                    key={name}
                    name={name}
                    label={label}
                    sx={{ '& input': { minHeight: 44, boxSizing: 'border-box' } }}
                    type={name === 'entry_date' ? 'date' : 'text'}
                    error={Boolean(error?.fields?.[name])}
                    helperText={error?.fields?.[name]}
                    disabled={isLocked}
                    value={form[name]}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: {
                        inputMode:
                          name === 'quantity'
                            ? 'numeric'
                            : name === 'unit_cost'
                              ? 'decimal'
                              : undefined,
                      },
                    }}
                    onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))}
                  />
                ))}
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving
                    ? 'Confirmando…'
                    : error?.isUncertain
                      ? 'Tentar novamente'
                      : 'Confirmar entrada'}
                </Button>
              </Stack>
            </Paper>
          )}
        </>
      )}
      <Button onClick={onDone} disabled={isLocked}>
        Voltar ao catálogo
      </Button>
    </Stack>
  );
}
