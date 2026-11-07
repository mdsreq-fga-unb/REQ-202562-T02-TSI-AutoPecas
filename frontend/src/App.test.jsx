import { render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

afterEach(() => vi.unstubAllGlobals());

test('informa quando a API está disponível', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'ok' }) }),
  );
  render(<App />);
  expect(screen.getByRole('heading', { name: 'TSI Peças' })).toBeInTheDocument();
  expect(await screen.findByText('API disponível')).toBeInTheDocument();
});

test('informa falha de conexão sem impedir a apresentação da página', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Falha de conexão')));
  render(<App />);
  expect(await screen.findByText(/API indisponível/)).toBeInTheDocument();
});
