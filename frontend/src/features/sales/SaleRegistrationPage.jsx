import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import useSaleRegistration, { CHANNELS, formatMoney } from './useSaleRegistration.js';

const fieldSx = { '& input, & .MuiSelect-select': { minHeight: 44, boxSizing: 'border-box' } };

export default function SaleRegistrationPage({ onNavigationStateChange }) {
  const sale = useSaleRegistration();
  const [term, setTerm] = useState('');
  const { items, result, error, isLocked, isSaving } = sale;
  const hasUnsavedChanges = items.length > 0 && !result;
  useEffect(() => {
    onNavigationStateChange?.({ isDirty: hasUnsavedChanges, isLocked });
  }, [hasUnsavedChanges, isLocked, onNavigationStateChange]);
  const shortages = new Map((error?.items ?? []).map((entry) => [entry.part_id, entry]));
  return (
    <Stack spacing={3}>
      <Typography variant="h1">Registrar venda</Typography>
      {result && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Alert severity="success">
              Venda registrada. Total: {formatMoney(Math.round(Number(result.total) * 100))}.
            </Alert>
            <Stack component="ul" spacing={1} sx={{ m: 0, pl: 3 }}>
              {result.items.map((entry, index) => (
                <li key={entry.part_id}>
                  {result.parts[index].name}: {entry.quantity} un. vendidas. Saldo após a venda:{' '}
                  {entry.stock_balance} unidades.
                </li>
              ))}
            </Stack>
            <Button variant="contained" onClick={sale.reset}>
              Nova venda
            </Button>
          </Stack>
        </Paper>
      )}
      {!result && (
        <>
          <Paper
            component="form"
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 } }}
            onSubmit={(event) => {
              event.preventDefault();
              sale.find(term);
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h2">Peças da venda</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Buscar peça por nome ou código"
                  value={term}
                  disabled={isLocked}
                  onChange={(event) => setTerm(event.target.value)}
                  sx={{ flex: 1, ...fieldSx }}
                />
                <Button type="submit" variant="outlined" disabled={isLocked || !term.trim()}>
                  Buscar
                </Button>
              </Stack>
              {sale.search.status === 'loading' && <CircularProgress aria-label="Buscando peças" />}
              {sale.search.status === 'error' && (
                <Alert severity="error">Não foi possível buscar as peças. Tente novamente.</Alert>
              )}
              {sale.search.status === 'ready' && !sale.search.results.length && (
                <Alert severity="info">Nenhuma peça encontrada para “{sale.search.term}”.</Alert>
              )}
              {sale.search.results.map((part) => {
                const added = items.some((item) => item.part.id === part.id);
                return (
                  <Stack
                    key={part.id}
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography>
                      {part.manufacturer_code} · {part.name}
                      {part.status === 'inactive' ? ' (inativa)' : ''}
                    </Typography>
                    <Button
                      variant="text"
                      disabled={isLocked || added || part.status === 'inactive'}
                      aria-label={`Adicionar ${part.name} à venda`}
                      onClick={() => sale.addPart(part)}
                    >
                      {added ? 'Na venda' : 'Adicionar'}
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
          <Paper
            component="form"
            noValidate
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 } }}
            onSubmit={sale.submit}
          >
            <Stack spacing={3}>
              <Typography variant="h2">Resumo da venda</Typography>
              {error?.fields?.items && <Alert severity="warning">{error.fields.items}</Alert>}
              {!items.length && (
                <Typography color="text.secondary">
                  Busque e adicione uma ou mais peças para compor a venda.
                </Typography>
              )}
              {items.map((item, index) => {
                const problems = error?.itemFields?.[index] ?? {};
                const shortage = shortages.get(item.part.id);
                return (
                  <Stack key={item.part.id} spacing={1.5}>
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Typography variant="h3">
                        {item.part.manufacturer_code} · {item.part.name}
                      </Typography>
                      <IconButton
                        aria-label={`Remover ${item.part.name} da venda`}
                        disabled={isLocked}
                        onClick={() => sale.removeItem(index)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Stack>
                    {item.balance !== null && (
                      <Typography variant="body2" color="text.secondary">
                        Saldo atual: {item.balance} unidades
                      </Typography>
                    )}
                    {shortage && (
                      <Alert severity="error">
                        Saldo insuficiente de {item.part.name}: saldo atual de{' '}
                        {shortage.stock_balance} unidades e {shortage.requested} solicitadas.
                      </Alert>
                    )}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label={`Quantidade de ${item.part.name}`}
                        value={item.quantity}
                        disabled={isLocked}
                        error={Boolean(problems.quantity)}
                        helperText={problems.quantity}
                        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                        sx={{ flex: 1, ...fieldSx }}
                        onChange={(event) =>
                          sale.changeItem(index, { quantity: event.target.value })
                        }
                      />
                      <TextField
                        label={`Preço unitário de ${item.part.name} (R$)`}
                        value={item.unit_price}
                        disabled={isLocked}
                        error={Boolean(problems.unit_price)}
                        helperText={problems.unit_price}
                        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                        sx={{ flex: 1, ...fieldSx }}
                        onChange={(event) =>
                          sale.changeItem(index, { unit_price: event.target.value })
                        }
                      />
                    </Stack>
                  </Stack>
                );
              })}
              <TextField
                select
                label="Canal de origem"
                value={sale.channel}
                disabled={isLocked}
                error={Boolean(error?.fields?.channel)}
                helperText={error?.fields?.channel}
                sx={fieldSx}
                onChange={(event) => sale.changeChannel(event.target.value)}
              >
                {CHANNELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="h3">Total: {formatMoney(sale.total)}</Typography>
              {error && !error.itemFields && !error.fields?.items && (
                <Alert severity="error">{error.message}</Alert>
              )}
              <Button type="submit" variant="contained" disabled={isSaving || !items.length}>
                {isSaving
                  ? 'Registrando…'
                  : error?.isUncertain
                    ? 'Tentar novamente'
                    : 'Registrar venda'}
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
}
