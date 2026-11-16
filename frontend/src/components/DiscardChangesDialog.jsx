import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function DiscardChangesDialog({ open, onContinue, onDiscard }) {
  return (
    <Dialog open={open} onClose={onContinue}>
      <DialogTitle>Descartar alterações?</DialogTitle>
      <DialogContent>Os dados ainda não salvos serão perdidos.</DialogContent>
      <DialogActions>
        <Button onClick={onContinue}>Continuar editando</Button>
        <Button onClick={onDiscard}>Descartar alterações</Button>
      </DialogActions>
    </Dialog>
  );
}
