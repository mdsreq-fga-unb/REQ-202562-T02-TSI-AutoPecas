import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });

const SALE = {
  id: 'sale-1',
  channel: 'mercado_livre',
  status: 'registered',
  total: '91.00',
  created_at: '2026-11-28T17:30:00Z',
  items: [
    {
      part_id: 'part-a',
      name: 'Filtro',
      manufacturer_code: 'A-1',
      quantity: 3,
      unit_price: '25.00',
    },
    {
      part_id: 'part-b',
      name: 'Pastilha',
      manufacturer_code: 'B-2',
      quantity: 2,
      unit_price: '8.00',
    },
  ],
};
const CANCELLED = {
  ...SALE,
  id: 'sale-0',
  status: 'cancelled',
  created_at: '2026-11-27T12:00:00Z',
};
const cancelledResponse = (sale = SALE) => ({
  id: sale.id,
  channel: sale.channel,
  status: 'cancelled',
  total: sale.total,
  items: sale.items.map((entry, index) => ({
    part_id: entry.part_id,
    quantity: entry.quantity,
    unit_price: entry.unit_price,
    stock_balance: [10, 5][index],
  })),
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openSales({ sales = [SALE, CANCELLED], post, list } = {}) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      if (post) return post(url, options);
      return response(cancelledResponse());
    }
    if (url.includes('/sales?')) {
      if (list) return list(url);
      return response({ items: sales, total: sales.length });
    }
    return response({ items: [], total: 0 });
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Vendas registradas' }));
  await screen.findByRole('heading', { name: 'Vendas registradas', level: 1 });
  return request;
}

const saleCard = async (label) => screen.findByRole('article', { name: label });
const posts = (request) => request.mock.calls.filter(([, options]) => options?.method === 'POST');

async function requestCancellation() {
  const card = await saleCard('Venda de 28/11/2026 14:30');
  fireEvent.click(within(card).getByRole('button', { name: 'Cancelar venda' }));
  return screen.findByRole('dialog', { name: 'Cancelar venda?' });
}

test('lista as vendas recentes com itens, canal, total e situação', async () => {
  await openSales();
  const card = await saleCard('Venda de 28/11/2026 14:30');
  expect(within(card).getByText('Registrada')).toBeInTheDocument();
  expect(within(card).getByText('Mercado Livre')).toBeInTheDocument();
  expect(within(card).getByText(/Total: R\$\s91,00/)).toBeInTheDocument();
  expect(within(card).getByText(/A-1 · Filtro: 3 un\. × R\$\s25,00/)).toBeInTheDocument();
  expect(within(card).getByText(/B-2 · Pastilha: 2 un\. × R\$\s8,00/)).toBeInTheDocument();
  const cancelled = await saleCard('Venda de 27/11/2026 09:00');
  expect(within(cancelled).getByText('Cancelada')).toBeInTheDocument();
  expect(within(cancelled).queryByRole('button', { name: 'Cancelar venda' })).toBeNull();
});

test('informa quando ainda não há vendas registradas', async () => {
  await openSales({ sales: [] });
  expect(await screen.findByText('Nenhuma venda registrada até o momento.')).toBeInTheDocument();
});

test('permite tentar novamente quando a lista não carrega', async () => {
  let calls = 0;
  await openSales({
    list: () => {
      calls += 1;
      if (calls === 1) throw new TypeError('Failed to fetch');
      return response({ items: [SALE], total: 1 });
    },
  });
  fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
  expect(await saleCard('Venda de 28/11/2026 14:30')).toBeInTheDocument();
});

