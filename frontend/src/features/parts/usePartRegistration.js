import { useRef, useState } from 'react';
import { createPart } from '../../services/parts.js';
import { serializePartForm, validatePartForm } from './partForm.js';
import {
  clearPendingRegistration,
  preserveRegistration,
  readPendingRegistration,
} from './pendingRegistration.js';

const emptyForm = {
  manufacturer_code: '',
  name: '',
  category: '',
  equivalent_codes: '',
  technical_description: '',
  physical_location: '',
  photo_data: null,
};

export default function usePartRegistration() {
  const [restored] = useState(readPendingRegistration);
  const [form, setForm] = useState(() =>
    restored
      ? {
          ...restored.data,
          equivalent_codes: restored.data.equivalent_codes.join('\n'),
          physical_location: restored.data.physical_location || '',
          technical_description: restored.data.technical_description || '',
        }
      : { ...emptyForm },
  );
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(() =>
    restored
      ? Object.assign(
          new Error(
            'Há um cadastro pendente recuperado neste navegador. Tente novamente para confirmar a operação com os mesmos dados.',
          ),
          { isUncertain: true },
        )
      : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedPart, setSavedPart] = useState(null);
  const attempt = useRef(
    restored ? { serialized: JSON.stringify(restored.data), key: restored.key } : null,
  );
  const inFlight = useRef(false);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setError(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = serializePartForm(form);
    const invalid = validatePartForm(data);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      event.currentTarget.querySelector(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    const serialized = JSON.stringify(data);
    if (attempt.current?.serialized !== serialized) {
      attempt.current = { serialized, key: crypto.randomUUID() };
    }
    try {
      preserveRegistration(data, attempt.current.key);
    } catch (failure) {
      setError(Object.assign(failure, { isUncertain: Boolean(error?.isUncertain) }));
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const result = await createPart(data, attempt.current.key);
      clearPendingRegistration(attempt.current.key);
      setSavedPart(result);
    } catch (failure) {
      if (!failure.isUncertain) clearPendingRegistration(attempt.current.key);
      setError(failure);
      setErrors(failure.fields || {});
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  }

  function reset() {
    setForm({ ...emptyForm });
    setErrors({});
    setError(null);
    setSavedPart(null);
    attempt.current = null;
  }

  return {
    form,
    update,
    submit,
    reset,
    errors,
    error,
    savedPart,
    isSaving,
    isLocked: isSaving || Boolean(error?.isUncertain),
    isDirty: Object.values(form).some(Boolean),
  };
}
