import { useRef, useState } from 'react';
import { getPartPhotoUrl, updatePart } from '../../services/parts.js';
import { serializePartForm, validatePartForm } from './partForm.js';

export default function usePartEditing(part) {
  const [initialForm] = useState(() => ({
    manufacturer_code: part.manufacturer_code,
    name: part.name,
    category: part.category,
    equivalent_codes: part.equivalent_codes.join('\n'),
    physical_location: part.physical_location || '',
    technical_description: part.technical_description || '',
    photo_data: getPartPhotoUrl(part),
  }));
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPart, setSavedPart] = useState(null);
  const attempt = useRef(null);
  const isInFlight = useRef(false);
  const changedFields = Object.keys(form).filter((name) => form[name] !== initialForm[name]);
  const isDirty = changedFields.length > 0;

  function update(name, value) {
    if (name === 'manufacturer_code') return;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setError(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (isInFlight.current || !isDirty) return;
    const data = serializePartForm(form);
    if (!changedFields.includes('equivalent_codes')) data.equivalent_codes = part.equivalent_codes;
    const invalid = validatePartForm(data);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      event.currentTarget.querySelector(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    const changes = Object.fromEntries(changedFields.map((name) => [name, data[name]]));
    const serialized = JSON.stringify(changes);
    if (attempt.current?.serialized !== serialized) {
      attempt.current = { serialized, key: crypto.randomUUID() };
    }
    isInFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      setSavedPart(await updatePart(part.id, changes, attempt.current.key));
    } catch (failure) {
      setError(failure);
      setErrors(failure.fields || {});
    } finally {
      isInFlight.current = false;
      setIsSaving(false);
    }
  }

  return {
    form,
    update,
    submit,
    errors,
    error,
    isSaving,
    isDirty,
    savedPart,
    isLocked: isSaving || Boolean(error?.isUncertain),
  };
}
