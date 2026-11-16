import { Chip } from '@mui/material';

export default function PartStatusBadge({ status }) {
  const isActive = status === 'active';
  return (
    <Chip
      label={isActive ? 'Ativo' : 'Inativo'}
      color={isActive ? 'success' : 'default'}
      variant="outlined"
      size="small"
    />
  );
}
