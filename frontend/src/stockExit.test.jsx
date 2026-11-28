import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});
async function openExit(post, { part = PART, balance = 5 } = {}) {
  let current = balance;
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      if (post) return post(url, options);
      const data = JSON.parse(options.body);
      current -= data.quantity;
      return response(
        { ...data, id: 'exit-1', part_id: part.id, movement_type: 'exit', stock_balance: current },
        201,
      );
    }
    if (url.includes('/stock-balance'))
      return response({ part_id: part.id, stock_balance: current });
    if (url.includes('/vehicle-applications')) return response({ items: [], total: 0 });
    if (url.includes('?')) return response({ items: [part], total: 1 });
    return response(part);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver peça Filtro' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Registrar saída de Filtro' }));
  await screen.findByText(`Saldo atual: ${balance} unidades`);
  return request;
}
function fillExit() {
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Data da saída'), { target: { value: '2026-01-01' } });
  fireEvent.change(screen.getByLabelText('Motivo'), { target: { value: 'Descarte' } });
}

const CONFIRMED = {
  id: 'exit-1',
  part_id: PART.id,
  movement_type: 'exit',
  quantity: 3,
  exit_date: '2026-01-01',
  reason: 'Descarte',
  stock_balance: 2,
};
async function openDetails(part, balance) {
  const request = vi.fn(async (url) => {
    if (url.includes('/vehicle-applications')) return response({ items: [], total: 0 });
    if (url.includes('/stock-balance'))
      return response({ part_id: part.id, stock_balance: balance });
    if (url.includes('?')) return response({ items: [part], total: 1 });
    return response(part);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver peça Filtro' }));
  await screen.findByText(`Saldo atual: ${balance} unidades`);
  return request;
}

test('registra saída e mostra o saldo confirmado', async () => {
  const request = await openExit();
  fillExit();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 2 unidades. Motivo: Descarte.');
  const [url, options] = request.mock.calls.find(([, o]) => o.method === 'POST');
  expect(url).toMatch(/\/stock-exits$/);
  expect(JSON.parse(options.body)).toEqual({
    quantity: 3,
    exit_date: '2026-01-01',
    reason: 'Descarte',
  });
  expect(options.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
});

test('apresenta saldo insuficiente informado pela API e preserva os campos', async () => {
  await openExit(async () =>
    response(
      {
        detail: {
          message: 'Saldo insuficiente: há 5 unidades disponíveis.',
          fields: { quantity: 'Informe no máximo o saldo disponível.' },
          stock_balance: 5,
        },
      },
      422,
    ),
  );
  fillExit();
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '9' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  expect(
    await screen.findByText('Saldo insuficiente: há 5 unidades disponíveis.'),
  ).toBeInTheDocument();
  expect(screen.getByText('Informe no máximo o saldo disponível.')).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade')).toHaveValue('9');
  expect(screen.getByLabelText('Motivo')).toHaveValue('Descarte');
});

test('reenvia tentativa incerta com a mesma chave e bloqueia alterações', async () => {
  let calls = 0;
  const request = await openExit(async () => {
    if (++calls === 1) throw new TypeError('offline');
    return response(CONFIRMED, 201);
  });
  fillExit();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByText(/A conexão foi interrompida/);
  expect(screen.getByLabelText('Quantidade')).toBeDisabled();
  expect(screen.getByLabelText('Motivo')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar à peça' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 2 unidades. Motivo: Descarte.');
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(posts[0][1].headers['Idempotency-Key']);
  expect(posts[1][1].body).toBe(posts[0][1].body);
});

test.each([
  ['rede interrompida', undefined],
  ['resposta vazia', {}],
  ['outra peça', { ...CONFIRMED, part_id: 'other' }],
  ['tipo divergente', { ...CONFIRMED, movement_type: 'entry' }],
  ['motivo divergente', { ...CONFIRMED, reason: 'Outro' }],
  ['saldo negativo', { ...CONFIRMED, stock_balance: -1 }],
])('recupera saída após %s sem indicar sucesso nem reenviar automaticamente', async (_, body) => {
  let calls = 0;
  const request = await openExit(async (_url, options) => {
    if (++calls === 1) {
      if (body === undefined) throw new TypeError('offline');
      return response(body, 201);
    }
    return response({ ...CONFIRMED, ...JSON.parse(options.body) }, 201);
  });
  fillExit();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.queryByText(/Saída registrada/)).not.toBeInTheDocument();
  const original = request.mock.calls.find(([, o]) => o.method === 'POST')[1];
  cleanup();
  render(<App />);
  await screen.findByRole('heading', { name: 'Registrar saída' });
  await screen.findByText('Saldo atual: 5 unidades');
  expect(screen.getByLabelText('Quantidade')).toHaveValue('3');
  expect(screen.getByLabelText('Quantidade')).toBeDisabled();
  expect(screen.getByLabelText('Motivo')).toHaveValue('Descarte');
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 2 unidades. Motivo: Descarte.');
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].body).toBe(original.body);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(original.headers['Idempotency-Key']);
});

