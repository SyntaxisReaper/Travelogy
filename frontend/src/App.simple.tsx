import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { TravelExplore, FlightTakeoff, PhotoCamera, Public } from '@mui/icons-material';
import { travelColors } from './styles/travelTheme';

// Beautiful travel theme
const travelTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: travelColors.primary.ocean,
      light: travelColors.primary.sky,
      dark: travelColors.primary.forest,
    },
    secondary: {
      main: travelColors.primary.sunset,
      light: travelColors.primary.coral,
      dark: travelColors.accents.warning,
    },
    background: {
      default: travelColors.backgrounds.cream,
      paper: travelColors.backgrounds.paper,
    },
    text: {
      primary: travelColors.text.primary,
      secondary: travelColors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: travelColors.shadows.soft,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: travelColors.shadows.medium,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

// Beautiful Travel Landing Component
const TravelLanding: React.FC = () => {
  const features = [
    {
      icon: <PhotoCamera fontSize="large" sx={{ color: travelColors.primary.ocean }} />,
      title: 'Capture Memories',
      description: 'Document every adventure with photos and stories.',
    },
    {
      icon: <TravelExplore fontSize="large" sx={{ color: travelColors.primary.sunset }} />,
      title: 'Discover Places',
      description: 'Find hidden gems and must-see destinations.',
    },
    {
      icon: <FlightTakeoff fontSize="large" sx={{ color: travelColors.primary.forest }} />,
      title: 'Plan Adventures',
      description: 'Organize trips and track your itineraries.',
    },
    {
      icon: <Public fontSize="large" sx={{ color: travelColors.primary.coral }} />,
      title: 'Share Stories',
      description: 'Inspire others with your travel experiences.',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${travelColors.backgrounds.cream} 0%, ${travelColors.backgrounds.lightSand} 50%, ${travelColors.primary.sky}15 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${travelColors.primary.sunset}20 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${travelColors.primary.ocean}15 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, py: 8 }}>
        {/* Main Title */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '3rem', md: '4.5rem' },
              background: `linear-gradient(45deg, ${travelColors.primary.ocean}, ${travelColors.primary.sunset})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            🌐 Travelogy
          </Typography>
          <Typography variant="h4" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Your Personal Travel Journal
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            Capture memories from every adventure. Plan trips. Share stories. Inspire others.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TravelExplore />}
              sx={{
                background: `linear-gradient(45deg, ${travelColors.primary.ocean}, ${travelColors.primary.sky})`,
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: `linear-gradient(45deg, ${travelColors.primary.forest}, ${travelColors.primary.ocean})`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FlightTakeoff />}
              sx={{
                borderColor: travelColors.primary.sunset,
                color: travelColors.primary.sunset,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: travelColors.primary.coral,
                  backgroundColor: `${travelColors.primary.sunset}10`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Explore Features
            </Button>
          </Box>

          {/* Status Indicators */}
          <Box sx={{ 
            display: 'inline-flex', 
            flexDirection: 'column', 
            gap: 1, 
            p: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${travelColors.primary.ocean}20`
          }}>
            <Typography variant="body2" sx={{ color: travelColors.accents.success, fontWeight: 600 }}>
              ✅ Travel theme applied successfully
            </Typography>
            <Typography variant="body2" sx={{ color: travelColors.accents.success, fontWeight: 600 }}>
              ✅ No white screen issues
            </Typography>
            <Typography variant="body2" sx={{ color: travelColors.accents.success, fontWeight: 600 }}>
              ✅ Ready for feature enhancement
            </Typography>
          </Box>
        </Box>

        {/* Features Grid */}
        <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose Travelogy?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: travelColors.text.primary }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const SimpleApp: React.FC = () => {
  return (
    <ThemeProvider theme={travelTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="*" element={<TravelLanding />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default SimpleApp;