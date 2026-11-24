import { useRef, useState } from 'react';
import { associateVehicle } from '../../services/parts.js';
import {
  clearPendingAssociation,
  preserveAssociation,
  readPendingAssociation,
} from './pendingVehicleAssociation.js';

const emptyForm = { brand: '', model: '', year: '' };

export default function useVehicleAssociation(partId, onAssociated) {
  const [pending] = useState(() => {
    const saved = readPendingAssociation();
    return saved?.partId === partId ? saved : null;
  });
  const [form, setForm] = useState(pending?.data || emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message:
            'Há uma associação pendente de confirmação. Seus dados foram recuperados. Tente novamente para confirmar a operação.',
        }
      : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const inFlight = useRef(false);
  const attempt = useRef(
    pending ? { serialized: JSON.stringify(pending.data), key: pending.key } : null,
  );
  const isLocked = isSaving || Boolean(error?.isUncertain);

  function update(name, value) {
    if (isLocked) return;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setError(null);
    setSuccess(false);
  }

  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    const invalid = {};
    for (const name of ['brand', 'model', 'year']) {
      if (!data[name]) invalid[name] = 'Preencha este campo.';
    }
    if (data.year && !/^[0-9]{4}$/.test(data.year))
      invalid.year = 'Informe um único ano com quatro dígitos.';
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      event.currentTarget.querySelector(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    const serialized = JSON.stringify(data);
    if (attempt.current?.serialized !== serialized)
      attempt.current = { serialized, key: crypto.randomUUID() };
    try {
      preserveAssociation(partId, data, attempt.current.key);
    } catch (failure) {
      setError(Object.assign(failure, { isUncertain: Boolean(error?.isUncertain) }));
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const application = await associateVehicle(partId, data, attempt.current.key);
      clearPendingAssociation(attempt.current.key);
      onAssociated(application);
      setSuccess(true);
      setForm(emptyForm);
      attempt.current = null;
    } catch (failure) {
      if (!failure.isUncertain) clearPendingAssociation(attempt.current.key);
      setError(failure);
      setErrors(failure.fields || {});
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  }

  return {
    form,
    errors,
    error,
    success,
    isLocked,
    isSaving,
    update,
    submit,
    isDirty: Object.values(form).some(Boolean),
  };
}
