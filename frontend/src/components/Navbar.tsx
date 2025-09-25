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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { auth } from '../services/firebase';
import type { Auth, User } from 'firebase/auth';
import { signOutUser } from '../services/authService';

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [themeAnchor, setThemeAnchor] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const fallbackInitial = user?.first_name?.[0] || user?.email?.[0] || 'U';

  const authInstance = auth as Auth | null;
  const [fbUser, setFbUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    if (!authInstance) { setFbUser(null); return; }
    const unsub = authInstance.onAuthStateChanged((u) => setFbUser(u));
    return () => unsub();
  }, [authInstance]);
  const isLoggedIn = !!fbUser || !!user;

  const FirebaseAvatarWithAuth: React.FC<{ fallback: string }> = ({ fallback }) => {
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

  const doLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Firebase signOut failed', e);
    }
    await dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleLogout = () => {
    setConfirmOpen(true);
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

          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
                Login
              </Button>
              <Button color="inherit" variant="outlined" onClick={() => navigate('/register')} sx={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.5)' }}>
                Sign Up
              </Button>
            </>
          )}
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
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={() => { setConfirmOpen(false); doLogout(); }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
