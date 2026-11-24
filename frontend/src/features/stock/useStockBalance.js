import { useEffect, useState } from 'react';
import { getStockBalance } from '../../services/parts.js';

export default function useStockBalance(partId) {
  const [state, setState] = useState({ status: 'loading' });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getStockBalance(partId, { signal: controller.signal }).then(
      (balance) => {
        if (!controller.signal.aborted) setState({ status: 'ready', balance });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: 'error' });
      },
    );
    return () => controller.abort();
  }, [partId, revision]);
  function refresh() {
    setState({ status: 'loading' });
    setRevision((current) => current + 1);
  }
  return { state, refresh };
}
