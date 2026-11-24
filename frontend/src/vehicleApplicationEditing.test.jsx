import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const PART = {
  id: 'part-1',
  manufacturer_code: 'FLT-100',
  name: 'Filtro',
  category: 'Filtros',
  status: 'active',
  equivalent_codes: [],
};
const FIRST = { id: 'application-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2010' };
const SECOND = { id: 'application-2', part_id: PART.id, brand: 'Ford', model: 'Ka', year: '2015' };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openApplications(send = null, initialItems = [FIRST, SECOND]) {
  let items = initialItems.map((item) => ({ ...item }));
  const request = vi.fn(async (url, options) => {
    if (['PATCH', 'DELETE'].includes(options?.method)) {
      if (send) return send(url, options);
      if (options.method === 'PATCH') {
        items = items.map((a) => (a.id === FIRST.id ? { ...a, ...JSON.parse(options.body) } : a));
        return response(items.find((a) => a.id === FIRST.id));
      }
      items = items.filter((a) => a.id !== FIRST.id);
      return response(FIRST);
    }
    if (url.includes('/stock-balance')) return response({ part_id: PART.id, stock_balance: 5 });
    if (url.includes('vehicle-applications')) {
      const offset = Number(new URL(url, 'http://localhost').searchParams.get('offset') || 0);
      return response({ items: items.slice(offset, offset + 20), total: items.length });
    }
    if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
    return response(PART);
  });
  vi.stubGlobal('fetch', request);
  request.view = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver peça Filtro' }));
  await screen.findByRole('heading', { name: 'Aplicações cadastradas' });
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Associar veículo' })).toBeEnabled(),
  );
  return request;
}

