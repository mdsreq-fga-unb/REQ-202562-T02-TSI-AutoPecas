import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

test('inicia em claro, alterna sem perder o formulário e restaura a preferência', () => {
  const view = render(<App />);
  fireEvent.change(screen.getByRole('textbox', { name: /Nome da peça/ }), {
    target: { value: 'Filtro' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ativar tema escuro' }));
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Filtro');
  expect(localStorage.getItem('tsi-theme')).toBe('dark');
  view.unmount();
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }));
  expect(localStorage.getItem('tsi-theme')).toBe('light');
});

test('ignora preferência inválida e funciona se o armazenamento estiver indisponível', () => {
  localStorage.setItem('tsi-theme', 'invalid');
  const view = render(<App />);
  expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeInTheDocument();
  view.unmount();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Ativar tema escuro' }));
  expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument();
});
