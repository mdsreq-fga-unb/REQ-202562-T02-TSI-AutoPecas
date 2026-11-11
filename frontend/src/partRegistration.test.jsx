import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

afterEach(() => vi.unstubAllGlobals());

test('cadastra uma peça somente com os três campos obrigatórios', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 'part-1',
      manufacturer_code: 'FLT-100',
      name: 'Filtro de óleo',
      category: 'Filtros',
    }),
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.change(screen.getByRole('textbox', { name: /Código do fabricante/ }), {
    target: { value: 'FLT-100' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Filtro de óleo' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Categoria/ }), {
    target: { value: 'Filtros' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  expect(await screen.findByText('Peça cadastrada com sucesso')).toBeInTheDocument();
  expect(request).toHaveBeenCalledTimes(1);
  expect(request.mock.calls[0][0]).toMatch(/\/parts$/);
  expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({
    manufacturer_code: 'FLT-100',
    name: 'Filtro de óleo',
    category: 'Filtros',
  });
});

function fillRequired() {
  for (const [label, value] of [
    [/Código do fabricante/, 'FLT-100'],
    [/Nome da peça/, 'Filtro de óleo'],
    [/Categoria/, 'Filtros'],
  ]) {
    fireEvent.change(screen.getByRole('textbox', { name: label }), { target: { value } });
  }
}

test('identifica campos obrigatórios sem enviar um cadastro vazio', () => {
  const request = vi.fn();
  vi.stubGlobal('fetch', request);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  expect(screen.getAllByText('Preencha este campo.')).toHaveLength(3);
  expect(request).not.toHaveBeenCalled();
});

test('preserva os dados e reutiliza a chave ao tentar novamente após falha de rede', async () => {
  const request = vi
    .fn()
    .mockRejectedValueOnce(new TypeError('Network error'))
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        manufacturer_code: 'FLT-100',
        name: 'Filtro de óleo',
        category: 'Filtros',
      }),
    });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
  expect(await screen.findByText('Peça cadastrada com sucesso')).toBeInTheDocument();
  expect(request.mock.calls[0][1].headers['Idempotency-Key']).toBe(
    request.mock.calls[1][1].headers['Idempotency-Key'],
  );
  expect(request.mock.calls[0][1].body).toBe(request.mock.calls[1][1].body);
});

test('identifica a peça duplicada e permite corrigir o código sem perder os campos', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        detail: { message: 'O código FLT-100 já pertence à peça Filtro existente.' },
      }),
    }),
  );
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  expect(await screen.findByText(/já pertence à peça Filtro existente/)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Filtro de óleo');
  expect(screen.getByRole('textbox', { name: /Código do fabricante/ })).toBeEnabled();
});

test('envia códigos equivalentes e os dados complementares', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      id: '1',
      name: 'Filtro',
      manufacturer_code: 'FLT-100',
      category: 'Filtros',
    }),
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fillRequired();
  fireEvent.change(screen.getByRole('textbox', { name: /Códigos equivalentes/ }), {
    target: { value: 'ABC-123\nXYZ-456' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Localização física/ }), {
    target: { value: 'A2' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({
    equivalent_codes: ['ABC-123', 'XYZ-456'],
    physical_location: 'A2',
  });
});
