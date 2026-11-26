import { useRef, useState } from 'react';
import { getStockBalance, searchParts } from '../../services/parts.js';
import { registerSale } from '../../services/sales.js';
import { clearPendingSale, preserveSale, readPendingSale } from './pendingSale.js';

export const CHANNELS = [
  ['counter', 'Balcão'],
  ['mercado_livre', 'Mercado Livre'],
  ['direct_contact', 'Contato direto'],
];

const priceFormat = /^\d+(?:\.\d{1,2})?$/;

export function toCents(price) {
  const [reais, cents = ''] = price.split('.');
  return Number(reais) * 100 + Number(cents.padEnd(2, '0'));
}

export function formatMoney(cents) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function useSaleRegistration() {
  const [pending] = useState(readPendingSale);
  const [channel, setChannel] = useState(pending?.data.channel ?? '');
  const [items, setItems] = useState(() =>
    pending
      ? pending.data.items.map((item, index) => ({
          part: pending.display[index],
          balance: null,
          quantity: String(item.quantity),
          unit_price: item.unit_price,
        }))
      : [],
  );
  const [search, setSearch] = useState({ status: 'idle', term: '', results: [] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(
    pending
      ? {
          isUncertain: true,
          message: 'Venda pendente recuperada. Tente novamente para confirmar a operação.',
        }
      : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const attempt = useRef(pending);
  const inFlight = useRef(false);
  const isLocked = isSaving || Boolean(error?.isUncertain);
  const total = items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const price = item.unit_price.trim().replace(',', '.');
    return Number.isSafeInteger(quantity) && quantity > 0 && priceFormat.test(price)
      ? sum + quantity * toCents(price)
      : sum;
  }, 0);

  async function find(term) {
    const value = term.trim();
    if (!value) return;
    setSearch({ status: 'loading', term: value, results: [] });
    try {
      let page = await searchParts({ name: value });
      if (!page.items.length) page = await searchParts({ code: value });
      setSearch({ status: 'ready', term: value, results: page.items });
    } catch {
      setSearch({ status: 'error', term: value, results: [] });
    }
  }

  async function addPart(part) {
    if (isLocked || items.some((item) => item.part.id === part.id)) return false;
    setResult(null);
    setError(null);
    attempt.current = null;
    let balance = null;
    try {
      balance = (await getStockBalance(part.id)).stock_balance;
    } catch {
      // O saldo é apenas informativo; a API decide a venda.
    }
    setItems((current) =>
      current.some((item) => item.part.id === part.id)
        ? current
        : [
            ...current,
            {
              part: { id: part.id, name: part.name, manufacturer_code: part.manufacturer_code },
              balance,
              quantity: '',
              unit_price: '',
            },
          ],
    );
    return true;
  }

  function changeItem(index, changes) {
    if (isLocked) return;
    attempt.current = null;
    setItems((current) =>
      current.map((item, position) => (position === index ? { ...item, ...changes } : item)),
    );
  }

  function removeItem(index) {
    if (isLocked) return;
    attempt.current = null;
    setItems((current) => current.filter((_, position) => position !== index));
  }

  function changeChannel(value) {
    if (isLocked) return;
    attempt.current = null;
    setChannel(value);
  }

  function reset() {
    setItems([]);
    setChannel('');
    setResult(null);
    setError(null);
    setSearch({ status: 'idle', term: '', results: [] });
  }

  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const fields = {};
    if (!items.length) fields.items = 'Adicione ao menos uma peça à venda.';
    if (!CHANNELS.some(([value]) => value === channel))
      fields.channel = 'Selecione o canal de origem da venda.';
    const itemFields = items.map((item) => {
      const problems = {};
      const quantity = item.quantity.trim();
      if (
        !/^\d+$/.test(quantity) ||
        !Number.isSafeInteger(Number(quantity)) ||
        Number(quantity) < 1
      )
        problems.quantity = 'Informe uma quantidade inteira maior que zero.';
      if (!priceFormat.test(item.unit_price.trim().replace(',', '.')))
        problems.unit_price = 'Informe um preço não negativo com até duas casas decimais.';
      return problems;
    });
    if (Object.keys(fields).length || itemFields.some((problems) => Object.keys(problems).length)) {
      setError({ message: 'Confira os campos indicados.', fields, itemFields });
      return;
    }
    const data = {
      channel,
      items: items.map((item) => ({
        part_id: item.part.id,
        quantity: Number(item.quantity.trim()),
        unit_price: item.unit_price.trim().replace(',', '.'),
      })),
    };
    const display = items.map((item) => item.part);
    attempt.current ||= { data, key: crypto.randomUUID() };
    try {
      preserveSale(attempt.current.data, display, attempt.current.key);
    } catch (failure) {
      if (!error?.isUncertain) attempt.current = null;
      setError({ message: failure.message, isUncertain: Boolean(error?.isUncertain) });
      return;
    }
    inFlight.current = true;
    setIsSaving(true);
    setError(null);
    try {
      const response = await registerSale(attempt.current.data, attempt.current.key);
      setResult({ ...response, parts: display });
      clearPendingSale(attempt.current.key);
      attempt.current = null;
    } catch (failure) {
      if (!failure.isUncertain) {
        clearPendingSale(attempt.current.key);
        attempt.current = null;
      }
      setError(failure);
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  }

  return {
    channel,
    items,
    search,
    result,
    error,
    isLocked,
    isSaving,
    total,
    find,
    addPart,
    changeItem,
    removeItem,
    changeChannel,
    reset,
    submit,
  };
}