test('não envia sem armazenamento e permite corrigir antes de tentar de novo', async () => {
  const request = await openExit();
  fillExit();
  const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  expect(await screen.findByText(/Não foi possível preservar a saída/)).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  storage.mockRestore();
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 3 unidades. Motivo: Descarte.');
  expect(JSON.parse(request.mock.calls.find(([, o]) => o.method === 'POST')[1].body).quantity).toBe(
    2,
  );
});

test('impede quantidade zero antes de enviar', async () => {
  const request = await openExit();
  fillExit();
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  expect(
    await screen.findByText('Informe uma quantidade inteira maior que zero.'),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade')).toHaveFocus();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede motivo apenas com espaços', async () => {
  const request = await openExit();
  fillExit();
  fireEvent.change(screen.getByLabelText('Motivo'), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  expect(await screen.findByText('Informe o motivo da saída.')).toBeInTheDocument();
  expect(screen.getByLabelText('Motivo')).toHaveFocus();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede data ausente', async () => {
  const request = await openExit();
  fillExit();
  fireEvent.change(screen.getByLabelText('Data da saída'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  expect(await screen.findByText('Informe uma data válida.')).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede data futura no calendário de São Paulo', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-01-02T01:00:00Z'));
  try {
    const request = await openExit();
    fillExit();
    fireEvent.change(screen.getByLabelText('Data da saída'), { target: { value: '2026-01-02' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
    expect(
      await screen.findByText('Informe hoje ou uma data anterior, no horário de São Paulo.'),
    ).toBeInTheDocument();
    expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  } finally {
    vi.useRealTimers();
  }
});

test('encerra a saída confirmada e consulta o saldo vigente', async () => {
  const request = await openExit();
  fillExit();
  request.mockResolvedValueOnce(response(CONFIRMED, 201));
  request.mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 1 }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 2 unidades. Motivo: Descarte.');
  expect(await screen.findByText('Saldo atual: 1 unidades')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Confirmar saída' })).not.toBeInTheDocument();
});

test('bloqueia saída nos detalhes de peça inativa', async () => {
  await openDetails({ ...PART, status: 'inactive' }, 5);
  const button = screen.getByRole('button', { name: 'Registrar saída de Filtro' });
  expect(button).toBeDisabled();
  expect(
    screen.getByText('Peça inativa. Ative-a em Dados cadastrais para registrar uma saída.'),
  ).toBeInTheDocument();
});

test('bloqueia saída quando o saldo é zero', async () => {
  await openDetails(PART, 0);
  const button = screen.getByRole('button', { name: 'Registrar saída de Filtro' });
  expect(button).toBeDisabled();
  expect(screen.getByText('Nenhuma unidade disponível para saída.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Registrar entrada de Filtro' })).toBeEnabled();
});

test('não envia dados de venda na saída', async () => {
  const request = await openExit();
  fillExit();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar saída' }));
  await screen.findByText('Saída registrada. Saldo após esta saída: 2 unidades. Motivo: Descarte.');
  const [url, options] = request.mock.calls.find(([, o]) => o.method === 'POST');
  expect(url).toMatch(/\/parts\/part-1\/stock-exits$/);
  const body = JSON.parse(options.body);
  expect(body).not.toHaveProperty('channel');
  expect(body).not.toHaveProperty('unit_price');
  expect(body).not.toHaveProperty('total');
  expect(request.mock.calls.some(([u]) => String(u).includes('/sales'))).toBe(false);
});
