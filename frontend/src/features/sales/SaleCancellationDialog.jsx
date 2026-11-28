import { useEffect } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import useSaleCancellation from './useSaleCancellation.js';

export default function SaleCancellationDialog({
  sale,
  label,
  onClose,
  onSuccess,
  onAlreadyCancelled,
  onLockChange,
}) {
  const { isSaving, isLocked, error, submit } = useSaleCancellation(sale, {
    onSuccess,
    onAlreadyCancelled,
  });
  useEffect(() => {
    onLockChange?.(isLocked);
    return () => onLockChange?.(false);
  }, [isLocked, onLockChange]);
  return (
    <Dialog
      open
      onClose={() => {
        if (!isLocked) onClose();
      }}
      aria-labelledby="sale-cancellation-title"
      aria-describedby="sale-cancellation-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="sale-cancellation-title">Cancelar venda?</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>{label}</Typography>
        <DialogContentText id="sale-cancellation-description" component="div">
          As quantidades abaixo voltarão ao estoque. A venda será mantida no registro, marcada como
          cancelada.
          <Stack component="ul" spacing={0.5} sx={{ mt: 1, mb: 0, pl: 3 }}>
            {sale.items.map((entry) => (
              <li key={entry.part_id}>
                {entry.quantity} un. de {entry.manufacturer_code} · {entry.name}
              </li>
            ))}
          </Stack>
        </DialogContentText>
        {error && (
          <Alert severity={error.isUncertain ? 'warning' : 'error'} sx={{ mt: 2 }}>
            {error.message}
            {error.items?.length > 0 && (
              <Stack component="ul" spacing={0.5} sx={{ mt: 1, mb: 0, pl: 3 }}>
                {error.items.map((part) => (
                  <li key={part.part_id}>
                    {part.manufacturer_code} · {part.name}
                  </li>
                ))}
              </Stack>
            )}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1, p: 2 }}>
        <Button onClick={onClose} disabled={isLocked} sx={{ minHeight: 44 }}>
          Manter venda
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={submit}
          disabled={isSaving}
          sx={{ minHeight: 44 }}
        >
          {isSaving
            ? 'Cancelando…'
            : error?.isUncertain
              ? 'Tentar novamente'
              : 'Confirmar cancelamento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
