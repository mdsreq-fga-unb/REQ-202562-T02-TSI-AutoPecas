import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const response = (data, status = 201) => ({ ok: status < 400, status, json: async () => data });
const file = () =>
  new File(['xlsx bytes'], 'pecas.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openImport(send = async () => response({ imported_count: 2 })) {
  const request = vi.fn(async (url, options) =>
    options.method === 'POST' ? send(url, options) : response({ items: [], total: 0 }, 200),
  );
  vi.stubGlobal('fetch', request);
  const view = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: 'Importar planilha' }));
  return { request, ...view };
}

test('importa um arquivo e informa a quantidade cadastrada, com acesso ao modelo', async () => {
  const { request } = await openImport();
  expect(screen.getByRole('link', { name: 'Baixar modelo .xlsx' })).toHaveAttribute(
    'href',
    expect.stringContaining('/part-imports/template'),
  );
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
  await screen.findByText('pecas.xlsx');
  fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
  expect(await screen.findByRole('status')).toHaveTextContent('2 peças importadas');
  const writes = request.mock.calls.filter(([, options]) => options.method === 'POST');
  expect(writes).toHaveLength(1);
  expect(writes[0][0]).toMatch(/\/part-imports$/);
  expect(JSON.parse(writes[0][1].body)).toEqual({
    filename: 'pecas.xlsx',
    content: btoa('xlsx bytes'),
  });
  expect(writes[0][1].headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
  fireEvent.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }));
  expect(await screen.findByRole('heading', { name: 'Catálogo de peças' })).toBeInTheDocument();
});

test('exibe linhas e motivos da rejeição e permite selecionar arquivo corrigido', async () => {
  let calls = 0;
  const { request } = await openImport(async () =>
    ++calls === 1
      ? response(
          {
            detail: {
              message: 'Lote rejeitado. Nenhuma peça foi cadastrada.',
              issues: [
                { row: 3, message: 'Código repetido no arquivo: A.' },
                { row: 8, message: 'Nome obrigatório.' },
              ],
            },
          },
          422,
        )
      : response({ imported_count: 1 }),
  );
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
  await screen.findByText('pecas.xlsx');
  fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
  expect(await screen.findByText('Linha 3: Código repetido no arquivo: A.')).toBeInTheDocument();
  expect(screen.getByText('Linha 8: Nome obrigatório.')).toBeInTheDocument();
  expect(screen.getByLabelText('Planilha .xlsx')).toBeEnabled();
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), {
    target: { files: [new File(['corrected'], 'corrigida.xlsx')] },
  });
  await screen.findByText('corrigida.xlsx');
  fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
  await screen.findByRole('status');
  const writes = request.mock.calls.filter(([, options]) => options.method === 'POST');
  expect(writes[0][1].headers['Idempotency-Key']).not.toBe(writes[1][1].headers['Idempotency-Key']);
});

test.each(['csv', 'large'])(
  'impede arquivo incompatível ou grande sem enviar: %s',
  async (kind) => {
    const { request } = await openImport();
    const upload =
      kind === 'csv'
        ? new File(['csv'], 'pecas.csv')
        : new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'grande.xlsx');
    fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [upload] } });
    expect(await screen.findByRole('alert')).toHaveTextContent(kind === 'csv' ? '.xlsx' : '2 MiB');
    expect(screen.getByRole('button', { name: 'Importar peças' })).toBeDisabled();
    expect(request.mock.calls.filter(([, options]) => options.method === 'POST')).toHaveLength(0);
  },
);

test('recupera tentativa incerta após recarregar e reenvia exatamente o mesmo arquivo e chave', async () => {
  let writes = 0;
  const { request, unmount } = await openImport(async () => {
    if (++writes === 1) throw new TypeError('offline');
    return response({ imported_count: 2 });
  });
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
  await screen.findByText('pecas.xlsx');
  fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
  await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.getByLabelText('Planilha .xlsx')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar ao catálogo' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Catálogo', exact: true })).toBeDisabled();
  unmount();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Importar peças' })).toBeInTheDocument();
  expect(screen.getByText('pecas.xlsx')).toBeInTheDocument();
  expect(writes).toBe(1);
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('status');
  const sent = request.mock.calls.filter(([, options]) => options.method === 'POST');
  expect(sent).toHaveLength(2);
  expect(sent[1][1].body).toBe(sent[0][1].body);
  expect(sent[1][1].headers['Idempotency-Key']).toBe(sent[0][1].headers['Idempotency-Key']);
  expect(
    Object.keys(localStorage).filter((key) => key.startsWith('tsi:part-import:')),
  ).toHaveLength(0);
});

test('não envia se não puder preservar a tentativa no navegador', async () => {
  const { request } = await openImport();
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
  await screen.findByText('pecas.xlsx');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível preservar');
  expect(request.mock.calls.filter(([, options]) => options.method === 'POST')).toHaveLength(0);
});

test.each(['503', 'invalid-json', 'unconfirmed', 'empty-error'])(
  'preserva tentativa quando a resposta não confirma o resultado: %s',
  async (kind) => {
    await openImport(async () =>
      kind === 'empty-error'
        ? response(null, 503)
        : kind === '503'
          ? response({ detail: { message: 'Não foi possível confirmar a operação.' } }, 503)
          : kind === 'invalid-json'
            ? {
                ok: true,
                status: 201,
                json: async () => {
                  throw new Error('json');
                },
              }
            : response({ imported_count: 0 }),
    );
    fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
    await screen.findByText('pecas.xlsx');
    fireEvent.click(screen.getByRole('button', { name: 'Importar peças' }));
    await screen.findByRole('button', { name: 'Tentar novamente' });
    expect(screen.getByLabelText('Planilha .xlsx')).toBeDisabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  },
);

test('bloqueia duplo envio enquanto aguarda a confirmação', async () => {
  let finish;
  const { request } = await openImport(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fireEvent.change(screen.getByLabelText('Planilha .xlsx'), { target: { files: [file()] } });
  await screen.findByText('pecas.xlsx');
  const button = screen.getByRole('button', { name: 'Importar peças' });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(button).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar ao catálogo' })).toBeDisabled();
  expect(request.mock.calls.filter(([, options]) => options.method === 'POST')).toHaveLength(1);
  finish(response({ imported_count: 1 }));
  await screen.findByRole('status');
});
