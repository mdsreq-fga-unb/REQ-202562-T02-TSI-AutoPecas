import { Alert, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import PartStatusBadge from '../parts/PartStatusBadge.jsx';
import useStockBalance from './useStockBalance.js';

export default function StockBalancePage({ partId, onDone }) {
  const { state, refresh } = useStockBalance(partId);
  return (
    <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, sm: 48 } }}>
        Consultar saldo
      </Typography>
      {state.status === 'loading' && <CircularProgress aria-label="Consultando saldo" />}
      {state.status === 'error' && (
        <Alert severity="error">Não foi possível consultar o saldo. Tente novamente.</Alert>
      )}
      {state.status === 'ready' && (
        <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, overflowWrap: 'anywhere' }}>
          <Typography variant="overline">{state.part.manufacturer_code}</Typography>
          <Typography variant="h2" sx={{ fontSize: 24, mb: 2 }}>
            {state.part.name}
          </Typography>
          <PartStatusBadge status={state.part.status} />
          <Typography role="status" sx={{ mt: 3, fontSize: { xs: 24, sm: 32 }, fontWeight: 700 }}>
            Saldo atual: {state.balance.stock_balance} unidades
          </Typography>
          {state.balance.stock_balance === 0 && (
            <Typography color="text.secondary">Nenhuma unidade disponível.</Typography>
          )}
        </Paper>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" onClick={refresh} disabled={state.status === 'loading'}>
          {state.status === 'error' ? 'Tentar novamente' : 'Atualizar saldo'}
        </Button>
        <Button onClick={onDone}>Voltar ao catálogo</Button>
      </Stack>
    </Stack>
  );
}
