import { Alert, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import useStockBalance from './useStockBalance.js';

export default function StockBalancePanel({ part, onEntry, isNavigationLocked }) {
  const { state, refresh } = useStockBalance(part.id);
  const entryBlockedReason =
    part.status === 'inactive'
      ? 'Peça inativa. Ative-a em Dados cadastrais para registrar uma entrada.'
      : isNavigationLocked
        ? 'Conclua a operação em Aplicações por veículo para liberar a entrada.'
        : null;
  return (
    <Paper
      component="section"
      aria-labelledby="part-stock-title"
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Stack spacing={2}>
        <Typography id="part-stock-title" variant="h2" sx={{ fontSize: 20 }}>
          Estoque
        </Typography>
        {state.status === 'loading' && (
          <CircularProgress size={24} aria-label="Consultando saldo" />
        )}
        {state.status === 'error' && (
          <Alert severity="error">Não foi possível consultar o saldo. Tente novamente.</Alert>
        )}
        {state.status === 'ready' && (
          <div>
            <Typography role="status" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}>
              Saldo atual: {state.balance.stock_balance} unidades
            </Typography>
            {state.balance.stock_balance === 0 && (
              <Typography color="text.secondary">Nenhuma unidade disponível.</Typography>
            )}
          </div>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap' }}
        >
          <Button
            variant="contained"
            aria-label={`Registrar entrada de ${part.name}`}
            onClick={onEntry}
            disabled={Boolean(entryBlockedReason)}

            aria-describedby={entryBlockedReason ? 'part-entry-block-reason' : undefined}
            sx={{
              '&.MuiButton-contained.MuiButton-colorPrimary.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.secondary',
                cursor: 'not-allowed',
                pointerEvents: 'auto',
              },
            }}
          >
            Registrar entrada
          </Button>
          <Button onClick={refresh} disabled={state.status === 'loading'}>
            {state.status === 'error' ? 'Tentar novamente' : 'Atualizar saldo'}
          </Button>
        </Stack>
        {entryBlockedReason && (
          <Typography
            id="part-entry-block-reason"
            variant="body2"
            color="text.secondary"
            role="status"
          >
            {entryBlockedReason}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
