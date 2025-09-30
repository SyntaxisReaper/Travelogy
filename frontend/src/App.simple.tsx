import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';

// Simple theme without complex imports
const simpleTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1de9b6' },
    background: {
      default: '#0b0f15',
      paper: '#10151d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9fb6bf',
    },
  },
});

// Simple Landing Component
const SimpleLanding: React.FC = () => (
  <Box sx={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    p: 4
  }}>
    <Typography variant="h2" gutterBottom>
      🌐 Travelogy
    </Typography>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Your Personal Travel Journal
    </Typography>
    <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
      ✅ App is working without white screen
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.8 }}>
      ✅ Simple theme applied successfully
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.8 }}>
      ✅ Ready to diagnose theme conflicts
    </Typography>
  </Box>
);

const SimpleApp: React.FC = () => {
  return (
    <ThemeProvider theme={simpleTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="*" element={<SimpleLanding />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default SimpleApp;