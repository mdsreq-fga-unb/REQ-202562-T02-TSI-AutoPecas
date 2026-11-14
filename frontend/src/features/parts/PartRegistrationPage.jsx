import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import PartFormFields from './PartFormFields.jsx';
import usePartRegistration from './usePartRegistration.js';

export default function PartRegistrationPage({ onEdit, onNavigationStateChange }) {
  const registration = usePartRegistration();
  const { form, update, errors, error, isLocked, isSaving, savedPart } = registration;
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const hasUnsavedChanges = registration.isDirty && !savedPart;
  useEffect(() => {
    onNavigationStateChange?.({
      isDirty: hasUnsavedChanges,
      isLocked: isLocked || isReadingPhoto,
    });
  }, [hasUnsavedChanges, isLocked, isReadingPhoto, onNavigationStateChange]);
  const reset = () => {
    registration.reset();
    setIsResetOpen(false);
    setFormVersion((n) => n + 1);
  };

  if (savedPart)
    return (
      <Paper
        variant="outlined"
        sx={{ maxWidth: 680, mx: 'auto', p: { xs: 3, sm: 5 }, mt: 4, textAlign: 'center' }}
      >
        <CheckCircleOutlineRounded sx={{ color: 'success.main', fontSize: 54, mb: 2 }} />
        <Typography
          variant="h1"
          sx={{ fontSize: 26 }}
          tabIndex={-1}
          ref={(element) => element?.focus()}
        >
          Peça cadastrada com sucesso
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Os dados foram salvos no catálogo.
        </Typography>
        <Box
          sx={{ p: 3, my: 3, bgcolor: 'background.default', borderRadius: 2, textAlign: 'left' }}
        >
          <Typography variant="overline" color="text.secondary">
            {savedPart.manufacturer_code}
          </Typography>
          <Typography variant="h2" sx={{ overflowWrap: 'anywhere' }}>
            {savedPart.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {savedPart.category}
          </Typography>
          {savedPart.equivalent_codes?.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1, overflowWrap: 'anywhere' }}>
              Equivalentes: {savedPart.equivalent_codes.join(', ')}
            </Typography>
          )}
        </Box>
        <Button onClick={() => onEdit(savedPart.id)} sx={{ mr: 1 }}>
          Editar esta peça
        </Button>
        <Button variant="contained" startIcon={<AddRounded />} onClick={reset}>
          Cadastrar outra peça
        </Button>
      </Paper>
    );

  return (
    <>
      <Stack direction="row" sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: 2.5, fontSize: 10, fontWeight: 700 }}
          >
            Organização que move a loja
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.5, mb: 1, fontSize: { xs: 36, sm: 48 } }}>
            Nova peça
            <Box component="span" sx={{ color: 'primary.main' }}>
              .
            </Box>
          </Typography>
          <Typography color="text.secondary">
            Identifique, detalhe e adicione ao seu catálogo.
          </Typography>
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', sm: 'grid' },
            placeItems: 'center',
            width: 90,
            height: 90,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            transform: 'rotate(-7deg)',
            mr: 0.5,
          }}
        >
          <Inventory2Outlined sx={{ color: 'primary.main', fontSize: 44 }} />
        </Box>
      </Stack>
      <Box component="form" noValidate onSubmit={registration.submit}>
        {error && (
          <Alert severity={error.isUncertain ? 'warning' : 'error'} sx={{ mb: 3 }} role="alert">
            {error.message}
          </Alert>
        )}
        <PartFormFields
          form={form}
          update={update}
          errors={errors}
          isLocked={isLocked}
          isReadingPhoto={isReadingPhoto}
          onReadingPhoto={setIsReadingPhoto}
          photoVersion={formVersion}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            py: 3,
            mt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            alignItems: { sm: 'center' },
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            <Box component="span" sx={{ color: 'primary.main' }}>
              *
            </Box>{' '}
            Campos obrigatórios
          </Typography>
          <Button
            color="secondary"
            disabled={isLocked || isReadingPhoto || !registration.isDirty}
            onClick={() => setIsResetOpen(true)}
          >
            Limpar campos
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || isReadingPhoto}
            endIcon={<ArrowForwardRounded />}
            sx={{ minWidth: 185 }}
          >
            {isSaving ? 'Salvando…' : error?.isUncertain ? 'Tentar novamente' : 'Cadastrar peça'}
          </Button>
        </Stack>
      </Box>
      <Dialog open={isResetOpen} onClose={() => setIsResetOpen(false)}>
        <DialogTitle>Limpar este cadastro?</DialogTitle>
        <DialogContent>
          Os dados preenchidos ainda não foram salvos e serão removidos.
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setIsResetOpen(false)}>
            Continuar preenchendo
          </Button>
          <Button onClick={reset} color="primary">
            Limpar cadastro
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
