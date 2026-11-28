import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { listSales } from '../../services/sales.js';
import { CHANNELS, formatMoney } from './useSaleRegistration.js';
import SaleCancellationDialog from './SaleCancellationDialog.jsx';

const PAGE_SIZE = 20;
const channelLabels = Object.fromEntries(CHANNELS);
const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const money = (value) => formatMoney(Math.round(Number(value) * 100));
const saleLabel = (sale) =>
  `Venda de ${dateFormat.format(new Date(sale.created_at)).replace(', ', ' ')}`;

export default function SaleListPage({ onNavigationStateChange }) {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    onNavigationStateChange?.({ isDirty: false, isLocked });
  }, [isLocked, onNavigationStateChange]);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    listSales({ offset: 0, limit: PAGE_SIZE }).then(
      (page) => {
        if (!isCurrent) return;
        setSales(page.items);
        setTotal(page.total);
        setStatus('ready');
      },
      () => {
        if (isCurrent) setStatus('error');
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [revision]);

  const load = useCallback(() => {
    setStatus('loading');
    setRevision((current) => current + 1);
  }, []);

  async function loadMore() {
    setIsLoadingMore(true);
    setMoreError(false);
    try {
      const page = await listSales({ offset: sales.length, limit: PAGE_SIZE });
      setSales((current) => [
        ...current,
        ...page.items.filter((sale) => !current.some((item) => item.id === sale.id)),
      ]);
      setTotal(page.total);
    } catch {
      setMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleCancelled(result) {
    const sale = selected;
    setSales((current) =>
      current.map((item) => (item.id === sale.id ? { ...item, status: 'cancelled' } : item)),
    );
    setNotice({
      severity: 'success',
      message: 'Venda cancelada. Estoque restabelecido:',
      balances: result.items.map((entry, index) => ({
        key: entry.part_id,
        text: `${sale.items[index].name}: saldo de ${entry.stock_balance} unidades.`,
      })),
    });
    setSelected(null);
  }

  function handleAlreadyCancelled(message) {
    setNotice({ severity: 'info', message, balances: [] });
    setSelected(null);
    load();
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Vendas registradas</Typography>
      {notice && (
        <Alert severity={notice.severity} onClose={() => setNotice(null)}>
          {notice.message}
          {notice.balances.length > 0 && (
            <Stack component="ul" spacing={0.5} sx={{ mt: 1, mb: 0, pl: 3 }}>
              {notice.balances.map((entry) => (
                <li key={entry.key}>{entry.text}</li>
              ))}
            </Stack>
          )}
        </Alert>
      )}
      {status === 'loading' && <CircularProgress aria-label="Carregando vendas" />}
      {status === 'error' && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={load} sx={{ minHeight: 44 }}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar as vendas.
        </Alert>
      )}
      {status === 'ready' && !sales.length && (
        <Typography color="text.secondary">Nenhuma venda registrada até o momento.</Typography>
      )}
      {status === 'ready' &&
        sales.map((sale) => {
          const label = saleLabel(sale);
          const headingId = `sale-${sale.id}-title`;
          const isCancelled = sale.status === 'cancelled';
          return (
            <Paper
              key={sale.id}
              component="article"
              aria-labelledby={headingId}
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 } }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
                >
                  <Typography id={headingId} variant="h2" sx={{ fontSize: '1.125rem' }}>
                    {label}
                  </Typography>
                  <Chip
                    label={isCancelled ? 'Cancelada' : 'Registrada'}
                    color={isCancelled ? 'default' : 'success'}
                    variant={isCancelled ? 'outlined' : 'filled'}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {channelLabels[sale.channel] ?? sale.channel}
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 3 }}>
                  {sale.items.map((entry) => (
                    <li key={entry.part_id}>
                      {entry.manufacturer_code} · {entry.name}: {entry.quantity} un. ×{' '}
                      {money(entry.unit_price)}
                    </li>
                  ))}
                </Stack>
                <Typography sx={{ fontWeight: 700 }}>Total: {money(sale.total)}</Typography>
                {!isCancelled && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setNotice(null);
                      setSelected(sale);
                    }}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, minHeight: 44 }}
                  >
                    Cancelar venda
                  </Button>
                )}
              </Stack>
            </Paper>
          );
        })}
      {status === 'ready' && moreError && (
        <Alert severity="error">Não foi possível carregar mais vendas. Tente novamente.</Alert>
      )}
      {status === 'ready' && sales.length < total && (
        <Button
          variant="outlined"
          onClick={loadMore}
          disabled={isLoadingMore}
          sx={{ alignSelf: 'center', minHeight: 44 }}
        >
          {isLoadingMore ? 'Carregando…' : 'Carregar mais vendas'}
        </Button>
      )}
      {selected && (
        <SaleCancellationDialog
          sale={selected}
          label={saleLabel(selected)}
          onClose={() => setSelected(null)}
          onSuccess={handleCancelled}
          onAlreadyCancelled={handleAlreadyCancelled}
          onLockChange={setIsLocked}
        />
      )}
    </Stack>
  );
}
