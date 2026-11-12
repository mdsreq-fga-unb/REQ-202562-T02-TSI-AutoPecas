import { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import DiscardChangesDialog from '../../components/DiscardChangesDialog.jsx';
import PartFormFields from './PartFormFields.jsx';
import usePartEditing from './usePartEditing.js';

export default function PartEditForm({ part, onDone }) {
  const editing = usePartEditing(part);
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const { error, isSaving, isLocked, isDirty, savedPart } = editing;
  useEffect(() => {
    if (!isDirty || savedPart) return;
    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty, savedPart]);

  if (savedPart)
    return (
      <Paper variant="outlined" sx={{ maxWidth: 680, mx: 'auto', p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineRounded sx={{ color: 'success.main', fontSize: 54, mb: 2 }} />
        <Typography
          variant="h1"
          sx={{ fontSize: 28 }}
          tabIndex={-1}
          ref={(element) => element?.focus()}
        >
          Peça atualizada com sucesso
        </Typography>
        <Typography sx={{ mt: 2, overflowWrap: 'anywhere' }}>
          {savedPart.manufacturer_code} · {savedPart.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          As alterações foram salvas no mesmo cadastro.
        </Typography>
        <Button variant="contained" onClick={onDone} sx={{ mt: 3 }}>
          Voltar ao catálogo
        </Button>
      </Paper>
    );
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        Catálogo de peças
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 36, sm: 48 }, mt: 1, mb: 1 }}>
        Editar peça
        <Box component="span" sx={{ color: 'primary.main' }}>
          .
        </Box>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Atualize os detalhes. O código do fabricante permanece o mesmo.
      </Typography>
      <Box component="form" noValidate onSubmit={editing.submit}>
        {error && (
          <Alert severity={error.isUncertain ? 'warning' : 'error'} sx={{ mb: 3 }} role="alert">
            {error.message}
          </Alert>
        )}
        <PartFormFields
          {...editing}
          isEditing
          isReadingPhoto={isReadingPhoto}
          onReadingPhoto={setIsReadingPhoto}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color="secondary"
            disabled={isLocked || isReadingPhoto}
            onClick={() => (isDirty ? setIsDiscardOpen(true) : onDone())}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SaveOutlined />}
            disabled={!isDirty || isSaving || isReadingPhoto}
          >
            {isSaving ? 'Salvando…' : error?.isUncertain ? 'Tentar novamente' : 'Salvar alterações'}
          </Button>
        </Stack>
      </Box>
      <DiscardChangesDialog
        open={isDiscardOpen}
        onContinue={() => setIsDiscardOpen(false)}
        onDiscard={onDone}
      />
    </>
  );
}
