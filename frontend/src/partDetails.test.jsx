import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

const part = {
  id: 'part-1',
  manufacturer_code: 'FLT-100',
  name: 'Filtro de óleo',
  category: 'Filtros',
  status: 'active',
  equivalent_codes: ['EQ-01'],
  physical_location: 'Prateleira A',
  technical_description: 'Rosca M20',
};

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test('abre uma peça com cadastro, aplicações e estoque e retorna a ela após editar ou registrar entrada', async () => {
  let current = part;
  let balance = 5;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, options) => {
      let body;
      if (options.method === 'PATCH') {
        current = { ...current, ...JSON.parse(options.body) };
        body = current;
      } else if (options.method === 'POST') {
        const entry = JSON.parse(options.body);
        balance += entry.quantity;
        body = { ...entry, id: 'entry-1', part_id: part.id, stock_balance: balance };
      } else if (url.includes('/stock-balance')) {
        body = { part_id: part.id, stock_balance: balance };
      } else if (url.includes('/vehicle-applications')) {
        body = { items: [{ id: 'app-1', brand: 'Fiat', model: 'Uno', year: '2010' }], total: 1 };
      } else if (url.includes('?offset=')) {
        body = { items: [current], total: 1 };
      } else {
        body = current;
      }
      return { ok: true, status: options.method === 'POST' ? 201 : 200, json: async () => body };
    }),
  );
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Catálogo', exact: true }));
  const item = await within(screen.getByRole('main')).findByRole('listitem');
  expect(within(item).getAllByRole('button')).toHaveLength(1);
  fireEvent.click(within(item).getByRole('button', { name: 'Ver peça Filtro de óleo' }));

  expect(await screen.findByRole('heading', { level: 1, name: 'Filtro de óleo' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Dados cadastrais' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Aplicações por veículo' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Estoque' })).toBeVisible();
  expect(screen.getByText('Rosca M20')).toBeVisible();
  expect(await screen.findByText('Fiat · Uno · 2010')).toBeVisible();
  expect(await screen.findByText('Saldo atual: 5 unidades')).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: 'Editar Filtro de óleo' }));
  fireEvent.change(await screen.findByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Filtro revisado' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));
  await screen.findByText('Peça atualizada com sucesso');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar à peça' }));
  await screen.findByRole('heading', { level: 1, name: 'Filtro revisado' });

  fireEvent.click(screen.getByRole('button', { name: 'Registrar entrada de Filtro revisado' }));
  fireEvent.change(await screen.findByLabelText('Quantidade'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Data da entrada'), { target: { value: '2026-01-01' } });
  fireEvent.change(screen.getByLabelText('Custo unitário (R$)'), { target: { value: '12,50' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar entrada' }));
  await screen.findByText('Entrada registrada. Saldo após esta entrada: 8 unidades.');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar à peça' }));
  await screen.findByRole('heading', { level: 1, name: 'Filtro revisado' });
  expect(await screen.findByText('Saldo atual: 8 unidades')).toBeVisible();
});
