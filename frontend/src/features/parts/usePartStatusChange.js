import { useEffect, useRef, useState } from 'react';
import { updatePart } from '../../services/parts.js';

export default function usePartStatusChange(part, onSuccess) {
  const targetStatus = part.status === 'inactive' ? 'active' : 'inactive';
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const attemptKey = useRef(null);
  const isInFlight = useRef(false);
  const isLocked = isSaving || Boolean(error?.isUncertain);

  useEffect(() => {
    if (!isLocked) return;
    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isLocked]);

  async function submit() {
    if (isInFlight.current) return;
    attemptKey.current ??= crypto.randomUUID();
    isInFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const savedPart = await updatePart(part.id, { status: targetStatus }, attemptKey.current);
      onSuccess(savedPart);
    } catch (failure) {
      setError(failure);
    } finally {
      isInFlight.current = false;
      setIsSaving(false);
    }
  }

  return { targetStatus, isSaving, isLocked, error, submit };
}
