import { useEffect, useRef, useState } from 'react';
import { getPart, getStockBalance, registerStockAdjustment } from '../../services/parts.js';
import {
  clearPendingAdjustment,
  preserveAdjustment,
  readPendingAdjustment,
} from './pendingStockAdjustment.js';

function formatDeltaInput(delta) {
  return delta > 0 ? `+${delta}` : String(delta);
}

export default function useStockAdjustment(partId) {
  const [state, setState] = useState({ status: 'loading' });
  const [pending] = useState(() => {
    const saved = readPendingAdjustment();
    return saved?.partId === partId ? saved : null;
  });
  const [form, setForm] = useState(
    pending
      ? {
          quantity_delta: formatDeltaInput(pending.data.quantity_delta),
          justification: pending.data.justification,
        }
      : { quantity_delta: '', justification: '' },
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message: 'Ajuste pendente recuperado. Tente novamente para confirmar a operação.',
        }
      : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const attempt = useRef(pending);
  const inFlight = useRef(false);
  const isLocked = isSaving || Boolean(error?.isUncertain);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getPart(partId, { signal: controller.signal }),
      getStockBalance(partId, { signal: controller.signal }),
    ]).then(
      ([part, balance]) => {
        if (!controller.signal.aborted) setState({ status: 'ready', part, balance });
      },
      (failure) => {
        if (!controller.signal.aborted) setState({ status: 'error', error: failure });
      },
    );
    return () => controller.abort();
  }, [partId]);

  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const rawDelta = form.quantity_delta.trim();
    const delta = Number(rawDelta);
    const data = {
      quantity_delta: delta,
      // Justificativa aparada para o corpo casar com o fingerprint normalizado do back-end.
      justification: form.justification.trim(),
    };
    const fields = {};
    if (!/^[+-]?\d+$/.test(rawDelta) || !Number.isSafeInteger(delta) || delta === 0)
      fields.quantity_delta = 'Informe uma diferença inteira diferente de zero (ex.: +2 ou -3).';
    if (!data.justification) fields.justification = 'Informe a justificativa do ajuste.';
    else if (data.justification.length > 120)
      fields.justification = 'Use no máximo 120 caracteres.';
    if (Object.keys(fields).length) {
      setError({ message: 'Confira os campos indicados.', fields });
      event.currentTarget.querySelector(`[name="${Object.keys(fields)[0]}"]`)?.focus();
      return;
    }
    attempt.current ||= { data, key: crypto.randomUUID() };
    try {
      preserveAdjustment(partId, attempt.current.data, attempt.current.key);
    } catch (failure) {
      if (!error?.isUncertain) attempt.current = null;
      setError({ ...failure, message: failure.message, isUncertain: Boolean(error?.isUncertain) });
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const response = await registerStockAdjustment(
        partId,
        attempt.current.data,
        attempt.current.key,
      );
      setResult(response);
      clearPendingAdjustment(attempt.current.key);
      attempt.current = null;
      try {
        const balance = await getStockBalance(partId);
        setState((current) => ({ ...current, balance }));
      } catch {
        setError({
          message:
            'O ajuste foi registrado, mas não foi possível atualizar o saldo atual. Volte ao catálogo e consulte novamente.',
        });
        setState((current) => ({ ...current, balance: null }));
      }
    } catch (failure) {
      if (!failure.isUncertain) {
        clearPendingAdjustment(attempt.current.key);
        attempt.current = null;
      }
      setError(failure);
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  }

  return { state, form, setForm, result, error, isLocked, isSaving, submit };
}
