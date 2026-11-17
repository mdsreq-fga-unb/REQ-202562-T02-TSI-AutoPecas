import { useEffect, useRef, useState } from 'react';
import { getPart, getStockBalance, registerStockEntry } from '../../services/parts.js';
import { readPendingEntry, preserveEntry, clearPendingEntry } from './pendingStockEntry.js';

export default function useStockEntry(partId) {
  const [state, setState] = useState({ status: 'loading' });
  const [pending] = useState(() => {
    const saved = readPendingEntry();
    return saved?.partId === partId ? saved : null;
  });
  const [form, setForm] = useState(
    pending
      ? { ...pending.data, quantity: String(pending.data.quantity) }
      : { quantity: '', entry_date: '', unit_cost: '' },
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message: 'Entrada pendente recuperada. Tente novamente para confirmar a operação.',
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
      entry_date: form.entry_date,
      unit_cost: form.unit_cost.trim().replace(',', '.'),
    };
    const fields = {};
    if (
      !/^\d+$/.test(form.quantity.trim()) ||
      !Number.isSafeInteger(data.quantity) ||
      data.quantity <= 0
    )
      fields.quantity = 'Informe uma quantidade inteira maior que zero.';
    if (!/^\d+(?:\.\d{1,2})?$/.test(data.unit_cost))
      fields.unit_cost = 'Informe um custo não negativo com até duas casas decimais.';
    const date = new Date(`${data.entry_date}T12:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.entry_date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== data.entry_date
    )
      fields.entry_date = 'Informe uma data válida.';
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
    if (!fields.entry_date && data.entry_date > today)
      fields.entry_date = 'Informe hoje ou uma data anterior, no horário de São Paulo.';
    if (Object.keys(fields).length) {
      setError({ message: 'Confira os campos indicados.', fields });
      event.currentTarget.querySelector(`[name="${Object.keys(fields)[0]}"]`)?.focus();
      return;
    }
    attempt.current ||= { data, key: crypto.randomUUID() };
    try {
      preserveEntry(partId, attempt.current.data, attempt.current.key);
    } catch (failure) {
      if (!error?.isUncertain) attempt.current = null;
      setError({ ...failure, message: failure.message, isUncertain: Boolean(error?.isUncertain) });
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const response = await registerStockEntry(partId, attempt.current.data, attempt.current.key);
      setResult(response);
      clearPendingEntry(attempt.current.key);
      attempt.current = null;
      try {
        const balance = await getStockBalance(partId);
        setState((current) => ({ ...current, balance }));
      } catch {
        setError({
          message:
            'A entrada foi registrada, mas não foi possível atualizar o saldo atual. Volte ao catálogo e consulte novamente.',
        });
        setState((current) => ({ ...current, balance: null }));
      }
    } catch (failure) {
      if (!failure.isUncertain) {
        clearPendingEntry(attempt.current.key);
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
