import { apiBaseUrl } from '../../services/api.js';

// Chave distinta de entrada e saída: tentativas pendentes de tipos diferentes nunca se atropelam.
const storageKey = `tsi:stock-adjustment:v1:${apiBaseUrl}`;

export function readPendingAdjustment() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    if (
      pending?.version !== 1 ||
      typeof pending.partId !== 'string' ||
      !pending.partId ||
      typeof pending.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(pending.key) ||
      !Number.isInteger(pending.data?.quantity_delta) ||
      pending.data.quantity_delta === 0 ||
      typeof pending.data?.justification !== 'string' ||
      !pending.data.justification
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveAdjustment(partId, data, key) {
  const previous = readPendingAdjustment();
  if (previous && previous.key !== key)
    throw new Error('Há outro ajuste pendente. Recarregue a página para recuperá-lo.');
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, partId, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar o ajuste. Permita o armazenamento no navegador ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingAdjustment(key) {
  try {
    if (readPendingAdjustment()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Uma tentativa preservada pode ser repetida com a mesma chave, sem duplicação.
  }
}
