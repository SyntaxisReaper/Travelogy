import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { travelColors } from './styles/travelTheme';
import { motion } from 'framer-motion';
import TravelCard from './components/TravelCard';

// Travel theme using actual theme colors
const travelTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: travelColors.primary.sunset }, // Sunset orange for visibility
    secondary: { main: travelColors.primary.ocean },
    background: {
      default: travelColors.backgrounds.cream,
      paper: travelColors.backgrounds.paper,
    },
    text: {
      primary: travelColors.text.primary,
      secondary: travelColors.text.secondary,
    },
  },
});

// Simple landing page component with Redux test
const SimpleLandingPage: React.FC = () => {
  const loading = useSelector((state: RootState) => state.ui.loading);
  
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
          🌐 Travelogy
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
          Your Personal Travel Journal
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Step 4: Basic app + Redux + CSS + Travel theme + TravelCard + Framer Motion
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'primary.main' }}>
          🧪 Theme Test: If you see ORANGE button/text, travel theme loaded!
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, opacity: 0.7 }}>
          Redux Loading State: {loading ? 'true' : 'false'}
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TravelCard
          cardVariant="ocean"
          cardElevation="medium"
          borderAccent
          sx={{ p: 4, mb: 4, maxWidth: 500, mx: 'auto' }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            🌊 Complex Component Test
          </Typography>
          <Typography variant="body2">
            If you can see this styled card with animations, TravelCard and framer-motion are working!
          </Typography>
        </TravelCard>
      </motion.div>
      
      <Button variant="contained" color="primary" size="large">
        Get Started
      </Button>
    </Container>
  );
};

// Simple dashboard page
const SimpleDashboard: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Typography variant="h3" gutterBottom>
      Dashboard Test
    </Typography>
    <Typography variant="body1">
      This is a test dashboard page to verify routing works.
    </Typography>
  </Container>
);

// Basic App with routing
const App: React.FC = () => {
  return (
    <ThemeProvider theme={travelTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/dashboard" element={<SimpleDashboard />} />
          <Route path="/*" element={<SimpleLandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