test('carrega mais vendas quando há outras páginas', async () => {
  await openSales({
    list: (url) =>
      url.includes('offset=0')
        ? response({ items: [SALE], total: 2 })
        : response({ items: [CANCELLED], total: 2 }),
  });
  await saleCard('Venda de 28/11/2026 14:30');
  fireEvent.click(screen.getByRole('button', { name: 'Carregar mais vendas' }));
  expect(await saleCard('Venda de 27/11/2026 09:00')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Carregar mais vendas' })).toBeNull();
});

test('desistir antes de confirmar mantém a venda sem enviar o cancelamento', async () => {
  const request = await openSales();
  const dialog = await requestCancellation();
  expect(within(dialog).getByText(/3 un\. de A-1 · Filtro/)).toBeInTheDocument();
  expect(within(dialog).getByText(/2 un\. de B-2 · Pastilha/)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Manter venda' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(posts(request)).toHaveLength(0);
  const card = await saleCard('Venda de 28/11/2026 14:30');
  expect(within(card).getByText('Registrada')).toBeInTheDocument();
});

test('confirma o cancelamento, mostra os saldos restabelecidos e marca a venda como cancelada', async () => {
  const request = await openSales();
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await screen.findByText('Venda cancelada. Estoque restabelecido:')).toBeInTheDocument();
  expect(screen.getByText('Filtro: saldo de 10 unidades.')).toBeInTheDocument();
  expect(screen.getByText('Pastilha: saldo de 5 unidades.')).toBeInTheDocument();
  const [[url, options]] = posts(request);
  expect(url).toMatch(/\/sales\/sale-1\/cancellation$/);
  expect(options.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
  const card = await saleCard('Venda de 28/11/2026 14:30');
  expect(within(card).getByText('Cancelada')).toBeInTheDocument();
  expect(within(card).queryByRole('button', { name: 'Cancelar venda' })).toBeNull();
});

test('mantém o cancelamento pendente após falha de conexão e reenvia com a mesma chave', async () => {
  let attempts = 0;
  const request = await openSales({
    post: () => {
      attempts += 1;
      if (attempts === 1) throw new TypeError('Failed to fetch');
      return response(cancelledResponse());
    },
  });
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await within(dialog).findByText(/ainda não foi confirmado/)).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: 'Manter venda' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Vendas registradas', hidden: true })).toBeDisabled();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Tentar novamente' }));
  expect(await screen.findByText('Venda cancelada. Estoque restabelecido:')).toBeInTheDocument();
  const [first, second] = posts(request);
  expect(second[1].headers['Idempotency-Key']).toBe(first[1].headers['Idempotency-Key']);
});

test('não apresenta como cancelada uma resposta que não confirma o cancelamento', async () => {
  await openSales({ post: () => response({ ...cancelledResponse(), status: 'registered' }) });
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await within(dialog).findByText(/ainda não foi confirmado/)).toBeInTheDocument();
  expect(screen.queryByText('Venda cancelada. Estoque restabelecido:')).toBeNull();
});

test('identifica as peças inativas que precisam ser reativadas sem alterar a venda', async () => {
  await openSales({
    post: () =>
      response(
        {
          detail: {
            message: 'A venda tem peças inativas. Reative-as antes de cancelar a venda.',
            items: [{ part_id: 'part-b', name: 'Pastilha', manufacturer_code: 'B-2' }],
          },
        },
        422,
      ),
  });
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await within(dialog).findByText(/Reative-as antes de cancelar/)).toBeInTheDocument();
  expect(within(dialog).getByText('B-2 · Pastilha')).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: 'Manter venda' })).toBeEnabled();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Manter venda' }));
  const card = await saleCard('Venda de 28/11/2026 14:30');
  expect(within(card).getByText('Registrada')).toBeInTheDocument();
});

test('informa que a venda já está cancelada e atualiza a lista', async () => {
  let listed = 0;
  await openSales({
    list: () => {
      listed += 1;
      const sale = listed === 1 ? SALE : { ...SALE, status: 'cancelled' };
      return response({ items: [sale], total: 1 });
    },
    post: () =>
      response(
        {
          detail: {
            message: 'Esta venda já está cancelada; o estoque já foi restabelecido.',
          },
        },
        409,
      ),
  });
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await screen.findByText(/já está cancelada/)).toBeInTheDocument();
  const card = await saleCard('Venda de 28/11/2026 14:30');
  await waitFor(() => expect(within(card).getByText('Cancelada')).toBeInTheDocument());
});

test('informa quando a venda não é encontrada', async () => {
  await openSales({
    post: () => response({ detail: { message: 'Venda não encontrada.' } }, 404),
  });
  const dialog = await requestCancellation();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar cancelamento' }));
  expect(await within(dialog).findByText('Venda não encontrada.')).toBeInTheDocument();
  expect(screen.queryByText('Venda cancelada. Estoque restabelecido:')).toBeNull();
});
