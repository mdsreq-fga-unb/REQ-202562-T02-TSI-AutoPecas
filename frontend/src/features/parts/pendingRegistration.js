import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:part-registration:v1:${apiBaseUrl}`;

export function readPendingRegistration() {
  try {
    const pending = JSON.parse(localStorage.getItem(storageKey));
    const data = pending?.data;
    if (
      pending?.version !== 1 ||
      typeof pending.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(pending.key) ||
      !data ||
      !['manufacturer_code', 'name', 'category'].every(
        (field) => typeof data[field] === 'string' && data[field].trim(),
      ) ||
      !Array.isArray(data.equivalent_codes) ||
      !data.equivalent_codes.every((code) => typeof code === 'string') ||
      !['physical_location', 'technical_description', 'photo_data'].every(
        (field) => data[field] === null || typeof data[field] === 'string',
      )
    )
      return null;
    return pending;
  } catch {
    return null;
  }
}

export function preserveRegistration(data, key) {
  const previous = readPendingRegistration();
  if (previous && previous.key !== key) {
    throw new Error(
      'Há outro cadastro pendente neste navegador. Recarregue a página para recuperá-lo antes de iniciar outro.',
    );
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, data, key }));
  } catch {
    throw new Error(
      'Não foi possível preservar o cadastro no armazenamento do navegador. Permita o armazenamento ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingRegistration(key) {
  try {
    if (readPendingRegistration()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Manter a tentativa permite recuperá-la com a mesma chave, sem duplicar a gravação.
  }
}
