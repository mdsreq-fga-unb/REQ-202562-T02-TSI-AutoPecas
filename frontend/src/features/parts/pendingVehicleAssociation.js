import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:vehicle-association:v1:${apiBaseUrl}`;

export function readPendingAssociation() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    if (
      pending?.version !== 1 ||
      typeof pending.partId !== 'string' ||
      !pending.partId ||
      typeof pending.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(pending.key) ||
      !['brand', 'model', 'year'].every(
        (field) => typeof pending.data?.[field] === 'string' && pending.data[field].trim(),
      )
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveAssociation(partId, data, key) {
  const previous = readPendingAssociation();
  if (previous && previous.key !== key)
    throw new Error(
      'Há outra associação pendente neste navegador. Recarregue a página para recuperá-la antes de iniciar outra.',
    );
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, partId, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar a associação no armazenamento do navegador. Permita o armazenamento ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingAssociation(key) {
  try {
    if (readPendingAssociation()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // A tentativa preservada pode ser repetida com a mesma chave, sem duplicar a gravação.
  }
}
