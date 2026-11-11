import { useRef, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import AddPhotoAlternateOutlined from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';

export default function PhotoField({ value, onChange, disabled, error, onReading }) {
  const input = useRef(null);
  const [fileError, setFileError] = useState('');
  const [fileName, setFileName] = useState('');

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFileError('');
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setFileError('Selecione uma foto JPG, PNG ou WebP de até 2 MB.');
      return;
    }
    const reader = new FileReader();
    onReading(true);
    reader.onload = () => {
      onChange(reader.result);
      setFileName(file.name);
      onReading(false);
    };
    reader.onerror = () => {
      setFileError('Não foi possível ler a foto. Selecione o arquivo novamente.');
      onReading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          minHeight: 218,
          bgcolor: '#fafbfc',
          border: '1px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {value ? (
          <Box
            component="img"
            src={value}
            alt="Prévia da peça"
            sx={{ width: '100%', height: 185, objectFit: 'contain', borderRadius: 1 }}
          />
        ) : (
          <Stack spacing={1} sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                lineHeight: 0,
              }}
            >
              <AddPhotoAlternateOutlined sx={{ color: '#9299a4', fontSize: 30 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Uma imagem ajuda a identificar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adicione uma foto da peça.
            </Typography>
          </Stack>
        )}
      </Box>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Foto da peça"
        onChange={selectPhoto}
        hidden
        disabled={disabled}
      />
      {fileName && value && (
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
          {fileName}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<AddPhotoAlternateOutlined />}
        onClick={() => input.current.click()}
        disabled={disabled}
      >
        {value ? 'Trocar foto' : 'Selecionar foto'}
      </Button>
      {value && (
        <Button
          color="secondary"
          startIcon={<DeleteOutlineRounded />}
          disabled={disabled}
          onClick={() => {
            onChange(null);
            setFileName('');
            setFileError('');
          }}
        >
          Remover foto
        </Button>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 11 }}>
        JPG, PNG ou WebP · Até 2 MB e 12 megapixels
      </Typography>
      {(fileError || error) && <Alert severity="error">{fileError || error}</Alert>}
    </Stack>
  );
}
