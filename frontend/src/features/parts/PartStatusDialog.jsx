import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import usePartStatusChange from './usePartStatusChange.js';

export default function PartStatusDialog({ part, onClose, onSuccess }) {
  const { targetStatus, isSaving, isLocked, error, submit } = usePartStatusChange(part, onSuccess);
  const isActivating = targetStatus === 'active';
  return (
    <Dialog
      open
      onClose={() => {
        if (!isLocked) onClose();
      }}
      aria-labelledby="part-status-title"
      aria-describedby="part-status-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="part-status-title">
        {isActivating ? 'Ativar peça?' : 'Inativar peça?'}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, overflowWrap: 'anywhere' }}>
          {part.manufacturer_code} · {part.name}
        </Typography>
        <DialogContentText id="part-status-description">
          {isActivating ? 'A peça será marcada como ativa.' : 'A peça será marcada como inativa.'} O
          cadastro será preservado e continuará visível no catálogo.
        </DialogContentText>
        {error && (
          <Alert severity={error.isUncertain ? 'warning' : 'error'} sx={{ mt: 2 }}>
            {error.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1, p: 2 }}>
        <Button onClick={onClose} disabled={isLocked}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={submit} disabled={isSaving}>
          {isSaving
            ? 'Salvando…'
            : error?.isUncertain
              ? 'Tentar novamente'
              : isActivating
                ? 'Confirmar ativação'
                : 'Confirmar inativação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
