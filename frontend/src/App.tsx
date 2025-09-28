import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button } from '@mui/material';

// Test theme with travel colors
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2E86AB' }, // Ocean blue
    secondary: { main: '#F18F01' }, // Sunset orange
    background: {
      default: '#FDF8F0', // Cream background
      paper: '#F9F7F4', // Paper white
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
    },
  },
});

// Simple landing page component
const SimpleLandingPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
      🌐 Travelogy
    </Typography>
    <Typography variant="h4" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
      Your Personal Travel Journal
    </Typography>
    <Typography variant="body1" sx={{ mb: 4 }}>
      Basic routing and theme test - If you can see this, the core app structure works!
    </Typography>
    <Button variant="contained" color="primary" size="large">
      Get Started
    </Button>
  </Container>
);

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
    <ThemeProvider theme={testTheme}>
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
