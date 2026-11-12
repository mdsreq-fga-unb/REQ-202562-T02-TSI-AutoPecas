import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { listParts } from '../../services/parts.js';

export default function PartCatalogPage({ onEdit, onCreate }) {
  const [offset, setOffset] = useState(0);
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    listParts(offset, { signal: controller.signal }).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: 'ready', ...data });
      },
      (error) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [offset, retry]);
  function changePage(next) {
    setState({ status: 'loading' });
    setOffset(next);
  }
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 4 }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 36, sm: 48 } }}>
            Catálogo de peças
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Selecione uma peça para atualizar seu cadastro.
          </Typography>
        </Box>
        <Button variant="contained" onClick={onCreate} sx={{ alignSelf: 'flex-start' }}>
          Cadastrar peça
        </Button>
      </Stack>
      {state.status === 'loading' && <CircularProgress aria-label="Carregando catálogo" />}
      {state.status === 'error' && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() => {
                setState({ status: 'loading' });
                setRetry((current) => current + 1);
              }}
            >
              Tentar novamente
            </Button>
          }
        >
          {state.error.message}
        </Alert>
      )}
      {state.status === 'ready' && (
        <>
          {state.items.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 4 }}>
              <Typography>Nenhuma peça cadastrada.</Typography>
            </Paper>
          ) : (
            <Stack component="ul" spacing={2} sx={{ p: 0, listStyle: 'none' }}>
              {state.items.map((part) => (
                <Paper component="li" variant="outlined" key={part.id} sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ alignItems: { sm: 'center' } }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                      <Typography variant="overline" color="text.secondary">
                        {part.manufacturer_code}
                      </Typography>
                      <Typography variant="h2">{part.name}</Typography>
                      <Typography color="text.secondary">{part.category}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {part.physical_location || 'Localização não informada'}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<EditOutlined />}
                      aria-label={`Editar ${part.name}`}
                      onClick={() => onEdit(part.id)}
                    >
                      Editar
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 3, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Button disabled={offset === 0} onClick={() => changePage(Math.max(0, offset - 20))}>
              Anterior
            </Button>
            <Typography variant="body2">
              {state.total} peça(s) · Página {Math.floor(offset / 20) + 1}
            </Typography>
            <Button disabled={offset + 20 >= state.total} onClick={() => changePage(offset + 20)}>
              Próxima
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
