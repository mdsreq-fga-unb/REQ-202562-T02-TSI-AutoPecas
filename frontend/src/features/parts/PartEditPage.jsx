import { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { getPart } from '../../services/parts.js';
import PartEditForm from './PartEditForm.jsx';

export default function PartEditPage({ partId, onDone }) {
  const [state, setState] = useState({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getPart(partId, { signal: controller.signal }).then(
      (part) => {
        if (!controller.signal.aborted) setState({ status: 'ready', part });
      },
      (error) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [partId, retry]);

  if (state.status === 'loading')
    return (
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress aria-label="Carregando peça" />
        <Typography>Carregando peça…</Typography>
        <Button onClick={onDone}>Voltar ao catálogo</Button>
      </Stack>
    );
  if (state.status === 'error')
    return (
      <Stack spacing={2}>
        <Alert severity="error">{state.error.message}</Alert>
        <Button
          onClick={() => {
            setState({ status: 'loading' });
            setRetry((current) => current + 1);
          }}
        >
          Tentar carregar novamente
        </Button>
        <Button onClick={onDone}>Voltar ao catálogo</Button>
      </Stack>
    );
  return <PartEditForm part={state.part} onDone={onDone} />;
}
