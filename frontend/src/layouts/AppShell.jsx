import { useState } from 'react';
import { Box, Breadcrumbs, Drawer, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import MenuRounded from '@mui/icons-material/MenuRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import logo from '../assets/tsi-pecas-logo.png';

const SIDEBAR_WIDTH = 130;

export default function AppShell({ children, mode, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1.75, py: 3 }}>
      <Box
        component="img"
        src={logo}
        alt="TSI Peças"
        sx={{
          width: 90,
          height: 90,
          objectFit: 'contain',
          bgcolor: '#fff',
          borderRadius: 1.5,
          mx: 'auto',
        }}
      />
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ textAlign: 'center', fontSize: 10, letterSpacing: 2, mt: 5, mb: 3 }}
      >
        Gestão
      </Typography>
      <Stack spacing={1} sx={{ alignItems: 'center', color: 'text.secondary', py: 2 }}>
        <Inventory2Outlined fontSize="small" />
        <Typography variant="body2">Catálogo</Typography>
      </Stack>
      <Stack
        spacing={1}
        aria-current="page"
        sx={{
          alignItems: 'center',
          bgcolor: '#c9002c',
          color: '#fff',
          py: 2.5,
          mt: 1.5,
          borderRadius: 1,
        }}
      >
        <AddRounded />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Nova peça
        </Typography>
      </Stack>
      <Box sx={{ mt: 'auto', pt: 5, px: 1 }}>
        <Box sx={{ width: 24, height: 4, bgcolor: 'primary.main', mb: 2 }} />
        <Typography sx={{ fontSize: 23, lineHeight: 1.2, color: 'text.secondary' }}>TSI</Typography>
        <Typography sx={{ fontSize: 23, fontWeight: 700 }}>Peças.</Typography>
      </Box>
    </Box>
  );
  const themeLabel = mode === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';
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
          width: SIDEBAR_WIDTH,
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
        slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH } } }}
      >
        {navigation}
      </Drawer>
      <Box sx={{ ml: { md: `${SIDEBAR_WIDTH}px` } }}>
        <Box
          component="header"
          sx={{
            minHeight: 76,
            px: { xs: 2, md: 6 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
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
          <Breadcrumbs separator="/" aria-label="Localização">
            <Typography variant="body2" color="text.secondary">
              Catálogo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cadastro de peça
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1} sx={{ ml: 'auto', alignItems: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>
                ●
              </Box>
              Cadastro manual
            </Typography>
            <Tooltip title={themeLabel}>
              <IconButton aria-label={themeLabel} onClick={onToggleTheme}>
                {mode === 'light' ? (
                  <DarkModeOutlined fontSize="small" />
                ) : (
                  <LightModeOutlined fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, lg: 6 }, py: { xs: 3, md: 5 } }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
