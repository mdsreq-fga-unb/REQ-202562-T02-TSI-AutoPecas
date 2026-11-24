import { apiBaseUrl } from './api.js';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

function unconfirmedResponse(message) {
  return Object.assign(new Error(message), { isUncertain: true });
}

async function requestParts(path, { method = 'GET', data, idempotencyKey, signal, cache } = {}) {
  const isWrite = method !== 'GET';
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/parts${path}`, {
      method,
      ...(cache && { cache }),
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
      new Error(result?.detail?.message || 'Não foi possível concluir a operação.'),
      {
        fields: result?.detail?.fields,
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

export async function getStockBalance(id, { signal } = {}) {
  const result = await requestParts(`/${encodeURIComponent(id)}/stock-balance`, {
    signal,
    cache: 'no-store',
  });
  if (result?.part_id !== id || !Number.isSafeInteger(result.stock_balance)) {
    throw new Error('Não foi possível confirmar o saldo da peça. Tente novamente.');
  }
  return result;
}

export async function registerStockEntry(id, data, idempotencyKey) {
  const result = await requestParts(`/${encodeURIComponent(id)}/stock-entries`, {
    method: 'POST',
    data,
    idempotencyKey,
  });
  if (
    result?.part_id !== id ||
    !isNonEmptyString(result.id) ||
    result.quantity !== data.quantity ||
    result.entry_date !== data.entry_date ||
    !Number.isSafeInteger(result.stock_balance) ||
    result.stock_balance < data.quantity
  ) {
    throw unconfirmedResponse(
      'Não foi possível confirmar a entrada. Tente novamente com os mesmos dados.',
    );
  }
  return result;
}

export function searchParts(filters, offset = 0, { signal } = {}) {
  const query = new URLSearchParams({ ...filters, offset: String(offset), limit: '20' });
  return requestParts(`/search?${query}`, { signal });
}

export function getPartPhotoUrl(part) {
  return part.photo_url
    ? `${apiBaseUrl}${part.photo_url}?v=${encodeURIComponent(part.updated_at)}`
    : null;
}

export async function associateVehicle(id, data, idempotencyKey) {
  const result = await requestParts(`/${encodeURIComponent(id)}/vehicle-applications`, {
    method: 'POST',
    data,
    idempotencyKey,
  });
  return confirmApplication(result, id, { expected: data });
}

export function listVehicleApplications(id, offset = 0, { signal } = {}) {
  return requestParts(`/${encodeURIComponent(id)}/vehicle-applications?offset=${offset}&limit=20`, {
    signal,
  });
}

function confirmApplication(result, partId, { applicationId, expected } = {}) {
  if (
    result?.part_id !== partId ||
    !isNonEmptyString(result.id) ||
    (applicationId !== undefined && result.id !== applicationId) ||
    !['brand', 'model', 'year'].every(
      (field) =>
        isNonEmptyString(result[field]) && (!expected || result[field] === expected[field]),
    )
  ) {
    throw unconfirmedResponse(
      'Não foi possível confirmar a resposta da aplicação. Tente novamente com os mesmos dados.',
    );
  }
  return result;
}

export async function updateVehicleApplication(partId, applicationId, data, idempotencyKey) {
  const result = await requestParts(
    `/${encodeURIComponent(partId)}/vehicle-applications/${encodeURIComponent(applicationId)}`,
    {
      method: 'PATCH',
      data,
      idempotencyKey,
    },
  );
  return confirmApplication(result, partId, { applicationId });
}

export async function removeVehicleApplication(partId, applicationId, idempotencyKey) {
  const result = await requestParts(
    `/${encodeURIComponent(partId)}/vehicle-applications/${encodeURIComponent(applicationId)}`,
    {
      method: 'DELETE',
      idempotencyKey,
    },
  );
  return confirmApplication(result, partId, { applicationId });
}
