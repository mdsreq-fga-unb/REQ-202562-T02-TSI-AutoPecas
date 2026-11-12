import { useRef, useState } from 'react';
import { createPart } from '../../services/parts.js';
import { serializePartForm, validatePartForm } from './partForm.js';

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
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPart, setSavedPart] = useState(null);
  const attempt = useRef(null);
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
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      setSavedPart(await createPart(data, attempt.current.key));
    } catch (failure) {
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
