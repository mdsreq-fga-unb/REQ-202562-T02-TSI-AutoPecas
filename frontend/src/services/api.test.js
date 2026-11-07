import { afterEach, expect, test, vi } from 'vitest';
import { getApiHealth } from './api.js';

afterEach(() => vi.unstubAllGlobals());

test('rejeita uma resposta HTTP de erro', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  await expect(getApiHealth()).rejects.toThrow('Não foi possível consultar a API.');
});

test('rejeita uma resposta que não confirma o funcionamento da API', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'error' }) }),
  );
  await expect(getApiHealth()).rejects.toThrow('A API não confirmou seu funcionamento.');
});
