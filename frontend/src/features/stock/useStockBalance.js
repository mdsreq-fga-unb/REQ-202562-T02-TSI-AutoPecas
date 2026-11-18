import { useEffect, useState } from 'react';
import { getPart, getStockBalance } from '../../services/parts.js';

export default function useStockBalance(partId) {
  const [state, setState] = useState({ status: 'loading' });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getPart(partId, { signal: controller.signal }),
      getStockBalance(partId, { signal: controller.signal }),
    ]).then(
      ([part, balance]) => {
        if (!controller.signal.aborted) setState({ status: 'ready', part, balance });
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
