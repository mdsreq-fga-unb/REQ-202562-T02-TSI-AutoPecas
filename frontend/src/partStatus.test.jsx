import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const PART = {
  id: 'part-1',
  manufacturer_code: 'FLT-100',
  name: 'Filtro de óleo',
  category: 'Filtros',
  status: 'active',
  equivalent_codes: ['EQ-1'],
  physical_location: 'A2',
  technical_description: 'Original',
  photo_url: null,
};
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
afterEach(() => vi.unstubAllGlobals());

async function openCatalog(
  save = async (_url, options) => response({ ...PART, ...JSON.parse(options.body) }),
) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'PATCH') return save(url, options);
    if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
    return response(PART);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  return request;
}

test('inativa e reativa a peça enviando apenas o status e mantendo o cadastro visível', async () => {
  const request = await openCatalog();
  expect(screen.getByText('Ativo', { exact: true })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Inativar Filtro de óleo' }));
  const dialog = await screen.findByRole('dialog', { name: 'Inativar peça?' });
  expect(within(dialog).getByText(/FLT-100/)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar inativação' }));
  await screen.findByText('Peça inativada com sucesso.');
  expect(screen.getByText('Inativo', { exact: true })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Editar Filtro de óleo' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Ativar Filtro de óleo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Confirmar ativação' }));
  await screen.findByText('Peça ativada com sucesso.');
  const writes = request.mock.calls.filter(([, options]) => options?.method === 'PATCH');
  expect(writes.map(([, options]) => JSON.parse(options.body))).toEqual([
    { status: 'inactive' },
    { status: 'active' },
  ]);
  expect(writes[0][0]).toMatch(/\/parts\/part-1$/);
  expect(writes[0][1].headers['Idempotency-Key']).not.toBe(writes[1][1].headers['Idempotency-Key']);
});

test('cancelar a confirmação mantém o status e não envia alterações', async () => {
  const request = await openCatalog();
  fireEvent.click(screen.getByRole('button', { name: 'Inativar Filtro de óleo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Cancelar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('Ativo', { exact: true })).toBeInTheDocument();
  expect(request.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
});

test('preserva a tentativa incerta e repete a mesma chave sem inverter o status novamente', async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new TypeError('offline'))
    .mockResolvedValueOnce(response({ ...PART, status: 'inactive' }));
  await openCatalog(save);
  fireEvent.click(screen.getByRole('button', { name: 'Inativar Filtro de óleo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Confirmar inativação' }));
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  fireEvent.click(retry);
  await screen.findByText('Peça inativada com sucesso.');
  expect(save.mock.calls[0][1].body).toBe(save.mock.calls[1][1].body);
  expect(save.mock.calls[0][1].headers['Idempotency-Key']).toBe(
    save.mock.calls[1][1].headers['Idempotency-Key'],
  );
});

test('falha definitiva mantém o status e permite cancelar a tentativa', async () => {
  await openCatalog(async () => response({ detail: { message: 'Peça não encontrada.' } }, 404));
  fireEvent.click(screen.getByRole('button', { name: 'Inativar Filtro de óleo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Confirmar inativação' }));
  await screen.findByText('Peça não encontrada.');
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('Ativo', { exact: true })).toBeInTheDocument();
});

test('bloqueia envio duplo e fechamento enquanto aguarda confirmação da API', async () => {
  let finishSave;
  const save = vi.fn(
    () =>
      new Promise((resolve) => {
        finishSave = resolve;
      }),
  );
  await openCatalog(save);
  fireEvent.click(screen.getByRole('button', { name: 'Inativar Filtro de óleo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Confirmar inativação' }));
  const saving = screen.getByRole('button', { name: 'Salvando…' });
  expect(saving).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  fireEvent.click(saving);
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(save).toHaveBeenCalledTimes(1);
  finishSave(response({ ...PART, status: 'inactive' }));
  await screen.findByText('Peça inativada com sucesso.');
});
