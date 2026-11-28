import { useEffect, useRef, useState } from 'react';
import { cancelSale } from '../../services/sales.js';

export default function useSaleCancellation(sale, { onSuccess, onAlreadyCancelled }) {
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
      const result = await cancelSale(sale, attemptKey.current);
      onSuccess(result);
    } catch (failure) {
      if (!failure.isUncertain) attemptKey.current = null;
      if (failure.status === 409 && !failure.isUncertain) onAlreadyCancelled(failure.message);
      else setError(failure);
    } finally {
      isInFlight.current = false;
      setIsSaving(false);
    }
  }

  return { isSaving, isLocked, error, submit };
}
