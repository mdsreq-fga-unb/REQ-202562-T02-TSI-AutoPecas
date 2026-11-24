import { apiBaseUrl } from '../../services/api.js';

const storageKey = `tsi:vehicle-application-change:v1:${apiBaseUrl}`;
const hasFields = (value) =>
  ['brand', 'model', 'year'].every(
    (name) => typeof value?.[name] === 'string' && value[name].trim(),
  );

export function readPendingVehicleChange() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (
      saved?.version !== 1 ||
      !['update', 'remove'].includes(saved.action) ||
      typeof saved.partId !== 'string' ||
      !saved.partId ||
      typeof saved.applicationId !== 'string' ||
      !saved.applicationId ||
      typeof saved.key !== 'string' ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(saved.key) ||
      !hasFields(saved.application) ||
      (saved.action === 'update' ? !hasFields(saved.data) : saved.data !== null)
    )
      return null;
    return saved;
  } catch {
    return null;
  }
}

export function preserveVehicleChange(attempt) {
  const previous = readPendingVehicleChange();
  if (previous && previous.key !== attempt.key)
    throw new Error(
      'Há outra alteração de aplicação pendente neste navegador. Recarregue a página para recuperá-la.',
    );
  try {
    localStorage.setItem(storageKey, JSON.stringify({ ...attempt, version: 1 }));
    if (readPendingVehicleChange()?.key !== attempt.key) throw new Error('Gravação não confirmada');
  } catch {
    throw new Error(
      'Não foi possível preservar a alteração no armazenamento do navegador. Permita o armazenamento ou libere espaço e tente novamente. Nenhuma nova solicitação foi enviada.',
    );
  }
}

export function clearPendingVehicleChange(key) {
  try {
    if (readPendingVehicleChange()?.key === key) localStorage.removeItem(storageKey);
  } catch {
    // Repetir a tentativa preservada com a mesma chave não reaplica a alteração.
  }
}
