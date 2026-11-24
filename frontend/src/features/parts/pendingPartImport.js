import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:part-import:v1:${apiBaseUrl}`;

export function readPendingImport() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (
      saved?.version !== 1 ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(saved.key) ||
      typeof saved.data?.filename !== 'string' ||
      !/\.xlsx$/i.test(saved.data.filename) ||
      typeof saved.data?.content !== 'string' ||
      !saved.data.content ||
      saved.data.content.length > 2_800_000
    )
      return null;
    return saved;
  } catch {
    return null;
  }
}

export function preserveImport(data, key) {
  const previous = readPendingImport();
  if (previous && previous.key !== key)
    throw new Error('Há outra importação pendente. Recarregue a página para recuperá-la.');
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar a importação. Permita o armazenamento no navegador ou libere espaço. Nenhuma solicitação foi enviada.',
    );
  }
}

export function clearPendingImport(key) {
  try {
    if (readPendingImport()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // A tentativa pode ser repetida com a mesma chave sem criar peças novamente.
  }
}
