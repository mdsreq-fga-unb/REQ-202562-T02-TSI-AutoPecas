import { Box, Paper, Stack, TextField, Typography } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SectionNumber from '../../components/SectionNumber.jsx';
import PhotoField from './PhotoField.jsx';

export default function PartFormFields({
  form,
  update,
  errors,
  isLocked,
  isReadingPhoto,
  onReadingPhoto,
  photoVersion = 0,
  isEditing = false,
}) {
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

  return (
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
              {isEditing ? '2 campos obrigatórios' : '3 campos obrigatórios'}
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
                required: !isEditing,
                placeholder: 'Ex.: FLT-100',
                slotProps: {
                  htmlInput: {
                    maxLength: 100,
                    readOnly: isEditing,
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
              placeholder: 'Ex.: ABC-123\nXYZ-456',
              helperText:
                'Informe um código por linha. Vírgulas e ponto e vírgula fazem parte do código.',
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
            key={photoVersion}
            value={form.photo_data}
            onChange={(value) => update('photo_data', value)}
            disabled={isLocked || isReadingPhoto}
            error={errors.photo_data}
            onReading={onReadingPhoto}
          />
        </Paper>
        <Box sx={{ px: 0.5, pt: 0.5 }}>
          <Typography variant="overline" sx={{ fontSize: 10, letterSpacing: 1.6, fontWeight: 700 }}>
            {isEditing ? 'Antes de salvar' : 'Antes de cadastrar'}
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
                <Box component="span" sx={{ color: 'primary.main', mr: 1.5 }} aria-hidden="true">
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
            Cada código principal ou equivalente identifica uma única peça. Se já estiver em uso,
            mostraremos o cadastro correspondente.
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
  );
}
