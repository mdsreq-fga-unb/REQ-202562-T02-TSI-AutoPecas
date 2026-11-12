import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  photo_url: '/parts/part-1/photo',
  updated_at: '2026-11-12T12:00:00Z',
};
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });

afterEach(() => vi.unstubAllGlobals());

async function openEdit(save = async () => response(PART), part = PART) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'PATCH') return save(url, options);
    if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
    return response(part);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Editar Filtro de óleo' }));
  await screen.findByDisplayValue('FLT-100');
  return request;
}

test('edita a mesma peça com código somente leitura e preserva foto sem reenviá-la', async () => {
  const request = await openEdit(async () => response({ ...PART, name: 'Filtro atualizado' }));
  expect(screen.getByRole('textbox', { name: /Código do fabricante/ })).toHaveAttribute('readonly');
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Filtro atualizado' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  expect(await screen.findByText('Peça atualizada com sucesso')).toBeInTheDocument();
  const [url, options] = request.mock.calls.find(([, options]) => options?.method === 'PATCH');
  expect(url).toMatch(/\/parts\/part-1$/);
  expect(JSON.parse(options.body)).toEqual({
    name: 'Filtro atualizado',
  });
  expect(JSON.parse(options.body)).not.toHaveProperty('manufacturer_code');
  expect(JSON.parse(options.body)).not.toHaveProperty('photo_data');
});

test('preserva equivalentes com separadores quando outro campo é editado', async () => {
  const request = await openEdit(undefined, { ...PART, equivalent_codes: ['ACME;01', 'ACME,02'] });
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Novo nome' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  await screen.findByText('Peça atualizada com sucesso');
  const [, options] = request.mock.calls.find(([, options]) => options?.method === 'PATCH');
  expect(JSON.parse(options.body)).toEqual({ name: 'Novo nome' });
});

test('não envia uma edição vazia quando o usuário desfaz as mudanças', async () => {
  const request = await openEdit();
  expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeDisabled();
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Outro nome' },
  });
  expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeEnabled();
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: PART.name },
  });
  expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  expect(request.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
});

test('valida os obrigatórios e códigos repetidos antes de enviar a edição', async () => {
  const request = await openEdit();
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: ' ' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Categoria/ }), { target: { value: '' } });
  fireEvent.change(screen.getByRole('textbox', { name: /Códigos equivalentes/ }), {
    target: { value: 'FLT-100' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  expect(screen.getAllByText('Preencha este campo.')).toHaveLength(2);
  expect(
    screen.getByText('Não repita o código principal nem os códigos equivalentes.'),
  ).toBeInTheDocument();
  expect(request.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
});

test('repete a mesma tentativa após falha de rede sem perder os dados', async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new TypeError('offline'))
    .mockResolvedValueOnce(response(PART));
  await openEdit(save);
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Atualizado' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Atualizado');
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toBeDisabled();
  fireEvent.click(retry);
  await screen.findByText('Peça atualizada com sucesso');
  expect(save.mock.calls[0][1].body).toBe(save.mock.calls[1][1].body);
  expect(save.mock.calls[0][1].headers['Idempotency-Key']).toBe(
    save.mock.calls[1][1].headers['Idempotency-Key'],
  );
});

test('remove a foto explicitamente e permite corrigir conflito sem perder o formulário', async () => {
  const save = vi
    .fn()
    .mockResolvedValueOnce(response({ detail: { message: 'Código já utilizado.' } }, 409))
    .mockResolvedValueOnce(response(PART));
  await openEdit(save);
  fireEvent.click(screen.getByRole('button', { name: 'Remover foto' }));
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  await screen.findByText('Código já utilizado.');
  expect(JSON.parse(save.mock.calls[0][1].body).photo_data).toBeNull();
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toBeEnabled();
  fireEvent.change(screen.getByRole('textbox', { name: /Códigos equivalentes/ }), {
    target: { value: 'NEW' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  await screen.findByText('Peça atualizada com sucesso');
  expect(save.mock.calls[0][1].headers['Idempotency-Key']).not.toBe(
    save.mock.calls[1][1].headers['Idempotency-Key'],
  );
});

test('solicita confirmação ao descartar uma edição e mantém os dados ao continuar', async () => {
  await openEdit();
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Rascunho' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await screen.findByRole('dialog', { name: 'Descartar alterações?' });
  fireEvent.click(screen.getByRole('button', { name: 'Continuar editando' }));
  expect(await screen.findByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Rascunho');
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Descartar alterações' }));
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).not.toBeInTheDocument(),
  );
});

test('protege o cadastro preenchido ao navegar para o catálogo', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => response({ items: [], total: 0 })),
  );
  render(<App />);
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Rascunho novo' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  await screen.findByRole('dialog', { name: 'Descartar alterações?' });
  fireEvent.click(screen.getByRole('button', { name: 'Continuar editando' }));
  expect(await screen.findByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Rascunho novo');
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Descartar alterações' }));
  await screen.findByText('Nenhuma peça cadastrada.');
});

test('mostra carregamento, permite repetir a consulta e pagina o catálogo', async () => {
  let resolveFirst;
  const request = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
    )
    .mockResolvedValueOnce(response({ items: [PART], total: 21 }))
    .mockResolvedValueOnce(
      response({ items: [{ ...PART, id: 'last', name: 'Última peça' }], total: 21 }),
    );
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  expect(screen.getByRole('progressbar', { name: 'Carregando catálogo' })).toBeInTheDocument();
  resolveFirst(response({ detail: { message: 'Serviço indisponível.' } }, 503));
  await screen.findByText('Serviço indisponível.');
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  await screen.findByRole('button', { name: 'Editar Última peça' });
  expect(request.mock.calls[2][0]).toContain('offset=20&limit=20');
  expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
});

test('permite voltar ao catálogo quando a peça não pode ser carregada', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) =>
      url.includes('?offset=')
        ? response({ items: [PART], total: 1 })
        : response({ detail: { message: 'Peça não encontrada.' } }, 404),
    ),
  );
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Editar Filtro de óleo' }));
  await screen.findByText('Peça não encontrada.');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
});

test('permite sair durante o carregamento e cancela a consulta pendente', async () => {
  let pendingSignal;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, options) => {
      if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
      pendingSignal = options.signal;
      return new Promise(() => {});
    }),
  );
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Editar Filtro de óleo' }));
  expect(screen.getByRole('progressbar', { name: 'Carregando peça' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  expect(pendingSignal.aborted).toBe(true);
});

test('envia a foto selecionada na edição e bloqueia envios enquanto salva', async () => {
  let finishSave;
  const save = vi.fn(
    () =>
      new Promise((resolve) => {
        finishSave = resolve;
      }),
  );
  await openEdit(save);
  const file = new File(['foto de teste'], 'peca.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('Foto da peça'), { target: { files: [file] } });
  await screen.findByText('peca.png');
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  const saving = screen.getByRole('button', { name: 'Salvando…' });
  expect(saving).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  fireEvent.click(saving);
  expect(save).toHaveBeenCalledTimes(1);
  expect(JSON.parse(save.mock.calls[0][1].body).photo_data).toMatch(/^data:image\/png;base64,/);
  finishSave(response(PART));
  await screen.findByText('Peça atualizada com sucesso');
});