test('CA05.5 corrige a aplicação selecionada e preserva as demais', async () => {
  const request = await openApplications();
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog', { name: 'Editar aplicação' });
  fireEvent.change(within(dialog).getByRole('textbox', { name: /^Ano/ }), {
    target: { value: '2012' },
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Salvar aplicação' }));
  await screen.findByText('Aplicação atualizada com sucesso.');
  expect(await screen.findByText('Fiat · Uno · 2012')).toBeInTheDocument();
  expect(screen.getByText('Ford · Ka · 2015')).toBeInTheDocument();
  const [url, options] = request.mock.calls.find(([, o]) => o?.method === 'PATCH');
  expect(url).toMatch(/parts\/part-1\/vehicle-applications\/application-1$/);
  expect(JSON.parse(options.body)).toEqual({ brand: 'Fiat', model: 'Uno', year: '2012' });
  expect(options.headers['Idempotency-Key']).toBeTruthy();
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test('CA05.7 confirma a remoção só do vínculo selecionado e permite desistir', async () => {
  const request = await openApplications();
  fireEvent.click(screen.getByRole('button', { name: 'Remover aplicação Fiat Uno 2010' }));
  let dialog = await screen.findByRole('dialog', { name: 'Remover aplicação?' });
  expect(request.mock.calls.filter(([, o]) => o?.method === 'DELETE')).toHaveLength(0);
  fireEvent.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('Fiat · Uno · 2010')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Remover aplicação Fiat Uno 2010' }));
  dialog = await screen.findByRole('dialog', { name: 'Remover aplicação?' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar remoção' }));
  await screen.findByText('Aplicação removida com sucesso.');
  await waitFor(() => expect(screen.queryByText('Fiat · Uno · 2010')).not.toBeInTheDocument());
  expect(screen.getByText('Ford · Ka · 2015')).toBeInTheDocument();
  const deletes = request.mock.calls.filter(([, o]) => o?.method === 'DELETE');
  expect(deletes).toHaveLength(1);
  expect(deletes[0][0]).toMatch(/vehicle-applications\/application-1$/);
  expect(deletes[0][1].headers['Idempotency-Key']).toBeTruthy();
});

test.each(['update', 'remove'])(
  'recupera %s após falha e recarga, mantendo o corpo e a chave',
  async (action) => {
    let attempts = 0;
    const request = await openApplications(async () => {
      if (++attempts === 1) throw new TypeError('offline');
      return response(action === 'update' ? { ...FIRST, year: '2012' } : FIRST);
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: `${action === 'update' ? 'Editar' : 'Remover'} aplicação Fiat Uno 2010`,
      }),
    );
    let dialog = await screen.findByRole('dialog');
    if (action === 'update')
      fireEvent.change(within(dialog).getByRole('textbox', { name: /^Ano/ }), {
        target: { value: '2012' },
      });
    fireEvent.click(
      within(dialog).getByRole('button', {
        name: action === 'update' ? 'Salvar aplicação' : 'Confirmar remoção',
      }),
    );
    await within(dialog).findByRole('button', { name: 'Tentar novamente' });
    expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    request.view.unmount();
    render(<App />);
    dialog = await screen.findByRole('dialog', {
      name: action === 'update' ? 'Editar aplicação' : 'Remover aplicação?',
    });
    expect(within(dialog).getByText(/dados foram recuperados/)).toBeInTheDocument();
    expect(attempts).toBe(1);
    if (action === 'update')
      expect(within(dialog).getByRole('textbox', { name: /^Ano/ })).toHaveValue('2012');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Tentar novamente' }));
    await screen.findByText(
      action === 'update' ? 'Aplicação atualizada com sucesso.' : 'Aplicação removida com sucesso.',
    );
    const writes = request.mock.calls.filter(([, o]) => ['PATCH', 'DELETE'].includes(o?.method));
    expect(writes).toHaveLength(2);
    expect(writes[1][0]).toBe(writes[0][0]);
    expect(writes[1][1].body).toBe(writes[0][1].body);
    expect(writes[1][1].headers['Idempotency-Key']).toBe(writes[0][1].headers['Idempotency-Key']);
  },
);

test.each([
  ['erro 503 sem corpo', null, 503],
  ['resposta vazia', {}, 200],
  ['outra aplicação', SECOND, 200],
])('mantém a tentativa incerta ao receber %s', async (_, body, status) => {
  const request = await openApplications(async () => response(body, status));
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Salvar aplicação' }));
  await within(dialog).findByRole('button', { name: 'Tentar novamente' });
  expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  expect(within(dialog).getByRole('textbox', { name: /^Marca/ })).toBeDisabled();
  expect(request.mock.calls.filter(([, o]) => o?.method === 'PATCH')).toHaveLength(1);
  expect(screen.queryByText('Aplicação atualizada com sucesso.')).not.toBeInTheDocument();
});

test('identifica campos e ano inválidos sem enviar a edição', async () => {
  const request = await openApplications();
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  fireEvent.change(within(dialog).getByRole('textbox', { name: /^Marca/ }), {
    target: { value: ' ' },
  });
  fireEvent.change(within(dialog).getByRole('textbox', { name: /^Ano/ }), {
    target: { value: '2010-2012' },
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Salvar aplicação' }));
  expect(within(dialog).getByText('Preencha este campo.')).toBeInTheDocument();
  expect(within(dialog).getByText('Informe um único ano com quatro dígitos.')).toBeInTheDocument();
  expect(request.mock.calls.filter(([, o]) => o?.method === 'PATCH')).toHaveLength(0);
});

test('mantém os campos editáveis após rejeição de duplicidade', async () => {
  await openApplications(async () =>
    response({ detail: { message: 'Aplicação repetida nesta peça.' } }, 409),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Salvar aplicação' }));
  await within(dialog).findByText('Aplicação repetida nesta peça.');
  expect(within(dialog).getByRole('textbox', { name: /^Marca/ })).toBeEnabled();
  expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeEnabled();
  expect(within(dialog).getByRole('textbox', { name: /^Ano/ })).toHaveValue('2010');
});

test('não envia quando o armazenamento da alteração está indisponível', async () => {
  const request = await openApplications();
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Salvar aplicação' }));
  await within(dialog).findByText(/Não foi possível preservar a alteração/);
  expect(request.mock.calls.filter(([, o]) => o?.method === 'PATCH')).toHaveLength(0);
  expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeEnabled();
});

test('bloqueia envio duplo e mantém o diálogo aberto durante a gravação', async () => {
  let finish;
  const request = await openApplications(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Editar aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  const save = within(dialog).getByRole('button', { name: 'Salvar aplicação' });
  fireEvent.click(save);
  fireEvent.click(save);
  expect(request.mock.calls.filter(([, o]) => o?.method === 'PATCH')).toHaveLength(1);
  expect(within(dialog).getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  finish(response(FIRST));
  await screen.findByText('Aplicação atualizada com sucesso.');
});

test('retorna à página anterior ao remover o último vínculo da última página', async () => {
  const others = Array.from({ length: 20 }, (_, i) => ({
    ...SECOND,
    id: `other-${i}`,
    model: `Modelo ${i}`,
  }));
  const request = await openApplications(null, [...others, FIRST]);
  fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
  await screen.findByText('Fiat · Uno · 2010');
  fireEvent.click(screen.getByRole('button', { name: 'Remover aplicação Fiat Uno 2010' }));
  const dialog = await screen.findByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar remoção' }));
  await screen.findByText(/1–20 de 20/);
  expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
  expect(request.mock.calls.filter(([, o]) => o?.method === 'DELETE')).toHaveLength(1);
});
