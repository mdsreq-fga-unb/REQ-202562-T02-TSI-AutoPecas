import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App.jsx';
import usePartRegistration from './features/parts/usePartRegistration.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

test('associa o aviso de código permanente ao campo e preserva a descrição dos erros', () => {
  render(<App />);
  const code = screen.getByRole('textbox', { name: /Código do fabricante/ });
  const permanentCodeNotice = 'O código principal é permanente após o cadastro.';

  expect(code).toHaveAccessibleDescription(permanentCodeNotice);
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  expect(code).toHaveAccessibleDescription(`${permanentCodeNotice} Preencha este campo.`);
  expect(code).toHaveFocus();

  fireEvent.change(code, { target: { value: 'FLT-100' } });
  expect(code).toHaveAccessibleDescription(permanentCodeNotice);
  expect(code).not.toHaveAttribute('aria-invalid', 'true');
});

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

test('recupera cadastro incerto após recarregar e reutiliza dados, foto e chave originais', async () => {
  const request = vi
    .fn()
    .mockRejectedValueOnce(new TypeError('offline'))
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'recovered',
        manufacturer_code: 'FLT-100',
        name: 'Filtro',
        category: 'Filtros',
      }),
    });
  vi.stubGlobal('fetch', request);
  const first = render(<App />);
  fillRequired();
  fireEvent.change(screen.getByRole('textbox', { name: /Códigos equivalentes/ }), {
    target: { value: 'ACME;01\nACME,02' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Localização física/ }), {
    target: { value: 'A2' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /Descrição técnica/ }), {
    target: { value: 'Descrição recuperada' },
  });
  fireEvent.change(screen.getByLabelText('Foto da peça'), {
    target: { files: [new File(['review-photo'], 'recuperar.png', { type: 'image/png' })] },
  });
  await screen.findByText('recuperar.png');
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  await screen.findByRole('button', { name: 'Tentar novamente' });
  const [, original] = request.mock.calls[0];
  first.unmount();
  const second = render(<App />);
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Filtro de óleo');
  expect(screen.getByRole('textbox', { name: /Código do fabricante/ })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: /Códigos equivalentes/ })).toHaveValue(
    'ACME;01\nACME,02',
  );
  expect(screen.getByRole('textbox', { name: /Localização física/ })).toHaveValue('A2');
  expect(screen.getByRole('textbox', { name: /Descrição técnica/ })).toHaveValue(
    'Descrição recuperada',
  );
  expect(screen.getByAltText('Prévia da peça')).toHaveAttribute(
    'src',
    JSON.parse(original.body).photo_data,
  );
  expect(request).toHaveBeenCalledTimes(1);
  fireEvent.click(retry);
  await screen.findByText('Peça cadastrada com sucesso');
  expect(request.mock.calls[1][1].headers['Idempotency-Key']).toBe(
    original.headers['Idempotency-Key'],
  );
  expect(request.mock.calls[1][1].body).toBe(original.body);
  second.unmount();
  render(<App />);
  expect(screen.getByRole('textbox', { name: /Código do fabricante/ })).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Cadastrar peça' })).toBeEnabled();
});

test('preserva uma tentativa mesmo se a página sair antes da resposta da API', async () => {
  let finishFirst;
  const request = vi.fn().mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishFirst = resolve;
      }),
  );
  vi.stubGlobal('fetch', request);
  const first = render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  const originalKey = request.mock.calls[0][1].headers['Idempotency-Key'];
  first.unmount();
  render(<App />);
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  const result = {
    ok: true,
    json: async () => ({
      id: 'in-flight',
      manufacturer_code: 'FLT-100',
      name: 'Filtro',
      category: 'Filtros',
    }),
  };
  request.mockResolvedValueOnce(result);
  fireEvent.click(retry);
  await screen.findByText('Peça cadastrada com sucesso');
  expect(request.mock.calls[1][1].headers['Idempotency-Key']).toBe(originalKey);
  finishFirst(result);
});

test('não envia cadastro se não conseguir preservar a tentativa no navegador', async () => {
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 'retry-storage',
      manufacturer_code: 'FLT-100',
      name: 'Filtro',
      category: 'Filtros',
    }),
  });
  vi.stubGlobal('fetch', request);
  render(<App />);
  fillRequired();
  const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/armazenamento/i);
  expect(request).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: /Nome da peça/ })).toHaveValue('Filtro de óleo');
  storage.mockRestore();
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  await screen.findByText('Peça cadastrada com sucesso');
  expect(request).toHaveBeenCalledTimes(1);
});

test('mantém um cadastro incerto bloqueado se o armazenamento falhar na repetição', async () => {
  const request = vi.fn().mockRejectedValue(new TypeError('offline'));
  vi.stubGlobal('fetch', request);
  render(<App />);
  fillRequired();
  fireEvent.click(screen.getByRole('button', { name: 'Cadastrar peça' }));
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  fireEvent.click(retry);
  expect(await screen.findByRole('alert')).toHaveTextContent(/armazenamento/i);
  expect(screen.getByRole('textbox', { name: /Código do fabricante/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeEnabled();
  expect(request).toHaveBeenCalledTimes(1);
});

test('não sobrescreve o cadastro pendente quando outra aba tenta iniciar um cadastro', async () => {
  const request = vi.fn().mockRejectedValue(new TypeError('offline'));
  vi.stubGlobal('fetch', request);
  const first = renderHook(() => usePartRegistration());
  const other = renderHook(() => usePartRegistration());
  act(() => {
    for (const [name, value] of Object.entries({
      manufacturer_code: 'FIRST',
      name: 'Primeira peça',
      category: 'Filtros',
    }))
      first.result.current.update(name, value);
    for (const [name, value] of Object.entries({
      manufacturer_code: 'OTHER',
      name: 'Outra peça',
      category: 'Filtros',
    }))
      other.result.current.update(name, value);
  });
  const event = { preventDefault() {}, currentTarget: { querySelector: () => null } };
  await act(async () => first.result.current.submit(event));
  await act(async () => other.result.current.submit(event));
  expect(other.result.current.error.message).toMatch(/outro cadastro pendente/);
  expect(request).toHaveBeenCalledTimes(1);
  first.unmount();
  other.unmount();
  const recovered = renderHook(() => usePartRegistration());
  expect(recovered.result.current.form.manufacturer_code).toBe('FIRST');
  expect(recovered.result.current.isLocked).toBe(true);
});
