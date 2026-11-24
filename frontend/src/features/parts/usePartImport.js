import { useRef, useState } from 'react';
import { importParts } from '../../services/partImports.js';
import { readPendingImport, preserveImport, clearPendingImport } from './pendingPartImport.js';

export default function usePartImport() {
  const [pending] = useState(readPendingImport);
  const [data, setData] = useState(pending?.data || null);
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message: 'Importação pendente recuperada. Tente novamente para confirmar o resultado.',
        }
      : null,
  );
  const [result, setResult] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inFlight = useRef(false);
  const attempt = useRef(pending);

  function selectFile(event) {
    const file = event.target.files?.[0];
    setData(null);
    setError(null);
    setResult(null);
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
      setError(new Error('Selecione um arquivo .xlsx de até 2 MiB.'));
      return;
    }
    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setData({ filename: file.name, content: reader.result.split(',')[1] });
      setIsReading(false);
    };
    reader.onerror = () => {
      setError(new Error('Não foi possível ler o arquivo. Selecione-o novamente.'));
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    if (!data || inFlight.current) return;
    attempt.current ||= { data, key: crypto.randomUUID() };
    try {
      preserveImport(attempt.current.data, attempt.current.key);
    } catch (failure) {
      if (!error?.isUncertain) attempt.current = null;
      setError({ message: failure.message, isUncertain: Boolean(error?.isUncertain) });
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      setResult(await importParts(attempt.current.data, attempt.current.key));
      clearPendingImport(attempt.current.key);
      attempt.current = null;
    } catch (failure) {
      setError(failure);
      if (!failure.isUncertain) {
        clearPendingImport(attempt.current.key);
        attempt.current = null;
      }
    } finally {
      setIsSaving(false);
      inFlight.current = false;
    }
  }
  return {
    data,
    error,
    result,
    isReading,
    isSaving,
    selectFile,
    submit,
    isLocked: isSaving || Boolean(error?.isUncertain),
  };
}
