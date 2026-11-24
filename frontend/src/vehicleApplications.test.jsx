import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';
import VehicleApplicationsSection from './features/parts/VehicleApplicationsSection.jsx';

const PART = {
  id: 'part-1',
  manufacturer_code: 'FLT-100',
  name: 'Filtro',
  category: 'Filtros',
  status: 'active',
  equivalent_codes: [],
};
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

async function openApplications(
  send = async () =>
    response({ id: 'app-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2010' }, 201),
) {
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') return send(url, options);
    if (url.includes('/stock-balance')) return response({ part_id: PART.id, stock_balance: 5 });
    if (url.includes('vehicle-applications')) return response({ items: [], total: 0 });
    if (url.includes('?offset=')) return response({ items: [PART], total: 1 });
    return response(PART);
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Ver peça Filtro' }));
  await screen.findByRole('heading', { name: 'Aplicações por veículo' });
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Associar veículo' })).toBeEnabled(),
  );
  return request;
}

function fillApplication() {
  for (const [name, value] of [
    ['Marca', 'Fiat'],
    ['Modelo', 'Uno'],
    ['Ano', '2010'],
  ]) {
    fireEvent.change(screen.getByRole('textbox', { name: new RegExp(`^${name}`) }), {
      target: { value },
    });
  }
}

test('abre as aplicações da peça e associa um veículo', async () => {
  const request = await openApplications();
  fillApplication();
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  expect(await screen.findByText('Aplicação associada com sucesso.')).toBeInTheDocument();
  expect(screen.getByText('Fiat · Uno · 2010')).toBeInTheDocument();
  const [url, options] = request.mock.calls.find(([, options]) => options?.method === 'POST');
  expect(url).toMatch(/\/parts\/part-1\/vehicle-applications$/);
  expect(JSON.parse(options.body)).toEqual({ brand: 'Fiat', model: 'Uno', year: '2010' });
});

