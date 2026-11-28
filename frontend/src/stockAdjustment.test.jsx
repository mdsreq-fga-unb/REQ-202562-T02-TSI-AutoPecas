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

async function openAdjustment(post, { part = PART, balance = 10 } = {}) {
  let current = balance;
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      if (post) return post(url, options);
      const data = JSON.parse(options.body);
      current += data.quantity_delta;
      return response(
        {
          ...data,
          id: 'adj-1',
          part_id: part.id,
          movement_type: 'adjustment',
          adjustment_date: '2026-11-28',
          stock_balance: current,
        },
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
  fireEvent.click(await screen.findByRole('button', { name: 'Registrar ajuste de Filtro' }));
  await screen.findByText(`Saldo atual: ${balance} unidades`);
  return request;
}

function fillAdjustment(delta = '+2', justification = 'Contagem física') {
  fireEvent.change(screen.getByLabelText('Diferença de quantidade'), {
    target: { value: delta },
  });
  fireEvent.change(screen.getByLabelText('Justificativa'), {
    target: { value: justification },
  });
}

const CONFIRMED_NEGATIVE = {
  id: 'adj-1',
  part_id: PART.id,
  movement_type: 'adjustment',
  quantity_delta: -3,
  adjustment_date: '2026-11-28',
  justification: 'Divergência de contagem',
  stock_balance: 7,
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

test('registra ajuste positivo e mostra o saldo confirmado', async () => {
  const request = await openAdjustment();
  fillAdjustment('+2', 'Peças encontradas na prateleira');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByText(
    'Ajuste registrado (+2 unidades). Saldo após este ajuste: 12 unidades. Justificativa: Peças encontradas na prateleira.',
  );
  const [url, options] = request.mock.calls.find(([, o]) => o.method === 'POST');
  expect(url).toMatch(/\/stock-adjustments$/);
  expect(JSON.parse(options.body)).toEqual({
    quantity_delta: 2,
    justification: 'Peças encontradas na prateleira',
  });
  expect(options.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
});

test('registra ajuste negativo subtraindo a diferença do saldo atual', async () => {
  const request = await openAdjustment();
  fillAdjustment('-3', 'Divergência de contagem');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByText(
    'Ajuste registrado (-3 unidades). Saldo após este ajuste: 7 unidades. Justificativa: Divergência de contagem.',
  );
  const [, options] = request.mock.calls.find(([, o]) => o.method === 'POST');
  expect(JSON.parse(options.body)).toEqual({
    quantity_delta: -3,
    justification: 'Divergência de contagem',
  });
});

test('apresenta erro de saldo negativo informado pela API e preserva os campos', async () => {
  await openAdjustment(async () =>
    response(
      {
        detail: {
          message: 'Ajuste resultaria em saldo negativo: há 10 unidades disponíveis.',
          fields: { quantity_delta: 'Informe uma diferença que não deixe o saldo negativo.' },
          stock_balance: 10,
        },
      },
      422,
    ),
  );
  fillAdjustment('-12', 'Falta no inventário');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  expect(
    await screen.findByText('Ajuste resultaria em saldo negativo: há 10 unidades disponíveis.'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Informe uma diferença que não deixe o saldo negativo.'),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Diferença de quantidade')).toHaveValue('-12');
  expect(screen.getByLabelText('Justificativa')).toHaveValue('Falta no inventário');
});

test('reenvia tentativa incerta com a mesma chave e bloqueia alterações', async () => {
  let calls = 0;
  const request = await openAdjustment(async () => {
    if (++calls === 1) throw new TypeError('offline');
    return response(CONFIRMED_NEGATIVE, 201);
  });
  fillAdjustment('-3', 'Divergência de contagem');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByText(/A conexão foi interrompida/);
  expect(screen.getByLabelText('Diferença de quantidade')).toBeDisabled();
  expect(screen.getByLabelText('Justificativa')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar à peça' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText(
    'Ajuste registrado (-3 unidades). Saldo após este ajuste: 7 unidades. Justificativa: Divergência de contagem.',
  );
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(posts[0][1].headers['Idempotency-Key']);
  expect(posts[1][1].body).toBe(posts[0][1].body);
});

test.each([
  ['rede interrompida', undefined],
  ['resposta vazia', {}],
  ['outra peça', { ...CONFIRMED_NEGATIVE, part_id: 'other' }],
  ['tipo divergente', { ...CONFIRMED_NEGATIVE, movement_type: 'exit' }],
  ['diferença divergente', { ...CONFIRMED_NEGATIVE, quantity_delta: -2 }],
  ['justificativa divergente', { ...CONFIRMED_NEGATIVE, justification: 'Outra' }],
  ['saldo negativo', { ...CONFIRMED_NEGATIVE, stock_balance: -1 }],
])('recupera ajuste após %s sem indicar sucesso nem reenviar automaticamente', async (_, body) => {
  let calls = 0;
  const request = await openAdjustment(async (_url, options) => {
    if (++calls === 1) {
      if (body === undefined) throw new TypeError('offline');
      return response(body, 201);
    }
    return response({ ...CONFIRMED_NEGATIVE, ...JSON.parse(options.body) }, 201);
  });
  fillAdjustment('-3', 'Divergência de contagem');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.queryByText(/Ajuste registrado/)).not.toBeInTheDocument();
  const original = request.mock.calls.find(([, o]) => o.method === 'POST')[1];
  cleanup();
  render(<App />);
  await screen.findByRole('heading', { name: 'Registrar ajuste de inventário' });
  await screen.findByText('Saldo atual: 10 unidades');
  expect(screen.getByLabelText('Diferença de quantidade')).toHaveValue('-3');
  expect(screen.getByLabelText('Diferença de quantidade')).toBeDisabled();
  expect(screen.getByLabelText('Justificativa')).toHaveValue('Divergência de contagem');
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText(
    'Ajuste registrado (-3 unidades). Saldo após este ajuste: 7 unidades. Justificativa: Divergência de contagem.',
  );
  const posts = request.mock.calls.filter(([, o]) => o.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[1][1].body).toBe(original.body);
  expect(posts[1][1].headers['Idempotency-Key']).toBe(original.headers['Idempotency-Key']);
});

test('não envia sem armazenamento e permite corrigir antes de tentar de novo', async () => {
  const request = await openAdjustment();
  fillAdjustment('+2', 'Contagem física');
  const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  expect(await screen.findByText(/Não foi possível preservar o ajuste/)).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  storage.mockRestore();
  fireEvent.change(screen.getByLabelText('Diferença de quantidade'), { target: { value: '+4' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByText(
    'Ajuste registrado (+4 unidades). Saldo após este ajuste: 14 unidades. Justificativa: Contagem física.',
  );
  expect(
    JSON.parse(request.mock.calls.find(([, o]) => o.method === 'POST')[1].body).quantity_delta,
  ).toBe(4);
});

test.each(['0', '1.5', '', 'abc'])(
  'impede diferença inválida antes de enviar: %s',
  async (value) => {
    const request = await openAdjustment();
    fillAdjustment(value, 'Contagem física');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
    expect(
      await screen.findByText('Informe uma diferença inteira diferente de zero (ex.: +2 ou -3).'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Diferença de quantidade')).toHaveFocus();
    expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
  },
);

test('impede justificativa apenas com espaços', async () => {
  const request = await openAdjustment();
  fillAdjustment('+2', '   ');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  expect(await screen.findByText('Informe a justificativa do ajuste.')).toBeInTheDocument();
  expect(screen.getByLabelText('Justificativa')).toHaveFocus();
  expect(request.mock.calls.filter(([, o]) => o.method === 'POST')).toHaveLength(0);
});

test('encerra o ajuste confirmado e consulta o saldo vigente', async () => {
  const request = await openAdjustment();
  fillAdjustment('-3', 'Divergência de contagem');
  request.mockResolvedValueOnce(response(CONFIRMED_NEGATIVE, 201));
  request.mockResolvedValueOnce(response({ part_id: PART.id, stock_balance: 6 }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar ajuste' }));
  await screen.findByText(
    'Ajuste registrado (-3 unidades). Saldo após este ajuste: 7 unidades. Justificativa: Divergência de contagem.',
  );
  expect(await screen.findByText('Saldo atual: 6 unidades')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Confirmar ajuste' })).not.toBeInTheDocument();
});

test('bloqueia ajuste nos detalhes de peça inativa', async () => {
  await openDetails({ ...PART, status: 'inactive' }, 5);
  const button = screen.getByRole('button', { name: 'Registrar ajuste de Filtro' });
  expect(button).toBeDisabled();
  expect(
    screen.getByText('Peça inativa. Ative-a em Dados cadastrais para registrar um ajuste.'),
  ).toBeInTheDocument();
});

test('permite ajuste quando o saldo é zero', async () => {
  await openDetails(PART, 0);
  expect(screen.getByRole('button', { name: 'Registrar ajuste de Filtro' })).toBeEnabled();
});
