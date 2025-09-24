import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Grid, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import { colors, techTheme as calmTheme } from './styles/techTheme';
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
import { dynamicTheme } from './styles/dynamicTheme';
// IMPORTANT: Lazy-load ProtectedRoute so Firebase isn't initialized at startup
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
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

// Google Fonts for tech typography
const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&display=swap';
googleFontsLink.rel = 'stylesheet';
document.head.appendChild(googleFontsLink);

// Landing Page Content Component (needs to be inside Router to use useNavigate)
interface LandingPageContentProps {
  systemStatus: { aiAccuracy: number; activeConnections: number; dataProcessed: number };
  isJourneyActive: boolean;
  handleStartJourney: () => void;
  handleViewAnalytics: () => void;
}
const LandingPageContentBase: React.FC<LandingPageContentProps> = ({
  systemStatus,
  isJourneyActive,
  handleStartJourney,
  handleViewAnalytics,
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4
        }}>
          {/* Main Title */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <GlitchText
              text="🌐 Travelogy"
              variant="h1"
              autoGlitch
              glitchIntensity="low"
              sx={{ mb: 2 }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            <Typography variant="h3" gutterBottom sx={{
              background: `linear-gradient(45deg, ${colors.neonCyan}, ${colors.neonPink}, ${colors.neonGreen})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4
            }}>
              AI-Powered Travel Intelligence
            </Typography>
          </motion.div>

          {/* Status Grid */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ width: '100%', maxWidth: '1200px' }}
          >
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
                <HolographicCard
                  glowColor={colors.neonGreen}
                  intensity="high"
                  animated
                  sx={{ p: 4, height: '200px' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                      🚀 Backend Neural Network
                    </Typography>
                    <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
                      ✓ ONLINE - Port 8000 | {systemStatus.activeConnections} connections
                    </Typography>
                    <Typography variant="body1">
                      FastAPI quantum processors active
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Firebase • PostgreSQL • ML Pipeline
                    </Typography>
                  </Box>
                </HolographicCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <HolographicCard
                  glowColor={colors.neonPink}
                  intensity="high"
                  animated
                  sx={{ p: 4, height: '200px' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                      💎 Frontend Matrix
                    </Typography>
                    <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
                      ✓ ACTIVE - Port 3000 | AI: {systemStatus.aiAccuracy.toFixed(1)}%
                    </Typography>
                    <Typography variant="body1">
                      React holographic interface
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      TypeScript • Material-UI • Framer Motion
                    </Typography>
                  </Box>
                </HolographicCard>
              </Grid>
            </Grid>

            {/* Features Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <HolographicCard
                  glowColor={colors.neonBlue}
                  intensity="medium"
                  sx={{ p: 3, height: '150px' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🧠 AI Trip Detection
                    </Typography>
                    <Typography variant="body2">
                      Machine learning algorithms analyze your travel patterns in real-time
                    </Typography>
                  </Box>
                </HolographicCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <HolographicCard
                  glowColor={colors.neonOrange}
                  intensity="medium"
                  sx={{ p: 3, height: '150px' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      🎮 Gamification Engine
                    </Typography>
                    <Typography variant="body2">
                      Level up your travel experience with achievements and rewards
                    </Typography>
                  </Box>
                </HolographicCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <HolographicCard
                  glowColor={colors.neonPurple}
                  intensity="medium"
                  sx={{ p: 3, height: '150px' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      📊 Quantum Analytics
                    </Typography>
                    <Typography variant="body2">
                      Advanced data visualization and insights for your journeys
                    </Typography>
                  </Box>
                </HolographicCard>
              </Grid>
            </Grid>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
              <NeonButton
                glowColor={colors.neonCyan}
                pulseAnimation
                size="large"
                onClick={() => navigate('/dashboard')}
              >
                🚀 Launch Dashboard
              </NeonButton>
              <NeonButton
                glowColor={isJourneyActive ? colors.glitchRed : colors.neonPink}
                borderAnimation={isJourneyActive}
                pulseAnimation={isJourneyActive}
                size="large"
                onClick={handleStartJourney}
              >
                {isJourneyActive ? '🛑 Stop Journey' : '🌟 Start Journey'}
              </NeonButton>
              <NeonButton
                glowColor={colors.neonGreen}
                size="large"
                onClick={handleViewAnalytics}
              >
                📈 View Analytics
              </NeonButton>
            </Box>
            
            {/* Authentication Buttons */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <NeonButton
                glowColor={colors.neonBlue}
                size="medium"
                onClick={() => navigate('/login')}
              >
                🔑 Login
              </NeonButton>
              <NeonButton
                glowColor={colors.neonOrange}
                size="medium"
                onClick={() => navigate('/register')}
              >
                🌟 Sign Up
              </NeonButton>
            </Box>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 6, 
                opacity: 0.7,
                fontFamily: '"Roboto Mono", monospace',
                letterSpacing: '0.1em'
              }}
            >
              {'>> TRAVELOGY PROTOCOL v1.0.0 | QUANTUM READY | NEURAL NETWORK ACTIVE <<'}
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

const LandingPageContent = React.memo(LandingPageContentBase);
LandingPageContent.displayName = 'LandingPageContent';

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
  const [themeStyle, setThemeStyle] = useState<'calm' | 'dynamic'>(() => (localStorage.getItem('themeStyle') as 'calm' | 'dynamic') || 'calm');
  const activeTheme = themeStyle === 'dynamic' ? dynamicTheme : calmTheme;
  const toggleTheme = useCallback(() => {
    setThemeStyle((prev) => {
      const next = prev === 'calm' ? 'dynamic' : 'calm';
      localStorage.setItem('themeStyle', next);
      return next;
    });
  }, []);


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
        <Navbar themeStyle={themeStyle} onToggleTheme={toggleTheme} />
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPageWrapper />
                </ProtectedRoute>
              } />
              <Route path="/trips" element={
                <ProtectedRoute>
                  <TripsPage />
                </ProtectedRoute>
              } />
              <Route path="/trips/list" element={
                <ProtectedRoute>
                  <TripsListPage />
                </ProtectedRoute>
              } />
              <Route path="/trips/:id" element={
                <ProtectedRoute>
                  <TripDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/stores" element={
                <ProtectedRoute>
                  <StoresPage />
                </ProtectedRoute>
              } />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/contact" element={<ContactPage />} />
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

        {/* Contact floating button */}
        <ContactFab />
      </Router>
      
      {/* Footer */}
      <Box component="footer" sx={{ textAlign: 'center', py: 2, bgcolor: 'background.default', color: 'text.secondary' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Travelogy — <a href="/contact" style={{ color: '#1de9b6', textDecoration: 'none' }}>Contact Ritesh Kumar Mishra</a>
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default App;