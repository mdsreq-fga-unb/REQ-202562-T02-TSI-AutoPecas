import { useState } from 'react';
import { Box, Breadcrumbs, Drawer, IconButton, Stack, Typography } from '@mui/material';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import MenuRounded from '@mui/icons-material/MenuRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import logo from '../assets/tsi-pecas-logo.png';

const sidebarWidth = 248;

export default function AppShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box
          component="img"
          src={logo}
          alt="TSI Peças"
          sx={{ width: 145, height: 145, objectFit: 'contain', display: 'block', mx: 'auto' }}
        />
      </Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ fontSize: 10, letterSpacing: 2, mt: 4, mb: 1.5 }}
      >
        Gestão da loja
      </Typography>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          color: 'primary.main',
          bgcolor: 'primary.light',
          p: 1.5,
          borderRadius: 2,
        }}
      >
        <Inventory2Outlined fontSize="small" />
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Catálogo de peças</Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ pl: 3, py: 2, alignItems: 'center' }}
        aria-current="page"
      >
        <AddRounded sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Nova peça
        </Typography>
      </Stack>
      <Box sx={{ mt: 'auto', pt: 4 }}>
        <Box sx={{ width: 28, height: 3, bgcolor: 'primary.main', mb: 1.5 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Cada peça no seu lugar.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Um catálogo organizado começa com um bom cadastro.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box component="a" href="#main-content" className="skip-link">
        Ir para o conteúdo
      </Box>
      <Box
        component="nav"
        aria-label="Navegação principal"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarWidth,
          position: 'fixed',
          inset: '0 auto 0 0',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        {navigation}
      </Box>
      <Drawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        slotProps={{ paper: { sx: { width: sidebarWidth } } }}
      >
        {navigation}
      </Drawer>
      <Box sx={{ ml: { md: `${sidebarWidth}px` } }}>
        <Box
          component="header"
          sx={{
            height: 76,
            px: { xs: 2, md: 5 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRounded />
          </IconButton>
          <Breadcrumbs
            separator={<ChevronRightRounded sx={{ fontSize: 16 }} />}
            aria-label="Localização"
          >
            <Typography variant="body2" color="text.secondary">
              Catálogo
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Nova peça
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="body2"
            sx={{ ml: 'auto', display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}
          >
            TSI Peças{' '}
            <Box component="span" sx={{ mx: 1, color: 'divider' }}>
              /
            </Box>{' '}
            Gestão de catálogo
          </Typography>
        </Box>
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ maxWidth: 1350, mx: 'auto', px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 5 } }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
