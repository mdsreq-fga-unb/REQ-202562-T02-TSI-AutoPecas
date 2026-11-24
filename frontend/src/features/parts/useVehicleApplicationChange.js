import { useEffect, useRef, useState } from 'react';
import { removeVehicleApplication, updateVehicleApplication } from '../../services/parts.js';

import {
  clearPendingVehicleChange,
  preserveVehicleChange,
  readPendingVehicleChange,
} from './pendingVehicleApplicationChange.js';

const emptyForm = { brand: '', model: '', year: '' };

export default function useVehicleApplicationChange(partId, onChanged) {
  const [pending] = useState(() => {
    const saved = readPendingVehicleChange();
    return saved?.partId === partId ? saved : null;
  });
  const [application, setApplication] = useState(
    pending ? { id: pending.applicationId, ...pending.application } : null,
  );
  const [action, setAction] = useState(pending?.action || 'update');
  const [form, setForm] = useState(pending?.data || emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message:
            'Há uma operação pendente de confirmação. Seus dados foram recuperados. Tente novamente para confirmar a alteração.',
        }
      : null,
  );
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inFlight = useRef(false);
  const attempt = useRef(pending);
  const isLocked = isSaving || Boolean(error?.isUncertain);

  useEffect(() => {
    if (!isLocked) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isLocked]);

  function startEdit(item) {
    if (isLocked) return;
    setAction('update');
    setApplication(item);
    setForm({ brand: item.brand, model: item.model, year: item.year });
    setErrors({});
    setError(null);
    setNotice('');
    attempt.current = null;
  }
  function startRemove(item) {
    if (isLocked) return;
    startEdit(item);
    setAction('remove');
  }
  function close() {
    if (!isLocked) {
      setApplication(null);
      setError(null);
    }
  }
  function update(name, value) {
    if (isLocked) return;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setError(null);
    attempt.current = null;
  }
  async function submit(event) {
    event?.preventDefault();
    if (inFlight.current || !application) return;
    const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const invalid = {};
    for (const name of action === 'update' ? ['brand', 'model', 'year'] : []) {
      if (!data[name]) invalid[name] = 'Preencha este campo.';
    }
    if (action === 'update' && data.year && !/^[0-9]{4}$/.test(data.year))
      invalid.year = 'Informe um único ano com quatro dígitos.';
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    attempt.current ||= {
      action,
      partId,
      applicationId: application.id,
      application: { brand: application.brand, model: application.model, year: application.year },
      data: action === 'update' ? data : null,
      key: crypto.randomUUID(),
    };
    try {
      preserveVehicleChange(attempt.current);
    } catch (failure) {
      setError(Object.assign(failure, { isUncertain: Boolean(error?.isUncertain) }));
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      if (action === 'remove')
        await removeVehicleApplication(partId, application.id, attempt.current.key);
      else
        await updateVehicleApplication(
          partId,
          application.id,
          attempt.current.data,
          attempt.current.key,
        );
      clearPendingVehicleChange(attempt.current.key);
      setApplication(null);
      attempt.current = null;
      setNotice(
        action === 'remove'
          ? 'Aplicação removida com sucesso.'
          : 'Aplicação atualizada com sucesso.',
      );
      onChanged();
    } catch (failure) {
      if (!failure.isUncertain) {
        clearPendingVehicleChange(attempt.current.key);
        attempt.current = null;
      }
      setError(failure);
      setErrors(failure.fields || {});
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  }
  return {
    application,
    action,
    startRemove,
    form,
    errors,
    error,
    notice,
    isSaving,
    isLocked,
    startEdit,
    close,
    update,
    submit,
  };
}
