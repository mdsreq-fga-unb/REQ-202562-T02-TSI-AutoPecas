import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:sale:v1:${apiBaseUrl}`;
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function readPendingSale() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    if (
      pending?.version !== 1 ||
      typeof pending.key !== 'string' ||
      !uuid.test(pending.key) ||
      typeof pending.data?.channel !== 'string' ||
      !Array.isArray(pending.data.items) ||
      !pending.data.items.length ||
      !Array.isArray(pending.display) ||
      pending.display.length !== pending.data.items.length ||
      !pending.data.items.every(
        (item) =>
          typeof item?.part_id === 'string' &&
          Number.isInteger(item.quantity) &&
          typeof item.unit_price === 'string',
      ) ||
      !pending.display.every(
        (part) => typeof part?.id === 'string' && typeof part.name === 'string',
      )
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveSale(data, display, key) {
  const previous = readPendingSale();
  if (previous && previous.key !== key)
    throw new Error('Há outra venda pendente. Recarregue a página para recuperá-la.');
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, data, display, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar a venda. Permita o armazenamento no navegador ou libere espaço e tente novamente. Nenhuma solicitação foi enviada.',
    );
  }
}

export function clearPendingSale(key) {
  try {
    if (readPendingSale()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Uma tentativa preservada pode ser repetida com a mesma chave, sem duplicação.
  }
}
