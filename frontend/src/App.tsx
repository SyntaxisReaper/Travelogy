import React, { useState, useEffect, useCallback, Suspense, lazy, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Grid, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from './styles/techTheme';
import LightweightBackground from './components/LightweightBackground';
import GlitchText from './components/GlitchText';
import HolographicCard from './components/HolographicCard';
import NeonButton from './components/NeonButton';
import TechLoader from './components/TechLoader';
import NotificationSystem from './components/NotificationSystem';
import ContactFab from './components/ContactFab';
import { NotifyProvider } from './contexts/NotifyContext';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsModal from './components/AnalyticsModal';
import Navbar from './components/Navbar';
import EmergencySOS from './components/EmergencySOS';
import ThemePanel from './components/ThemePanel';
import ThemeFab from './components/ThemeFab';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPageWrapper = lazy(() => import('./pages/DashboardPageWrapper'));
const TripsPage = lazy(() => import('./pages/TripsPage'));
const TripsListPage = lazy(() => import('./pages/TripsListPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const TripDetailsPage = lazy(() => import('./pages/TripDetailsPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const FeedbackAdminPage = lazy(() => import('./pages/FeedbackAdminPage'));

// Google Fonts for tech typography
const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&family=Inter:wght@300;400;600;800&family=Space+Grotesk:wght@400;600;700&family=Fira+Code:wght@300;400;600&display=swap';
googleFontsLink.rel = 'stylesheet';
document.head.appendChild(googleFontsLink);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentLoaderType, setCurrentLoaderType] = useState<'circuit' | 'matrix' | 'dna' | 'quantum' | 'neural'>('circuit');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    aiAccuracy: 94.2,
    activeConnections: 1247,
    dataProcessed: 15840,
  });
  
  // Theme controls
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'dark');
  const [themeFont, setThemeFont] = useState<'tech' | 'system' | 'mono' | 'grotesk'>(() => (localStorage.getItem('themeFont') as any) || 'tech');
  const [accent, setAccent] = useState<'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'blue' | 'teal' | 'amber'>(() => (localStorage.getItem('accent') as any) || 'cyan');
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  const accentHex = useMemo(() => ({
    cyan: '#1de9b6',
    pink: '#ff4081',
    green: '#66bb6a',
    orange: '#ffa726',
    purple: '#ab47bc',
    blue: '#42a5f5',
    teal: '#26a69a',
    amber: '#ffca28',
  }[accent]), [accent]);

  const activeTheme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      primary: { main: accentHex },
      secondary: { main: themeMode === 'dark' ? '#90caf9' : '#8b5cf6' },
      background: themeMode === 'dark' ? {
        default: '#0b0f15',
        paper: '#10151d',
      } : {
        default: '#f7fafc',
        paper: '#ffffff',
      },
      text: themeMode === 'dark' ? {
        primary: '#e6f8ff',
        secondary: '#9fb6bf',
      } : {
        primary: '#0f172a',
        secondary: '#475569',
      },
      divider: themeMode === 'dark' ? 'rgba(29,233,182,0.2)' : 'rgba(2,132,199,0.2)'
    },
    components: themeMode === 'light' ? {
      MuiPaper: { styleOverrides: { root: { border: '1px solid rgba(2,132,199,0.12)', backgroundImage: 'none' } } },
      MuiCard: { styleOverrides: { root: { border: '1px solid rgba(2,132,199,0.16)', backgroundImage: 'none', boxShadow: '0 8px 24px rgba(2,132,199,0.06)' } } },
      MuiAppBar: { styleOverrides: { root: { backgroundColor: '#ffffffcc', backdropFilter: 'blur(12px)', color: '#0f172a' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' } } } },
    } : {},
    typography: {
      fontFamily:
        themeFont === 'tech' ? '"Orbitron","Roboto Mono", monospace' :
        themeFont === 'mono' ? '"Fira Code","Roboto Mono", monospace' :
        themeFont === 'grotesk' ? '"Space Grotesk","Inter","Segoe UI", Arial, sans-serif' :
        'Inter, Roboto, Segoe UI, Arial, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      button: { textTransform: 'none' },
    },
  }), [themeMode, themeFont, accentHex]);

  const handleChangeThemeMode = useCallback((m: 'light'|'dark') => { setThemeMode(m); localStorage.setItem('themeMode', m); }, []);
  const handleChangeThemeFont = useCallback((f: 'tech'|'system'|'mono'|'grotesk') => { setThemeFont(f); localStorage.setItem('themeFont', f); }, []);
  const handleChangeAccent = useCallback((a: 'cyan'|'pink'|'green'|'orange'|'purple'|'blue'|'teal'|'amber') => { setAccent(a); localStorage.setItem('accent', a); }, []);

  useEffect(() => {
    // Simulate loading sequence
    const loadingSequence = [
      { type: 'circuit' as const, duration: 1000 },
      { type: 'quantum' as const, duration: 800 },
      { type: 'neural' as const, duration: 800 },
    ];

    let currentIndex = 0;
    const runSequence = () => {
      if (currentIndex < loadingSequence.length) {
        setCurrentLoaderType(loadingSequence[currentIndex].type);
        setTimeout(() => {
          currentIndex++;
          runSequence();
        }, loadingSequence[currentIndex].duration);
      } else {
        setLoading(false);
      }
    };

    runSequence();

    // Simulate real-time system updates
    const statusInterval = setInterval(() => {
      setSystemStatus(prev => ({
        aiAccuracy: Math.min(100, prev.aiAccuracy + (Math.random() - 0.5) * 0.1),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5),
        dataProcessed: prev.dataProcessed + Math.floor(Math.random() * 50),
      }));
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);

  // Button handler functions with useCallback for performance
  const handleStartJourney = useCallback(() => {
    if (!isJourneyActive) {
      setIsJourneyActive(true);
      setNotifications(prev => [...prev, 'Journey started! AI tracking activated.']);
      // Simulate journey tracking
      setTimeout(() => {
        setNotifications(prev => [...prev, 'Transport mode detected: Walking']);
      }, 3000);
      setTimeout(() => {
        setNotifications(prev => [...prev, 'Route optimization complete']);
      }, 8000);
    } else {
      setIsJourneyActive(false);
      setNotifications(prev => [...prev, 'Journey completed! Data synced to neural network.']);
    }
  }, [isJourneyActive]);

  const handleViewAnalytics = useCallback(() => {
    setNotifications(prev => [...prev, 'Accessing quantum analytics...']);
    setTimeout(() => {
      setShowAnalytics(true);
    }, 1500);
  }, []);

  // Notification management with useCallback
  const clearNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <TechLoader
          type={currentLoaderType}
          size="large"
          text="Initializing Travelogy Protocol..."
          color={colors.neonCyan}
          fullscreen
        />
        <LightweightBackground />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Router>
        <Navbar
          themeMode={themeMode}
          themeFont={themeFont}
          accent={accent}
          onChangeThemeMode={handleChangeThemeMode}
          onChangeThemeFont={handleChangeThemeFont}
          onChangeAccent={handleChangeAccent}
        />
        <ScrollToTop />
        <Toolbar />
        <Box sx={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
          {/* Background effects */}
          <LightweightBackground />
          
          <NotifyProvider onNotify={(message) => setNotifications(prev => [...prev, message])}>
            <Suspense fallback={
              <TechLoader
                type="circuit"
                size="large"
                text="Loading..."
                color={colors.neonCyan}
                fullscreen
              />
            }>
              <Routes>
                {/* All routes are now public - no authentication required */}
                <Route path="/dashboard" element={<DashboardPageWrapper />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/list" element={<TripsListPage />} />
                <Route path="/trips/:id" element={<TripDetailsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/book" element={<BookingsPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/admin/feedback" element={<FeedbackAdminPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </NotifyProvider>
        </Box>
        
        {/* Notification System */}
        <NotificationSystem
          notifications={notifications}
          onClearNotification={clearNotification}
          onClearAll={clearAllNotifications}
        />

        {/* Emergency SOS floating button */}
        <EmergencySOS />
        
        {/* Analytics Modal */}
        <AnalyticsModal
          open={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        {/* Theme floating button */}
        <ThemeFab onClick={() => setThemePanelOpen(true)} />

        {/* Contact floating button */}
        <ContactFab />

        {/* Footer */}
        <Box component="footer" sx={{ textAlign: 'center', py: 2, bgcolor: 'background.default', color: 'text.secondary' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Travelogy — <a href="/contact" style={{ color: '#1de9b6', textDecoration: 'none' }}>Contact Team SkyStack</a>
          </Typography>
        </Box>
      </Router>

      {/* Theme Panel (app-level) */}
      <ThemePanel
        open={themePanelOpen}
        onClose={() => setThemePanelOpen(false)}
        themeMode={themeMode}
        themeFont={themeFont}
        onChangeThemeMode={handleChangeThemeMode}
        onChangeThemeFont={handleChangeThemeFont}
      />
    </ThemeProvider>
  );
};

export default App;
