import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const PART = {
  id: 'part-1',
  manufacturer_code: 'A-1',
  name: 'Filtro',
  category: 'Filtros',
  status: 'active',
  equivalent_codes: [],
};
const response = (data) => ({ ok: true, status: 200, json: async () => data });
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});
async function openBalance(
  balance = async () => response({ part_id: PART.id, stock_balance: 5 }),
  part = PART,
) {
  const request = vi.fn(async (url) => {
    if (url.includes('/stock-balance')) return balance();
    if (url.includes('/vehicle-applications')) return response({ items: [], total: 0 });
    if (url.includes('?')) return response({ items: [part], total: 1 });
    return response(part);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver peça Filtro' }));
  return request;
}

test('consulta o saldo positivo associado à peça sem realizar escritas', async () => {
  const request = await openBalance();
  expect(await screen.findByText('Saldo atual: 5 unidades')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Filtro' })).toBeInTheDocument();
  expect(screen.getByText('A-1')).toBeInTheDocument();
  expect(request.mock.calls.every(([, options]) => options.method === 'GET')).toBe(true);
});

test('apresenta zero explicitamente sem indicar unidades disponíveis', async () => {
  await openBalance(async () => response({ part_id: PART.id, stock_balance: 0 }));
  expect(await screen.findByText('Saldo atual: 0 unidades')).toBeInTheDocument();
  expect(screen.getByText('Nenhuma unidade disponível.')).toBeInTheDocument();
});

test('permite consultar peça inativa e mantém bloqueada a entrada', async () => {
  const request = await openBalance(undefined, { ...PART, status: 'inactive' });
  await screen.findByText('Saldo atual: 5 unidades');
  expect(screen.getByText('Inativo')).toBeInTheDocument();
  expect(request.mock.calls.every(([, options]) => options.method === 'GET')).toBe(true);
  expect(screen.getByRole('button', { name: 'Registrar entrada de Filtro' })).toBeDisabled();
});

test('atualiza o saldo por nova consulta sem exibir o anterior durante o carregamento', async () => {
  let resolveBalance;
  const balance = vi
    .fn()
    .mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 5 }))
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveBalance = resolve;
        }),
    );
  await openBalance(balance);
  await screen.findByText('Saldo atual: 5 unidades');
  fireEvent.click(screen.getByRole('button', { name: 'Atualizar saldo' }));
  expect(screen.getByRole('progressbar', { name: 'Consultando saldo' })).toBeInTheDocument();
  expect(screen.queryByText('Saldo atual: 5 unidades')).not.toBeInTheDocument();
  resolveBalance(response({ part_id: PART.id, stock_balance: 8 }));
  expect(await screen.findByText('Saldo atual: 8 unidades')).toBeInTheDocument();
});

test('falha ao atualizar remove o saldo anterior e permite recuperar a consulta', async () => {
  const balance = vi
    .fn()
    .mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 5 }))
    .mockRejectedValueOnce(new TypeError('offline'))
    .mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 8 }));
  await openBalance(balance);
  await screen.findByText('Saldo atual: 5 unidades');
  fireEvent.click(screen.getByRole('button', { name: 'Atualizar saldo' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível consultar o saldo');
  expect(screen.queryByText(/Saldo atual:/)).not.toBeInTheDocument();
  expect(screen.queryByText('Nenhuma unidade disponível.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Saldo atual: 8 unidades');
});

test.each([
  {},
  { part_id: PART.id, stock_balance: null },
  { part_id: PART.id, stock_balance: '5' },
  { part_id: 'other-part', stock_balance: 5 },
])('não apresenta resposta sem saldo confirmado da peça: %j', async (data) => {
  await openBalance(async () => response(data));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível consultar o saldo');
  expect(screen.queryByText(/Saldo atual:/)).not.toBeInTheDocument();
});

test('consulta o servidor sem reutilizar cache do navegador', async () => {
  const request = await openBalance();
  await screen.findByText('Saldo atual: 5 unidades');
  const [, options] = request.mock.calls.find(([url]) => url.includes('/stock-balance'));
  expect(options.cache).toBe('no-store');
});

test('permite sair durante consulta lenta, aborta e ignora resposta atrasada', async () => {
  let finish;
  const request = await openBalance(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  expect(await screen.findByRole('progressbar', { name: 'Consultando saldo' })).toBeInTheDocument();
  const [, options] = request.mock.calls.find(([url]) => url.includes('/stock-balance'));
  fireEvent.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }));
  expect(options.signal.aborted).toBe(true);
  await act(async () => finish(response({ part_id: PART.id, stock_balance: 5 })));
  await screen.findByRole('heading', { name: 'Catálogo de peças' });
  expect(screen.queryByText(/Saldo atual:/)).not.toBeInTheDocument();
});

test.each([
  { ok: false, status: 503, json: async () => ({ detail: { message: 'Indisponível' } }) },
  {
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('invalid json');
    },
  },
])('falha inicial não é apresentada como saldo zero: %j', async (result) => {
  await openBalance(async () => result);
  await screen.findByRole('alert');
  expect(screen.queryByText(/Saldo atual:/)).not.toBeInTheDocument();
  expect(screen.queryByText('Nenhuma unidade disponível.')).not.toBeInTheDocument();
});
