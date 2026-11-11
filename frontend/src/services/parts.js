import { apiBaseUrl } from './api.js';

export async function createPart(data, idempotencyKey) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw Object.assign(
      new Error(
        'A conexão foi interrompida. Seus dados foram preservados. Tente novamente para confirmar o cadastro.',
      ),
      { isUncertain: true },
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw Object.assign(
      new Error('Não foi possível confirmar a resposta. Tente novamente com os mesmos dados.'),
      { isUncertain: true },
    );
  }
  if (!response.ok) {
    throw Object.assign(new Error(result.detail?.message || 'Não foi possível cadastrar a peça.'), {
      fields: result.detail?.fields,
      isUncertain: response.status >= 500,
    });
  }
  return result;
}
