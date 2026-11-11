import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PhotoField from './PhotoField.jsx';
import usePartRegistration from './usePartRegistration.js';

export default function PartRegistrationPage() {
  const registration = usePartRegistration();
  const { form, update, errors, error, isLocked, isSaving, savedPart } = registration;
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const reset = () => {
    registration.reset();
    setIsResetOpen(false);
    setFormVersion((n) => n + 1);
  };
  const field = (name, label, options = {}) => (
    <TextField
      name={name}
      label={label}
      value={form[name]}
      onChange={(event) => update(name, event.target.value)}
      disabled={isLocked || isReadingPhoto}
      error={Boolean(errors[name])}
      {...options}
      helperText={errors[name] || options.helperText}
    />
  );

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
        <Button variant="contained" startIcon={<AddRounded />} onClick={reset}>
          Cadastrar outra peça
        </Button>
      </Paper>
    );

  return (
    <>
      <Stack
        direction="row"
        sx={{ mb: 3.5, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box>
          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: 2, fontSize: 10, fontWeight: 700 }}
          >
            Catálogo de peças
          </Typography>
          <Typography variant="h1" sx={{ mt: 0.5, mb: 1 }}>
            Nova peça
          </Typography>
          <Typography color="text.secondary">
            Organize os detalhes da peça para encontrá-la com facilidade.
          </Typography>
        </Box>
        <Chip
          label="Cadastro manual"
          variant="outlined"
          size="small"
          sx={{ display: { xs: 'none', lg: 'flex' }, bgcolor: 'white', fontSize: 11 }}
        />
      </Stack>
      <Box component="form" noValidate onSubmit={registration.submit}>
        {error && (
          <Alert severity={error.isUncertain ? 'warning' : 'error'} sx={{ mb: 3 }} role="alert">
            {error.message}
          </Alert>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <Box className="section-number">01</Box>
                <Box>
                  <Typography variant="h2">Identificação da peça</Typography>
                  <Typography variant="body2" color="text.secondary">
                    As informações essenciais para o seu catálogo.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {field('manufacturer_code', 'Código do fabricante', {
                    required: true,
                    placeholder: 'Ex.: FLT-100',
                    slotProps: { htmlInput: { maxLength: 100 } },
                    helperText: 'Código principal. Não poderá ser alterado depois.',
                  })}
                  {field('category', 'Categoria', {
                    required: true,
                    placeholder: 'Ex.: Filtros',
                    slotProps: { htmlInput: { maxLength: 100 } },
                  })}
                </Box>
                {field('name', 'Nome da peça', {
                  required: true,
                  placeholder: 'Ex.: Filtro de óleo do motor',
                  slotProps: { htmlInput: { maxLength: 200 } },
                })}
                <Divider />
                {field('equivalent_codes', 'Códigos equivalentes (opcional)', {
                  multiline: true,
                  minRows: 2,
                  placeholder: 'Ex.: ABC-123, XYZ-456',
                  helperText:
                    'Códigos de outras marcas. Separe por vírgula ou use uma linha para cada código.',
                  slotProps: { htmlInput: { maxLength: 10200 } },
                })}
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <Box className="section-number">02</Box>
                <Box>
                  <Typography variant="h2">Informações complementares</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preencha o que ajudar na identificação e localização.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={3}>
                {field('physical_location', 'Localização física (opcional)', {
                  placeholder: 'Ex.: Corredor A · Prateleira 02',
                  slotProps: { htmlInput: { maxLength: 200 } },
                })}
                {field('technical_description', 'Descrição técnica (opcional)', {
                  multiline: true,
                  minRows: 3,
                  placeholder: 'Informe características, medidas ou outras especificações da peça.',
                  slotProps: { htmlInput: { maxLength: 5000 } },
                })}
              </Stack>
            </Paper>
          </Stack>
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack
                direction="row"
                sx={{ mb: 2.5, alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography variant="h2">Foto da peça</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
                  Opcional
                </Typography>
              </Stack>
              <PhotoField
                key={formVersion}
                value={form.photo_data}
                onChange={(value) => update('photo_data', value)}
                disabled={isLocked || isReadingPhoto}
                error={errors.photo_data}
                onReading={setIsReadingPhoto}
              />
            </Paper>
            <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: '#eeeff2' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <InfoOutlined sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Um código, uma peça
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Cada código principal ou equivalente identifica uma única peça. Se já estiver em
                uso, mostraremos o cadastro correspondente.
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ py: 3, mt: 1, alignItems: { sm: 'center' } }}
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
