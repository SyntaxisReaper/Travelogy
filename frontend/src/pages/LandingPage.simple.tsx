import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  FlightTakeoff,
  PhotoCamera,
  Explore,
  TravelExplore,
  Public,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SimpleLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PhotoCamera fontSize="large" />,
      title: 'Capture Every Moment',
      description: 'Document your adventures with photos and create lasting memories of your journeys.',
    },
    {
      icon: <TravelExplore fontSize="large" />,
      title: 'Discover New Places', 
      description: 'Find hidden gems and must-see destinations recommended by fellow travelers.',
    },
    {
      icon: <FlightTakeoff fontSize="large" />,
      title: 'Plan Your Adventures',
      description: 'Organize trips, track itineraries, and never miss a travel opportunity.',
    },
    {
      icon: <Public fontSize="large" />,
      title: 'Global Community',
      description: 'Connect with travelers worldwide and share your amazing experiences.',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      py: 8,
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}>
          {/* Main Title */}
          <Typography variant="h1" gutterBottom sx={{ 
            fontSize: { xs: '3rem', md: '4.5rem' },
            fontWeight: 800,
            background: 'linear-gradient(45deg, #1de9b6, #ff4081)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🌐 Travelogy
          </Typography>

          {/* Subtitle */}
          <Typography variant="h4" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Your Personal Travel Journal
          </Typography>

          <Typography variant="h6" sx={{ mb: 6, opacity: 0.7, maxWidth: 600 }}>
            Capture memories from every adventure. Plan trips. Share stories. Inspire others.
            Your journey starts here.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TravelExplore />}
              onClick={() => navigate('/register')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1de9b6, #00bcd4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00bcd4, #1de9b6)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Explore />}
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: '#1de9b6',
                color: '#1de9b6',
                '&:hover': {
                  borderColor: '#00bcd4',
                  backgroundColor: 'rgba(29, 233, 182, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Continue Adventure
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose Travelogy?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Card sx={{ 
                height: '100%',
                textAlign: 'center',
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
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

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Your Adventure?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
          Join thousands of travelers who use Travelogy to document and share their journeys.
        </Typography>
        <Button
          variant="contained"
          size="large" 
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 6,
            py: 2,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #ff4081, #f50057)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f50057, #ff4081)',
              transform: 'scale(1.05)',
            },
          }}
        >
          Launch Dashboard
        </Button>
      </Container>
    </Box>
  );
};

export default SimpleLandingPage;