import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { getPart, getPartPhotoUrl } from '../../services/parts.js';
import StockBalancePanel from '../stock/StockBalancePanel.jsx';
import PartStatusBadge from './PartStatusBadge.jsx';
import PartStatusDialog from './PartStatusDialog.jsx';
import VehicleApplicationsSection from './VehicleApplicationsSection.jsx';

function focusHeading(element) {
  element?.focus();
}

export default function PartDetailsPage({
  partId,
  onBack,
  onEdit,
  onEntry,
  isNavigationLocked,
  onNavigationStateChange,
}) {
  const [state, setState] = useState({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  function finishStatusChange(part) {
    setState({ status: 'ready', part });
    setStatusOpen(false);
    setStatusMessage(
      part.status === 'active' ? 'Peça ativada com sucesso.' : 'Peça inativada com sucesso.',
    );
  }

  const part = state.part;
  const isInactive = part?.status === 'inactive';
  const photo = part && getPartPhotoUrl(part);
  const fields = part && [
    ['Categoria', part.category],
    ['Localização física', part.physical_location],
    ['Códigos equivalentes', part.equivalent_codes?.join(', ')],
    ['Descrição técnica', part.technical_description],
  ];

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackRounded />}
        sx={{ alignSelf: 'flex-start' }}
        disabled={isNavigationLocked}
        onClick={onBack}
      >
        Voltar ao catálogo
      </Button>
      {state.status === 'loading' && <CircularProgress aria-label="Carregando peça" />}
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
      {part && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 3fr) minmax(0, 2fr)' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Box sx={{ overflowWrap: 'anywhere' }}>
              <Typography variant="overline" color="text.secondary">
                {part.manufacturer_code}
              </Typography>
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: 32, sm: 48 }, mb: 1 }}
                tabIndex={-1}
                ref={focusHeading}
              >
                {part.name}
              </Typography>
              <PartStatusBadge status={part.status} />
            </Box>
            <StockBalancePanel
              part={part}
              onEntry={onEntry}
              isNavigationLocked={isNavigationLocked}
            />
          </Box>
          {statusMessage && (
            <Alert severity="success" role="status">
              {statusMessage}
            </Alert>
          )}
          <Paper
            component="section"
            aria-labelledby="part-data-title"
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 }, overflowWrap: 'anywhere' }}
          >
            <Typography id="part-data-title" variant="h2" sx={{ fontSize: 20 }}>
              Dados cadastrais
            </Typography>
            {photo && (
              <Box
                component="img"
                src={photo}
                alt={`Foto de ${part.name}`}
                sx={{
                  display: 'block',
                  mt: 2,
                  maxWidth: '100%',
                  maxHeight: 180,
                  borderRadius: 1,
                }}
              />
            )}
            <Box
              component="dl"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 2,
                my: 2,
              }}
            >
              {fields.map(([label, value]) => (
                <Box key={label}>
                  <Typography component="dt" variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography component="dd" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
                    {value || 'Não informado'}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Button
                variant="outlined"
                aria-label={`Editar ${part.name}`}
                disabled={isNavigationLocked}
                onClick={onEdit}
              >
                Editar dados
              </Button>
              <Button
                color="secondary"
                aria-label={`${isInactive ? 'Ativar' : 'Inativar'} ${part.name}`}
                onClick={() => {
                  setStatusMessage('');
                  setStatusOpen(true);
                }}
                disabled={isNavigationLocked}
              >
                {isInactive ? 'Ativar peça' : 'Inativar peça'}
              </Button>
            </Stack>
          </Paper>
          <VehicleApplicationsSection
            partId={partId}
            onNavigationStateChange={onNavigationStateChange}
          />
          {statusOpen && (
            <PartStatusDialog
              part={part}
              onClose={() => setStatusOpen(false)}
              onSuccess={finishStatusChange}
            />
          )}
        </>
      )}
    </Stack>
  );
}
