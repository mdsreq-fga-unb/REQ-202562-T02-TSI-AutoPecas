import { apiBaseUrl } from './api.js';

async function requestParts(path, { method = 'GET', data, idempotencyKey, signal } = {}) {
  const isWrite = method !== 'GET';
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/parts${path}`, {
      method,
      ...(isWrite && {
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(data),
      }),
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(30000)])
        : AbortSignal.timeout(30000),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw Object.assign(
      new Error(
        isWrite
          ? 'A conexão foi interrompida. Seus dados foram preservados. Tente novamente para confirmar a operação.'
          : 'Não foi possível carregar as peças. Tente novamente.',
      ),
      { isUncertain: isWrite },
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw Object.assign(new Error('Não foi possível confirmar a resposta. Tente novamente.'), {
      isUncertain: isWrite,
    });
  }
  if (!response.ok) {
    throw Object.assign(
      new Error(result.detail?.message || 'Não foi possível concluir a operação.'),
      {
        fields: result.detail?.fields,
        isUncertain: isWrite && response.status >= 500,
      },
    );
  }
  return result;
}

export function createPart(data, idempotencyKey) {
  return requestParts('', { method: 'POST', data, idempotencyKey });
}

export function updatePart(id, data, idempotencyKey) {
  return requestParts(`/${encodeURIComponent(id)}`, { method: 'PATCH', data, idempotencyKey });
}

export function getPart(id, { signal } = {}) {
  return requestParts(`/${encodeURIComponent(id)}`, { signal });
}

export function listParts(offset = 0, { signal } = {}) {
  return requestParts(`?offset=${offset}&limit=20`, { signal });
}

export function getPartPhotoUrl(part) {
  return part.photo_url
    ? `${apiBaseUrl}${part.photo_url}?v=${encodeURIComponent(part.updated_at)}`
    : null;
}
