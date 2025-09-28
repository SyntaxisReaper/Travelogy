import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { travelColors } from './styles/travelTheme';

// Travel theme using actual theme colors
const travelTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: travelColors.primary.ocean },
    secondary: { main: travelColors.primary.sunset },
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
      <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
        🌐 Travelogy
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
        Your Personal Travel Journal
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Step 3: Basic app + Redux + CSS imports + Travel theme test
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, opacity: 0.7 }}>
        Redux Loading State: {loading ? 'true' : 'false'}
      </Typography>
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
