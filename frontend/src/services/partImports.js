import { apiBaseUrl } from './api.js';

export const importTemplateUrl = `${apiBaseUrl}/part-imports/template`;

export async function importParts(data, idempotencyKey) {
  let response;
  let result;
  try {
    response = await fetch(`${apiBaseUrl}/part-imports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000),
    });
    result = await response.json();
  } catch {
    throw Object.assign(
      new Error(
        'Não foi possível confirmar a importação. O arquivo foi preservado. Tente novamente com a mesma tentativa.',
      ),
      { isUncertain: true },
    );
  }
  if (!response.ok) {
    throw Object.assign(
      new Error(result?.detail?.message || 'Não foi possível importar a planilha.'),
      {
        issues: result?.detail?.issues,
        isUncertain: response.status >= 500,
      },
    );
  }
  if (!Number.isSafeInteger(result?.imported_count) || result.imported_count < 1) {
    throw Object.assign(new Error('A resposta não confirmou a importação. Tente novamente.'), {
      isUncertain: true,
    });
  }
  return result;
}