test('identifica obrigatórios e formato do ano antes de enviar', async () => {
  const request = await openApplications();
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  expect(screen.getAllByText('Preencha este campo.')).toHaveLength(3);
  fillApplication();
  fireEvent.change(screen.getByRole('textbox', { name: /^Ano/ }), {
    target: { value: '2010-2012' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  expect(screen.getByText('Informe um único ano com quatro dígitos.')).toBeInTheDocument();
  expect(request.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(0);
});

test('mostra a aplicação existente e permite corrigir sem perder os campos', async () => {
  await openApplications(async () =>
    response(
      {
        detail: {
          message: 'A aplicação Fiat · Uno · 2010 já está vinculada a esta peça.',
          existing_application: { id: 'existing', brand: 'Fiat', model: 'Uno', year: '2010' },
        },
      },
      409,
    ),
  );
  fillApplication();
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  expect(
    await screen.findByText('A aplicação Fiat · Uno · 2010 já está vinculada a esta peça.'),
  ).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /^Modelo/ })).toHaveValue('Uno');
  expect(screen.getByRole('textbox', { name: /^Ano/ })).toBeEnabled();
});

test('repete a tentativa incerta com a mesma chave e bloqueia alterações', async () => {
  let calls = 0;
  const request = await openApplications(async () => {
    if (++calls === 1) throw new TypeError('offline');
    return response(
      { id: 'app-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2010' },
      201,
    );
  });
  fillApplication();
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.getByRole('textbox', { name: /^Marca/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Voltar ao catálogo' })).toBeDisabled();
  fireEvent.click(retry);
  await screen.findByText('Aplicação associada com sucesso.');
  const posts = request.mock.calls.filter(([, options]) => options?.method === 'POST');
  expect(posts).toHaveLength(2);
  expect(posts[0][1].headers['Idempotency-Key']).toBe(posts[1][1].headers['Idempotency-Key']);
  expect(posts[0][1].body).toBe(posts[1][1].body);
});

test('envia somente uma associação durante cliques repetidos', async () => {
  let finish;
  const request = await openApplications(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fillApplication();
  const button = screen.getByRole('button', { name: 'Associar veículo' });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(request.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  expect(button).toBeDisabled();
  await act(async () =>
    finish(
      response({ id: 'app-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2010' }, 201),
    ),
  );
});

test.each([
  ['rede interrompida', undefined],
  ['resposta vazia', {}],
  ['resposta nula', null],
  ['outra peça', { id: 'app-1', part_id: 'other', brand: 'Fiat', model: 'Uno', year: '2010' }],
  ['outro ano', { id: 'app-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2011' }],
])(
  'recupera associação após %s sem indicar sucesso nem reenviar automaticamente',
  async (_, body) => {
    let calls = 0;
    const request = await openApplications(async () => {
      if (++calls === 1) {
        if (body === undefined) throw new TypeError('offline');
        return response(body, 201);
      }
      return response(
        { id: 'app-1', part_id: PART.id, brand: 'Fiat', model: 'Uno', year: '2010' },
        201,
      );
    });
    fillApplication();
    fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
    await screen.findByRole('button', { name: 'Tentar novamente' });
    expect(screen.queryByText('Aplicação associada com sucesso.')).not.toBeInTheDocument();
    cleanup();
    render(<App />);
    expect(await screen.findByRole('textbox', { name: /^Marca/ })).toHaveValue('Fiat');
    expect(screen.getByRole('textbox', { name: /^Ano/ })).toBeDisabled();
    expect(request.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    await screen.findByText('Aplicação associada com sucesso.');
    const posts = request.mock.calls.filter(([, options]) => options?.method === 'POST');
    expect(posts[1][0]).toBe(posts[0][0]);
    expect(posts[1][1].body).toBe(posts[0][1].body);
    expect(posts[1][1].headers['Idempotency-Key']).toBe(posts[0][1].headers['Idempotency-Key']);
    cleanup();
    render(<App />);
    expect(screen.getByRole('heading', { name: /Nova peça/ })).toBeInTheDocument();
  },
);

test('não envia quando o armazenamento da tentativa está indisponível', async () => {
  const request = await openApplications();
  fillApplication();
  const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  try {
    fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
    expect(await screen.findByText(/Não foi possível preservar a associação/)).toBeInTheDocument();
    expect(request.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(0);
  } finally {
    storage.mockRestore();
  }
});

test('protege o rascunho ao trocar de seção ou voltar ao catálogo', async () => {
  await openApplications();
  fillApplication();
  fireEvent.click(screen.getByRole('button', { name: 'Editar Filtro' }));
  expect(screen.getByRole('dialog', { name: 'Descartar alterações?' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Continuar editando' }));
  expect(await screen.findByRole('textbox', { name: /^Modelo/ })).toHaveValue('Uno');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Descartar alterações', exact: true }));
  expect(await screen.findByRole('heading', { name: 'Catálogo de peças' })).toBeInTheDocument();
});

test('mostra carregamento, impede envio prematuro e aborta consultas ao sair', async () => {
  const request = vi.fn(() => new Promise(() => {}));
  vi.stubGlobal('fetch', request);
  const { unmount } = render(
    <VehicleApplicationsSection partId={PART.id} onNavigationStateChange={vi.fn()} />,
  );
  expect(screen.getByRole('progressbar', { name: 'Carregando aplicações' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Associar veículo' })).toBeDisabled();
  unmount();
  expect(request.mock.calls.every(([, options]) => options.signal.aborted)).toBe(true);
});

test('recupera falha ao carregar e informa lista vazia', async () => {
  let offline = true;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => {
      if (offline) return response({ detail: { message: 'Consulta indisponível.' } }, 503);
      return response(url.includes('vehicle-applications') ? { items: [], total: 0 } : PART);
    }),
  );
  render(<VehicleApplicationsSection partId={PART.id} onNavigationStateChange={vi.fn()} />);
  expect(await screen.findByText('Consulta indisponível.')).toBeInTheDocument();
  offline = false;
  fireEvent.click(screen.getByRole('button', { name: 'Tentar carregar novamente' }));
  expect(await screen.findByText('Nenhuma aplicação cadastrada.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Associar veículo' })).toBeEnabled();
});

test('pagina aplicações preservando o formulário e mostra a nova associação na última página', async () => {
  const items = Array.from({ length: 21 }, (_, index) => ({
    id: `app-${index}`,
    brand: 'Fiat',
    model: 'Uno',
    year: String(2000 + index),
  }));
  const request = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      const item = { id: 'new', part_id: PART.id, ...JSON.parse(options.body) };
      items.push(item);
      return response(item, 201);
    }
    if (!url.includes('vehicle-applications')) return response(PART);
    const offset = Number(new URL(url).searchParams.get('offset'));
    return response({ items: items.slice(offset, offset + 20), total: items.length });
  });
  vi.stubGlobal('fetch', request);
  render(<VehicleApplicationsSection partId={PART.id} onNavigationStateChange={vi.fn()} />);
  await screen.findByText('Fiat · Uno · 2000');
  fillApplication();
  fireEvent.change(screen.getByRole('textbox', { name: /^Ano/ }), { target: { value: '2021' } });
  fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
  await screen.findByText('Fiat · Uno · 2020');
  expect(screen.queryByText('Fiat · Uno · 2000')).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /^Ano/ })).toHaveValue('2021');
  fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
  await screen.findByText('Fiat · Uno · 2000');
  fireEvent.click(screen.getByRole('button', { name: 'Associar veículo' }));
  await screen.findByText('Fiat · Uno · 2021');
  expect(screen.getByText('Fiat · Uno · 2020')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
  expect(screen.getByText('21–22 de 22')).toBeInTheDocument();
});
