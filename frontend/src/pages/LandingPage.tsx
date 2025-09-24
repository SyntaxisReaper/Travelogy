import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  DirectionsWalk,
  NaturePeople,
  Analytics,
  Security,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DirectionsWalk fontSize="large" />,
      title: 'Smart Trip Tracking',
      description: 'Automatically detect and log your trips with AI-powered mode detection.',
    },
    {
      icon: <NaturePeople fontSize="large" />,
      title: 'Eco-Friendly Insights',
      description: 'Track your carbon footprint and make sustainable transport choices.',
    },
    {
      icon: <Analytics fontSize="large" />,
      title: 'Detailed Analytics',
      description: 'Visualize your travel patterns and contribute to transport research.',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Privacy First',
      description: 'Your data is secure with granular privacy controls and consent management.',
    },
  ];

  const stats = [
    { label: 'Transport Modes', value: '6+', icon: <DirectionsWalk /> },
    { label: 'CO₂ Saved', value: '12kg', icon: <NaturePeople /> },
    { label: 'Active Users', value: '1k+', icon: <TrendingUp /> },
    { label: 'Cities', value: '50+', icon: <Analytics /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            🌍 TraveLogy
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your AI-Powered Smart Travel Diary
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            Track your journeys, understand your impact, and contribute to sustainable transport research
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', px: 4, py: 1.5 }}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5 }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Why Choose TraveLogy?
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Intelligent travel tracking with privacy and sustainability at its core
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                1
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Start Your Journey
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simply start the app when you begin traveling. Our AI detects when you&apos;re on the move.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                2
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                AI Detection
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our smart algorithms automatically detect your transport mode and trip purpose.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                3
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Get Insights
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View your travel patterns, environmental impact, and contribute to transport research.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users making smarter, more sustainable travel choices
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'primary.main', px: 4, py: 1.5 }}
            onClick={() => navigate('/register')}
          >
            Sign Up Now - It&apos;s Free!
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;