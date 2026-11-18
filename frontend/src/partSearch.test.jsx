import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const PART = {
  id: 'part-1',
  manufacturer_code: '001-A/2',
  name: 'Filtro de óleo',
  category: 'Filtros',
  status: 'inactive',
  equivalent_codes: ['EQ-01'],
};
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openCatalog(search = async () => response({ items: [PART], total: 1 })) {
  const request = vi.fn(async (url, options) => {
    if (url.includes('/stock-balance')) return response({ part_id: PART.id, stock_balance: 5 });
    if (url.includes('/parts/search?')) return search(url, options);
    if (url.includes('vehicle-applications')) return response({ items: [], total: 0 });
    if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
    return response(PART);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  await screen.findByRole('button', { name: 'Aplicações de Filtro de óleo' });
  return request;
}

function enterFilter(label, value) {
  fireEvent.change(screen.getByRole('textbox', { name: label, exact: true }), {
    target: { value },
  });
}

test('envia os seis filtros somente ao buscar e mostra peças inativas', async () => {
  const request = await openCatalog();
  for (const [label, value] of [
    ['Código principal ou equivalente', ' 001-A/2 '],
    ['Nome', ' óleo '],
    ['Categoria', ' Filtros '],
    ['Marca', ' Fiat '],
    ['Modelo', ' Uno '],
    ['Ano', '2010'],
  ])
    enterFilter(label, value);
  expect(request.mock.calls.filter(([url]) => url.includes('/search?'))).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await waitFor(() =>
    expect(request.mock.calls.filter(([url]) => url.includes('/search?'))).toHaveLength(1),
  );
  const [url] = request.mock.calls.find(([url]) => url.includes('/search?'));
  expect(Object.fromEntries(new URL(url).searchParams)).toEqual({
    code: '001-A/2',
    name: 'óleo',
    category: 'Filtros',
    brand: 'Fiat',
    model: 'Uno',
    year: '2010',
    offset: '0',
    limit: '20',
  });
  expect(await screen.findByText('Inativo')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Editar Filtro de óleo' })).toBeInTheDocument();
});

test('bloqueia busca vazia ou somente espaços e identifica ano inválido sem requisição', async () => {
  const request = await openCatalog();
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  expect(screen.getByText('Informe ao menos um filtro para buscar peças.')).toBeInTheDocument();
  enterFilter('Nome', '   ');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  expect(screen.getByText('Informe ao menos um filtro para buscar peças.')).toBeInTheDocument();
  enterFilter('Ano', '2010-2012');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  expect(screen.getByText('Informe um único ano com quatro dígitos.')).toBeInTheDocument();
  expect(request.mock.calls.filter(([url]) => url.includes('/search?'))).toHaveLength(0);
});

test('informa ausência de correspondência sem apresentar as peças da consulta anterior', async () => {
  await openCatalog(async () => response({ items: [], total: 0 }));
  enterFilter('Nome', 'Inexistente');
  fireEvent.submit(screen.getByRole('form', { name: 'Buscar peças' }));
  expect(
    await screen.findByText('Nenhuma peça corresponde aos filtros informados.'),
  ).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Editar Filtro de óleo' })).not.toBeInTheDocument();
});

test('limpa os filtros e retorna ao catálogo geral sem busca vazia', async () => {
  const request = await openCatalog(async () => response({ items: [], total: 0 }));
  enterFilter('Código principal ou equivalente', 'EQ-01');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await screen.findByText('Nenhuma peça corresponde aos filtros informados.');
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  expect(screen.getByRole('textbox', { name: 'Código principal ou equivalente' })).toHaveValue('');
  expect(request.mock.calls.filter(([url]) => url.includes('/search?'))).toHaveLength(1);
  expect(
    request.mock.calls.filter(([url]) => url.endsWith('/parts?offset=0&limit=20')),
  ).toHaveLength(2);
});

test.each([
  ['Editar Filtro de óleo', 'Cancelar'],
  ['Aplicações de Filtro de óleo', 'Voltar ao catálogo'],
  ['Consultar saldo de Filtro de óleo', 'Voltar ao catálogo'],
])('preserva filtros e página ao abrir %s e voltar', async (action, back) => {
  const request = await openCatalog(async () => response({ items: [PART], total: 21 }));
  enterFilter('Nome', 'Filtro');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Próxima', exact: true })).toBeEnabled(),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Próxima', exact: true }));
  fireEvent.click(await screen.findByRole('button', { name: action }));
  fireEvent.click(await screen.findByRole('button', { name: back, exact: true }));
  await screen.findByRole('button', { name: action });
  expect(screen.getByRole('textbox', { name: 'Nome', exact: true })).toHaveValue('Filtro');
  expect(screen.getByText('21 peça(s) · Página 2')).toBeInTheDocument();
  expect(request.mock.calls.at(-1)[0]).toContain('/parts/search?name=Filtro&offset=20&limit=20');
});

test('pagina com os filtros aplicados e só aplica o rascunho ao buscar novamente', async () => {
  const request = await openCatalog(async () => response({ items: [PART], total: 21 }));
  enterFilter('Nome', 'Filtro');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Próxima', exact: true })).toBeEnabled(),
  );
  enterFilter('Nome', 'Pastilha');
  expect(screen.getByText('Filtros aplicados: Nome: Filtro')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Próxima', exact: true }));
  await screen.findByText('21 peça(s) · Página 2');
  expect(request.mock.calls.at(-1)[0]).toContain('name=Filtro&offset=20');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await screen.findByText('21 peça(s) · Página 1');
  expect(request.mock.calls.at(-1)[0]).toContain('name=Pastilha&offset=0');
});

test('preserva filtros após erro e repete a consulta que falhou', async () => {
  let fail = true;
  const request = await openCatalog(async () => {
    if (fail) throw new TypeError('offline');
    return response({ items: [PART], total: 1 });
  });
  enterFilter('Código principal ou equivalente', 'EQ-01');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await screen.findByText('Não foi possível carregar as peças. Tente novamente.');
  expect(screen.getByRole('textbox', { name: 'Código principal ou equivalente' })).toHaveValue(
    'EQ-01',
  );
  enterFilter('Nome', 'ainda não aplicado');
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('button', { name: 'Editar Filtro de óleo' });
  const calls = request.mock.calls.filter(([url]) => url.includes('/search?'));
  expect(calls).toHaveLength(2);
  expect(calls[1][0]).toBe(calls[0][0]);
});

test('aborta a busca anterior e ignora sua resposta atrasada', async () => {
  let finish;
  let signal;
  const newer = { ...PART, id: 'part-2', name: 'Pastilha' };
  await openCatalog((url, options) => {
    if (new URL(url).searchParams.get('name') === 'Filtro') {
      signal = options.signal;
      return new Promise((resolve) => {
        finish = resolve;
      });
    }
    return Promise.resolve(response({ items: [newer], total: 1 }));
  });
  enterFilter('Nome', 'Filtro');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  expect(screen.getByRole('progressbar', { name: 'Carregando catálogo' })).toBeInTheDocument();
  enterFilter('Nome', 'Pastilha');
  fireEvent.click(screen.getByRole('button', { name: 'Buscar', exact: true }));
  await screen.findByRole('button', { name: 'Editar Pastilha' });
  expect(signal.aborted).toBe(true);
  await act(async () => finish(response({ items: [PART], total: 1 })));
  expect(screen.queryByRole('button', { name: 'Editar Filtro de óleo' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Editar Pastilha' })).toBeInTheDocument();
});
