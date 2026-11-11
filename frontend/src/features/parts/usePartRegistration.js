import { useRef, useState } from 'react';
import { createPart } from '../../services/parts.js';

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
    const data = {
      ...form,
      manufacturer_code: form.manufacturer_code.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      equivalent_codes: form.equivalent_codes
        .split(/[\n,;]+/)
        .map((code) => code.trim())
        .filter(Boolean),
      technical_description: form.technical_description.trim() || null,
      physical_location: form.physical_location.trim() || null,
    };
    const invalid = {};
    for (const field of ['manufacturer_code', 'name', 'category']) {
      if (!data[field]) invalid[field] = 'Preencha este campo.';
    }
    const codes = [data.manufacturer_code, ...data.equivalent_codes];
    if (codes.length !== new Set(codes).size)
      invalid.equivalent_codes = 'Não repita o código principal nem os códigos equivalentes.';
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
