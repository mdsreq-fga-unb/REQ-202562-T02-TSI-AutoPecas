import { useState } from 'react';
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
  TextField,
  Typography,
} from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import SectionNumber from '../../components/SectionNumber.jsx';
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
    <Box>
      <Typography component="label" htmlFor={name} variant="body2" sx={{ display: 'block', mb: 1 }}>
        {label}
        {options.required && (
          <Box component="span" sx={{ color: 'primary.main' }}>
            {' '}
            *
          </Box>
        )}
      </Typography>
      <TextField
        id={name}
        name={name}
        value={form[name]}
        onChange={(event) => update(name, event.target.value)}
        disabled={isLocked || isReadingPhoto}
        error={Boolean(errors[name])}
        {...options}
        helperText={errors[name] || options.helperText}
      />
    </Box>
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <SectionNumber>1</SectionNumber>
                <Typography variant="h2" sx={{ flex: 1 }}>
                  Identificação
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: 10,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 0.5,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  3 campos obrigatórios
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
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
                    slotProps: {
                      htmlInput: {
                        maxLength: 100,
                        'aria-describedby': errors.manufacturer_code
                          ? 'manufacturer-code-help manufacturer_code-helper-text'
                          : 'manufacturer-code-help',
                      },
                    },
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
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', color: 'text.secondary' }}
                >
                  <InfoOutlined sx={{ fontSize: 15 }} />
                  <Typography id="manufacturer-code-help" variant="body2">
                    O código principal é permanente após o cadastro.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
                <SectionNumber>2</SectionNumber>
                <Typography variant="h2" sx={{ flex: 1 }}>
                  Referências e detalhes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10 }}>
                  Opcional
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
                {field('equivalent_codes', 'Códigos equivalentes (opcional)', {
                  multiline: true,
                  minRows: 1,
                  placeholder: 'Ex.: ABC-123, XYZ-456',
                  helperText:
                    'Códigos de outras marcas. Separe por vírgula ou use uma linha para cada código.',
                  slotProps: { htmlInput: { maxLength: 10200 } },
                })}
                {field('physical_location', 'Localização física (opcional)', {
                  placeholder: 'Ex.: Corredor A · Prateleira 02',
                  slotProps: { htmlInput: { maxLength: 200 } },
                })}
                {field('technical_description', 'Descrição técnica (opcional)', {
                  multiline: true,
                  minRows: 2,
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
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <SectionNumber>3</SectionNumber>
                  <Typography variant="h2">Foto da peça</Typography>
                </Stack>
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
            <Box sx={{ px: 0.5, pt: 0.5 }}>
              <Typography
                variant="overline"
                sx={{ fontSize: 10, letterSpacing: 1.6, fontWeight: 700 }}
              >
                Antes de cadastrar
              </Typography>
              <Stack
                component="ul"
                spacing={1.5}
                sx={{ listStyle: 'none', pl: 0, my: 2, color: 'text.secondary' }}
              >
                {[
                  'Código principal exclusivo',
                  'Equivalentes sem repetição',
                  'Nome e categoria preenchidos',
                ].map((text) => (
                  <Typography component="li" variant="body2" key={text}>
                    <Box
                      component="span"
                      sx={{ color: 'primary.main', mr: 1.5 }}
                      aria-hidden="true"
                    >
                      •
                    </Box>
                    {text}
                  </Typography>
                ))}
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5, mt: 3 }}
              >
                Cada código principal ou equivalente identifica uma única peça. Se já estiver em
                uso, mostraremos o cadastro correspondente.
              </Typography>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', fontSize: 10, letterSpacing: 1, mt: 3 }}
              >
                Menos tempo procurando.
                <br />
                Mais tempo vendendo.
              </Typography>
            </Box>
          </Stack>
        </Box>
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
