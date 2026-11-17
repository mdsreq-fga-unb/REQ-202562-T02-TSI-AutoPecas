import { Box } from '@mui/material';

export default function SectionNumber({ children }) {
  return (
    <Box
      component="span"
      sx={{
        width: 25,
        height: 25,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '5px',
        fontSize: 11,
        fontWeight: 600,
        bgcolor: 'primary.light',
        color: 'primary.main',
      }}
    >
      {children}
    </Box>
  );
}
