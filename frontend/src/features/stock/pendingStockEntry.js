import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:stock-entry:v1:${apiBaseUrl}`;

export function readPendingEntry() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    if (
      pending?.version !== 1 ||
      typeof pending.partId !== 'string' ||
      !pending.partId ||
      typeof pending.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(pending.key) ||
      !Number.isInteger(pending.data?.quantity) ||
      typeof pending.data?.entry_date !== 'string' ||
      typeof pending.data?.unit_cost !== 'string'
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveEntry(partId, data, key) {
  const previous = readPendingEntry();
  if (previous && previous.key !== key)
    throw new Error('Há outra entrada pendente. Recarregue a página para recuperá-la.');
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, partId, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar a entrada. Permita o armazenamento no navegador ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingEntry(key) {
  try {
    if (readPendingEntry()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Uma tentativa preservada pode ser repetida com a mesma chave, sem duplicação.
  }
}
