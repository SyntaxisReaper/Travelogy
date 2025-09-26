import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider as MDivider,
} from '@mui/material';
import {
  Dashboard,
  DirectionsWalk,
  Analytics,
  ColorLens,
  Public,
  Menu as MenuIcon,
  MoreHoriz,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  themeMode?: 'light' | 'dark';
  themeFont?: 'tech' | 'system' | 'mono' | 'grotesk';
  accent?: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'blue' | 'teal' | 'amber';
  onChangeThemeMode?: (m: 'light' | 'dark') => void;
  onChangeThemeFont?: (f: 'tech' | 'system' | 'mono' | 'grotesk') => void;
  onChangeAccent?: (a: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'blue' | 'teal' | 'amber') => void;
}

const Navbar: React.FC<NavbarProps> = ({ themeMode = 'dark', themeFont = 'tech', accent = 'cyan', onChangeThemeMode, onChangeThemeFont, onChangeAccent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [themeAnchor, setThemeAnchor] = React.useState<null | HTMLElement>(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Trips', path: '/trips', icon: <DirectionsWalk /> },
    { label: 'Weather', path: '/weather', icon: <Public /> },
    { label: 'Journal', path: '/journal', icon: <Analytics /> },
    { label: 'Analytics', path: '/analytics', icon: <Analytics /> },
    { label: 'Bookings', path: '/book', icon: <DirectionsWalk /> },
    { label: 'Stores', path: '/stores', icon: <DirectionsWalk /> },
    { label: 'Contact', path: '/contact', icon: <AccountCircle /> },
  ];

  return (
    <>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Mobile menu button (left) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton color="inherit" aria-label="Open navigation menu" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, fontWeight: 'bold', color: 'inherit', textDecoration: 'none', cursor: 'pointer', ml: { xs: 1, md: 0 } }}
        >
          🌍 TraveLogy
        </Typography>

        {/* Desktop / tablet nav (scrollable if overflow) */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          gap: 1,
          maxWidth: '100%',
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          '::-webkit-scrollbar': { height: 6 },
          '::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.3)', borderRadius: 3 },
        }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                flex: '0 0 auto',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile menu button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton color="inherit" aria-label="Open navigation menu" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Button
            color="inherit"
            startIcon={<ColorLens />}
            onClick={(e) => setThemeAnchor(e.currentTarget)}
            sx={{
              mr: 1,
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              textTransform: 'none',
            }}
          >
            Theme
          </Button>
          <Menu anchorEl={themeAnchor} open={Boolean(themeAnchor)} onClose={() => setThemeAnchor(null)}>
            <MenuItem disabled>Mode</MenuItem>
            <MenuItem selected={themeMode==='dark'} onClick={() => { onChangeThemeMode?.('dark'); setThemeAnchor(null); }}>Dark</MenuItem>
            <MenuItem selected={themeMode==='light'} onClick={() => { onChangeThemeMode?.('light'); setThemeAnchor(null); }}>Light</MenuItem>
            <MenuItem disabled>Font</MenuItem>
            <MenuItem selected={themeFont==='tech'} onClick={() => { onChangeThemeFont?.('tech'); setThemeAnchor(null); }}>Tech</MenuItem>
            <MenuItem selected={themeFont==='system'} onClick={() => { onChangeThemeFont?.('system'); setThemeAnchor(null); }}>System</MenuItem>
            <MenuItem selected={themeFont==='mono'} onClick={() => { onChangeThemeFont?.('mono'); setThemeAnchor(null); }}>Mono</MenuItem>
            <MenuItem selected={themeFont==='grotesk'} onClick={() => { onChangeThemeFont?.('grotesk'); setThemeAnchor(null); }}>Grotesk</MenuItem>
          </Menu>

          {/* Auth buttons (always visible in public app) */}
          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{
              ml: 1,
              display: { xs: 'none', md: 'inline-flex' },
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Sign In
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="secondary"
            sx={{
              ml: 1,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setMobileOpen(false)} onKeyDown={() => setMobileOpen(false)}>
          <Typography variant="h6" sx={{ p: 2 }}>Menu</Typography>
          <MDivider />
          <List>
            {navigationItems.map((item) => (
              <ListItemButton key={item.path} onClick={() => navigate(item.path)} selected={location.pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <MDivider sx={{ my: 1 }} />
            <ListItemButton onClick={() => navigate('/login')} selected={location.pathname === '/login'}>
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/register')} selected={location.pathname === '/register'}>
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="Get Started" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

    </AppBar>
    </>
  );
};

export default Navbar;
