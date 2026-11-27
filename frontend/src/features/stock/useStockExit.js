import { useEffect, useRef, useState } from 'react';
import { getPart, getStockBalance, registerStockExit } from '../../services/parts.js';
import { readPendingExit, preserveExit, clearPendingExit } from './pendingStockExit.js';

export default function useStockExit(partId) {
  const [state, setState] = useState({ status: 'loading' });
  const [pending] = useState(() => {
    const saved = readPendingExit();
    return saved?.partId === partId ? saved : null;
  });
  const [form, setForm] = useState(
    pending
      ? { ...pending.data, quantity: String(pending.data.quantity) }
      : { quantity: '', exit_date: '', reason: '' },
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message: 'Saída pendente recuperada. Tente novamente para confirmar a operação.',
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
      (error) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [partId]);
  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = {
      quantity: Number(form.quantity),
      exit_date: form.exit_date,
      // Motivo aparado para o corpo casar com o fingerprint normalizado do back-end.
      reason: form.reason.trim(),
    };
    const fields = {};
    if (
      !/^\d+$/.test(form.quantity.trim()) ||
      !Number.isSafeInteger(data.quantity) ||
      data.quantity <= 0
    )
      fields.quantity = 'Informe uma quantidade inteira maior que zero.';
    const date = new Date(`${data.exit_date}T12:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.exit_date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== data.exit_date
    )
      fields.exit_date = 'Informe uma data válida.';
    const todayParts = Object.fromEntries(
      new Intl.DateTimeFormat('en', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .formatToParts(new Date())
        .map(({ type, value }) => [type, value]),
    );
    const today = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;
    if (!fields.exit_date && data.exit_date > today)
      fields.exit_date = 'Informe hoje ou uma data anterior, no horário de São Paulo.';
    if (!data.reason) fields.reason = 'Informe o motivo da saída.';
    else if (data.reason.length > 120) fields.reason = 'Use no máximo 120 caracteres.';
    if (Object.keys(fields).length) {
      setError({ message: 'Confira os campos indicados.', fields });
      event.currentTarget.querySelector(`[name="${Object.keys(fields)[0]}"]`)?.focus();
      return;
    }
    attempt.current ||= { data, key: crypto.randomUUID() };
    try {
      preserveExit(partId, attempt.current.data, attempt.current.key);
    } catch (failure) {
      if (!error?.isUncertain) attempt.current = null;
      setError({ ...failure, message: failure.message, isUncertain: Boolean(error?.isUncertain) });
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const response = await registerStockExit(partId, attempt.current.data, attempt.current.key);
      setResult(response);
      clearPendingExit(attempt.current.key);
      attempt.current = null;
      try {
        const balance = await getStockBalance(partId);
        setState((current) => ({ ...current, balance }));
      } catch {
        setError({
          message:
            'A saída foi registrada, mas não foi possível atualizar o saldo atual. Volte ao catálogo e consulte novamente.',
        });
        setState((current) => ({ ...current, balance: null }));
      }
    } catch (failure) {
      if (!failure.isUncertain) {
        clearPendingExit(attempt.current.key);
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
