import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
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
  AccountCircle,
  ExitToApp,
  ColorLens,
  Public,
  Menu as MenuIcon,
  MoreHoriz,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import type { Auth } from 'firebase/auth';

interface NavbarProps {
  themeStyle?: 'calm' | 'dynamic';
  onToggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ themeStyle = 'calm', onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const fallbackInitial = user?.first_name?.[0] || user?.email?.[0] || 'U';

  const authInstance = auth as Auth | null;

  const FirebaseAvatarWithAuth: React.FC<{ fallback: string }> = ({ fallback }) => {
    const [fbUser] = useAuthState(auth as Auth);
    const src = fbUser?.photoURL || user?.photo_url || undefined;
    const letter = fbUser?.displayName?.[0] || fbUser?.email?.[0] || user?.first_name?.[0] || fallback;
    return (
      <Avatar src={src} alt={fbUser?.displayName || fbUser?.email || user?.full_name || 'User'} sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
        {!src ? letter : null}
      </Avatar>
    );
  };

  const FallbackAvatar: React.FC<{ fallback: string }> = ({ fallback }) => (
    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
      {fallback}
    </Avatar>
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const handleProfileNavigate = () => {
    navigate('/profile');
    handleClose();
  };

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
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, fontWeight: 'bold', color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
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
            onClick={onToggleTheme}
            sx={{
              mr: 1,
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              textTransform: 'none',
            }}
          >
            Theme: {themeStyle === 'dynamic' ? 'Dynamic' : 'Calm'}
          </Button>
          <IconButton onClick={handleProfileClick} color="inherit">
            {authInstance ? (
              <FirebaseAvatarWithAuth fallback={fallbackInitial} />
            ) : (
              <FallbackAvatar fallback={fallbackInitial} />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileNavigate}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
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
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;