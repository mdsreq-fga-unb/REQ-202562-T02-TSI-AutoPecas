import { apiBaseUrl } from '../../services/api.js';

// Chave distinta da entrada: uma entrada pendente e uma saída pendente nunca se atropelam.
const storageKey = `tsi:stock-exit:v1:${apiBaseUrl}`;

export function readPendingExit() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    if (
      pending?.version !== 1 ||
      typeof pending.partId !== 'string' ||
      !pending.partId ||
      typeof pending.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(pending.key) ||
      !Number.isInteger(pending.data?.quantity) ||
      typeof pending.data?.exit_date !== 'string' ||
      typeof pending.data?.reason !== 'string' ||
      !pending.data.reason
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveExit(partId, data, key) {
  const previous = readPendingExit();
  if (previous && previous.key !== key)
    throw new Error('Há outra saída pendente. Recarregue a página para recuperá-la.');
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, partId, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar a saída. Permita o armazenamento no navegador ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingExit(key) {
  try {
    if (readPendingExit()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Uma tentativa preservada pode ser repetida com a mesma chave, sem duplicação.
  }
}
