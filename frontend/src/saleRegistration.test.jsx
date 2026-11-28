import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
const saleResponse = (data) => ({
  id: 'sale-1',
  status: 'registered',
  total: '76.50',
  ...data,
  items: data.items.map((item) => ({ ...item, stock_balance: 7 })),
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openSale({ post, parts = [PART] } = {}) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      if (post) return post(url, options);
      const data = JSON.parse(options.body);
      return response(saleResponse(data), 201);
    }
    if (url.includes('/stock-balance')) return response({ part_id: PART.id, stock_balance: 10 });
    if (url.includes('/parts/search')) {
      return response({ items: parts, total: parts.length });
    }
    return response({ items: [], total: 0 });
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Venda', exact: true }));
  await screen.findByRole('heading', { name: 'Registrar venda' });
  return request;
}

async function addFilter() {
  fireEvent.change(screen.getByLabelText('Buscar peça por nome ou código'), {
    target: { value: 'Filtro' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Adicionar Filtro à venda' }));
  await screen.findByText('Saldo atual: 10 unidades');
}

async function chooseChannel(label) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Canal de origem' }));
  fireEvent.click(await screen.findByRole('option', { name: label }));
}

async function fillSale({ quantity = '3', price = '25,50', channel = 'Balcão' } = {}) {
  await addFilter();
  fireEvent.change(screen.getByLabelText('Quantidade de Filtro'), { target: { value: quantity } });
  fireEvent.change(screen.getByLabelText('Preço unitário de Filtro (R$)'), {
    target: { value: price },
  });
  await chooseChannel(channel);
}

test('registra a venda com canal, quantidade e preço unitário e mostra o saldo após a venda', async () => {
  const request = await openSale();
  await fillSale();
  expect(screen.getByText(/Total:/)).toHaveTextContent('R$ 76,50');
  fireEvent.click(screen.getByRole('button', { name: 'Registrar venda' }));
  await screen.findByText('Venda registrada. Total: R$ 76,50.');
  expect(screen.getByText(/Saldo após a venda: 7 unidades/)).toBeInTheDocument();
  const [, options] = request.mock.calls.find(([, o]) => o?.method === 'POST');
  expect(JSON.parse(options.body)).toEqual({
    channel: 'counter',
    items: [{ part_id: 'part-1', quantity: 3, unit_price: '25.50' }],
  });
  expect(options.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
});

test('oferece os três canais de origem e não escolhe um por padrão', async () => {
  await openSale();
  await addFilter();
  expect(
    screen.getByRole('combobox', { name: 'Canal de origem' }).textContent.replace(/\u200b/g, ''),
  ).toBe('');
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Canal de origem' }));
  for (const label of ['Balcão', 'Mercado Livre', 'Contato direto'])
    expect(await screen.findByRole('option', { name: label })).toBeInTheDocument();
});

test('bloqueia venda acima do saldo informando o saldo atual e preserva os dados', async () => {
  await openSale({
    post: async () =>
      response(
        {
          detail: {
            message: 'Saldo insuficiente: a quantidade vendida não pode superar o saldo atual.',
            items: [{ part_id: 'part-1', requested: 15, stock_balance: 10 }],
          },
        },
        422,
      ),
  });
  await fillSale({ quantity: '15' });
  fireEvent.click(screen.getByRole('button', { name: 'Registrar venda' }));
  expect(
    await screen.findByText(
      'Saldo insuficiente de Filtro: saldo atual de 10 unidades e 15 solicitadas.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade de Filtro')).toHaveValue('15');
  expect(screen.queryByText(/Venda registrada/)).not.toBeInTheDocument();
});

test('exige canal, quantidade inteira positiva e preço válido antes de enviar', async () => {
  const request = await openSale();
  await addFilter();
  fireEvent.change(screen.getByLabelText('Quantidade de Filtro'), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText('Preço unitário de Filtro (R$)'), {
    target: { value: '1,234' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Registrar venda' }));
  expect(await screen.findByText('Selecione o canal de origem da venda.')).toBeInTheDocument();
  expect(screen.getByText('Informe uma quantidade inteira maior que zero.')).toBeInTheDocument();
  expect(
    screen.getByText('Informe um preço não negativo com até duas casas decimais.'),
  ).toBeInTheDocument();
  expect(request.mock.calls.some(([, o]) => o?.method === 'POST')).toBe(false);
});

test('não registra venda sem peças', async () => {
  const request = await openSale();
  expect(screen.getByRole('button', { name: 'Registrar venda' })).toBeDisabled();
  expect(request.mock.calls.some(([, o]) => o?.method === 'POST')).toBe(false);
});

test('permite remover uma peça antes de concluir e não duplica a mesma peça', async () => {
  await openSale();
  await addFilter();
  expect(screen.getByRole('button', { name: 'Adicionar Filtro à venda' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Remover Filtro da venda' }));
  expect(screen.queryByLabelText('Quantidade de Filtro')).not.toBeInTheDocument();
  expect(
    screen.getByText('Busque e adicione uma ou mais peças para compor a venda.'),
  ).toBeInTheDocument();
});

test('não permite adicionar peça inativa', async () => {
  await openSale({ parts: [{ ...PART, status: 'inactive' }] });
  fireEvent.change(screen.getByLabelText('Buscar peça por nome ou código'), {
    target: { value: 'Filtro' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  expect(await screen.findByRole('button', { name: 'Adicionar Filtro à venda' })).toBeDisabled();
});

test('informa quando a busca não encontra peças', async () => {
  await openSale({ parts: [] });
  fireEvent.change(screen.getByLabelText('Buscar peça por nome ou código'), {
    target: { value: 'Inexistente' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  expect(
    await screen.findByText('Nenhuma peça encontrada para “Inexistente”.'),
  ).toBeInTheDocument();
});

test('reenvia tentativa incerta com a mesma chave e bloqueia alterações', async () => {
  let calls = 0;
  const request = await openSale({
    post: async (url, options) => {
      if (++calls === 1) throw new TypeError('offline');
      return response(saleResponse(JSON.parse(options.body)), 201);
    },
  });
  await fillSale();
  fireEvent.click(screen.getByRole('button', { name: 'Registrar venda' }));
  expect(await screen.findByText(/A conexão foi interrompida/)).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade de Filtro')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Venda registrada. Total: R$ 76,50.');
  const keys = request.mock.calls
    .filter(([, o]) => o?.method === 'POST')
    .map(([, o]) => o.headers['Idempotency-Key']);
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
  await waitFor(() => expect(localStorage.length).toBe(0));
});

test('começa uma nova venda depois de registrar a anterior', async () => {
  await openSale();
  await fillSale();
  fireEvent.click(screen.getByRole('button', { name: 'Registrar venda' }));
  await screen.findByText('Venda registrada. Total: R$ 76,50.');
  fireEvent.click(screen.getByRole('button', { name: 'Nova venda' }));
  expect(
    await screen.findByText('Busque e adicione uma ou mais peças para compor a venda.'),
  ).toBeInTheDocument();
});
