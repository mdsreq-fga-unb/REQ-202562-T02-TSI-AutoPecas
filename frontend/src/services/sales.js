import { apiBaseUrl } from './api.js';

function uncertain(message) {
  return Object.assign(new Error(message), { isUncertain: true });
}

export async function registerSale(data, idempotencyKey) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw uncertain(
      'A conexão foi interrompida. Seus dados foram preservados. Tente novamente para confirmar a venda.',
    );
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw uncertain('Não foi possível confirmar a resposta. Tente novamente.');
  }
  if (!response.ok) {
    throw Object.assign(
      new Error(result?.detail?.message || 'Não foi possível registrar a venda.'),
      {
        fields: result?.detail?.fields,
        items: result?.detail?.items,
        isUncertain: response.status >= 500,
      },
    );
  }
  if (
    typeof result?.id !== 'string' ||
    !result.id ||
    result.status !== 'registered' ||
    result.channel !== data.channel ||
    typeof result.total !== 'string' ||
    !Array.isArray(result.items) ||
    result.items.length !== data.items.length ||
    !result.items.every(
      (item, index) =>
        item?.part_id === data.items[index].part_id &&
        item.quantity === data.items[index].quantity &&
        Number.isSafeInteger(item.stock_balance) &&
        item.stock_balance >= 0,
    )
  ) {
    throw uncertain('Não foi possível confirmar a venda. Tente novamente com os mesmos dados.');
  }
  return result;
}
