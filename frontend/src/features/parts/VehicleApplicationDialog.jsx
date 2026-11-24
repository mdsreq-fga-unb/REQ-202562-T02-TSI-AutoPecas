import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

export default function VehicleApplicationDialog({ change }) {
  if (!change.application) return null;
  const removing = change.action === 'remove';
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={change.close}
      aria-labelledby="vehicle-change-title"
      aria-describedby="vehicle-change-description"
    >
      <Box component="form" noValidate onSubmit={change.submit}>
        <DialogTitle id="vehicle-change-title">
          {removing ? 'Remover aplicação?' : 'Editar aplicação'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="vehicle-change-description" sx={{ mb: 2 }}>
            {removing
              ? 'Remova somente a associação selecionada.'
              : 'Altere apenas a aplicação selecionada.'}{' '}
            O cadastro da peça e os demais vínculos serão preservados.
          </DialogContentText>
          {change.error && (
            <Alert severity={change.error.isUncertain ? 'warning' : 'error'} sx={{ mb: 2 }}>
              {change.error.message}
            </Alert>
          )}
          {removing ? (
            <DialogContentText sx={{ overflowWrap: 'anywhere' }}>
              {change.application.brand} · {change.application.model} · {change.application.year}
            </DialogContentText>
          ) : (
            <Stack spacing={2}>
              {Object.entries({ brand: 'Marca', model: 'Modelo', year: 'Ano' }).map(
                ([name, label]) => (
                  <TextField
                    key={name}
                    label={label}
                    name={name}
                    required
                    fullWidth
                    value={change.form[name]}
                    disabled={change.isLocked}
                    error={Boolean(change.errors[name])}
                    helperText={
                      change.errors[name] ||
                      (name === 'year' ? 'Um único ano de quatro dígitos.' : ' ')
                    }
                    slotProps={{
                      htmlInput:
                        name === 'year'
                          ? { inputMode: 'numeric' }
                          : { maxLength: name === 'brand' ? 100 : 200 },
                    }}
                    onChange={(event) => change.update(name, event.target.value)}
                  />
                ),
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={change.close} disabled={change.isLocked}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={change.isSaving}>
            {change.isSaving
              ? 'Salvando…'
              : change.error?.isUncertain
                ? 'Tentar novamente'
                : removing
                  ? 'Confirmar remoção'
                  : 'Salvar aplicação'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
