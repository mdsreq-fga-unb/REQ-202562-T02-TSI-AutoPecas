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
async function openEntry(
  post = async () =>
    response(
      {
        id: 'entry-1',
        part_id: PART.id,
        quantity: 3,
        entry_date: '2026-01-01',
        unit_cost: '12.50',
        stock_balance: 8,
      },
      201,
    ),
) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') return post(url, options);
    if (url.includes('/stock-balance')) return response({ part_id: PART.id, stock_balance: 5 });
    if (url.includes('?')) return response({ items: [PART], total: 1 });
    return response(PART);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: 'Registrar entrada de Filtro' }));
  await screen.findByText('Saldo atual: 5 unidades');
  return request;
}
function fillEntry() {
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Data da entrada'), { target: { value: '2026-01-01' } });
  fireEvent.change(screen.getByLabelText('Custo unitário (R$)'), { target: { value: '12,50' } });
}
test('registra entrada e mostra o saldo confirmado', async () => {
  const request = await openEntry();
  fillEntry();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText('Entrada registrada. Saldo após esta entrada: 8 unidades.');
  const [, options] = request.mock.calls.find(([, o]) => o.method === 'POST');
  expect(JSON.parse(options.body)).toEqual({
    quantity: 3,
    entry_date: '2026-01-01',
    unit_cost: '12.50',
  });
  expect(options.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
});

test('apresenta rejeição da API no campo e preserva os dados', async () => {
  await openEntry(async () =>
    response(
      {
        detail: {
          message: 'Confira a quantidade.',
          fields: { quantity: 'Informe quantidade positiva.' },
        },
      },
      422,
    ),
  );
  fillEntry();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  expect(await screen.findByText('Informe quantidade positiva.')).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade')).toHaveValue('3');
});

test('reenvia tentativa incerta com a mesma chave e bloqueia alterações', async () => {
  let calls = 0;
  const request = await openEntry(async () => {
    if (++calls === 1) throw new TypeError('offline');
    return response(
      {
        id: 'entry-1',
        part_id: PART.id,
        quantity: 3,
        entry_date: '2026-01-01',
        unit_cost: '12.50',
        stock_balance: 8,
      },
      201,
    );
  });
  fillEntry();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText(/A conexão foi interrompida/);
  expect(screen.getByLabelText('Quantidade')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar ao catálogo' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Entrada registrada. Saldo após esta entrada: 8 unidades.');
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(posts[0][1].headers['Idempotency-Key']);
  expect(posts[1][1].body).toBe(posts[0][1].body);
});

test('recupera a entrada pendente após recarregar a aplicação', async () => {
  const request = await openEntry(async () => {
    throw new TypeError('offline');
  });
  fillEntry();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText(/A conexão foi interrompida/);
  const original = request.mock.calls.find(([, o]) => o.method === 'POST')[1];
  cleanup();
  render(<App />);
  await screen.findByRole('heading', { name: 'Registrar entrada' });
  await screen.findByText('Saldo atual: 5 unidades');
  expect(screen.getByLabelText('Quantidade')).toHaveValue('3');
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText(/A conexão foi interrompida/);
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].body).toBe(original.body);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(original.headers['Idempotency-Key']);
});

test('não envia sem armazenamento e permite corrigir a entrada antes de tentar de novo', async () => {
  const request = await openEntry();
  fillEntry();
  const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  expect(await screen.findByText(/Não foi possível preservar a entrada/)).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  storage.mockRestore();
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '4' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText('Entrada registrada. Saldo após esta entrada: 8 unidades.');
  expect(JSON.parse(request.mock.calls.find(([, o]) => o.method === 'POST')[1].body).quantity).toBe(
    4,
  );
});

test('impede quantidade zero antes de enviar e identifica o campo', async () => {
  const request = await openEntry();
  fillEntry();
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  expect(
    await screen.findByText('Informe uma quantidade inteira maior que zero.'),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Quantidade')).toHaveFocus();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede custo com mais de duas casas decimais', async () => {
  const request = await openEntry();
  fillEntry();
  fireEvent.change(screen.getByLabelText('Custo unitário (R$)'), { target: { value: '1,234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  expect(
    await screen.findByText('Informe um custo não negativo com até duas casas decimais.'),
  ).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede data ausente antes de enviar', async () => {
  const request = await openEntry();
  fillEntry();
  fireEvent.change(screen.getByLabelText('Data da entrada'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  expect(await screen.findByText('Informe uma data válida.')).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('impede data futura no calendário de São Paulo', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-01-02T01:00:00Z'));
  try {
    const request = await openEntry();
    fillEntry();
    fireEvent.change(screen.getByLabelText('Data da entrada'), { target: { value: '2026-01-02' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
    expect(
      await screen.findByText('Informe hoje ou uma data anterior, no horário de São Paulo.'),
    ).toBeInTheDocument();
    expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  } finally {
    vi.useRealTimers();
  }
});

test('encerra a entrada confirmada e consulta o saldo vigente', async () => {
  const request = await openEntry();
  fillEntry();
  request.mockResolvedValueOnce(
    response(
      {
        id: 'entry-1',
        part_id: PART.id,
        quantity: 3,
        entry_date: '2026-01-01',
        unit_cost: '12.50',
        stock_balance: 8,
      },
      201,
    ),
  );
  request.mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 10 }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText('Entrada registrada. Saldo após esta entrada: 8 unidades.');
  expect(await screen.findByText('Saldo atual: 10 unidades')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Confirmar entrada' })).not.toBeInTheDocument();
});

test('não oferece entrada para peça inativa no catálogo', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => response({ items: [{ ...PART, status: 'inactive' }], total: 1 })),
  );
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  expect(await screen.findByRole('button', { name: 'Registrar entrada de Filtro' })).toBeDisabled();
});
