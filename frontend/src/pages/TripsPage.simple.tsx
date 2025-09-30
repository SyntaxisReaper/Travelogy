import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Alert,
  Chip
} from '@mui/material';
import { 
  FlightTakeoff, 
  LocationOn, 
  Timer, 
  PhotoCamera,
  Map as MapIcon,
  TravelExplore 
} from '@mui/icons-material';
import { travelColors } from '../styles/travelTheme';

const SimpleTripsPage: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);

  const mockTrips = [
    {
      id: 1,
      title: 'City Walking Tour',
      date: '2024-12-28',
      distance: '3.2 km',
      duration: '45 min',
      status: 'completed',
      photos: 8
    },
    {
      id: 2,
      title: 'Mountain Hike',
      date: '2024-12-27',
      distance: '8.7 km',
      duration: '2h 30m',
      status: 'completed',
      photos: 15
    },
    {
      id: 3,
      title: 'Beach Walk',
      date: '2024-12-26',
      distance: '2.1 km',
      duration: '25 min',
      status: 'completed',
      photos: 12
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${travelColors.backgrounds.cream} 0%, ${travelColors.backgrounds.lightSand} 50%, ${travelColors.primary.sky}15 100%)`,
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" gutterBottom sx={{ 
            color: travelColors.primary.ocean,
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700
          }}>
            🗺️ Adventures & Trips
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Plan, track, and document your travel adventures
          </Typography>

          {/* Trip Tracking Controls */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant={isTracking ? 'outlined' : 'contained'}
              size="large"
              startIcon={isTracking ? <LocationOn /> : <FlightTakeoff />}
              onClick={() => setIsTracking(!isTracking)}
              sx={{
                background: !isTracking ? `linear-gradient(45deg, ${travelColors.primary.ocean}, ${travelColors.primary.sky})` : undefined,
                color: !isTracking ? 'white' : travelColors.primary.ocean,
                borderColor: isTracking ? travelColors.primary.ocean : undefined,
                px: 4,
                py: 1.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {isTracking ? 'Stop Tracking' : 'Start New Adventure'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<MapIcon />}
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
              View Route Planner
            </Button>
          </Box>

          {/* Tracking Status */}
          {isTracking && (
            <Alert 
              severity="info" 
              sx={{ 
                maxWidth: 400, 
                mx: 'auto',
                backgroundColor: `${travelColors.primary.ocean}10`,
                borderColor: travelColors.primary.ocean
              }}
            >
              📍 Adventure tracking active! Your route is being recorded.
            </Alert>
          )}
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: travelColors.primary.ocean, fontWeight: 'bold' }}>
                  {mockTrips.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Adventures
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: travelColors.primary.sunset, fontWeight: 'bold' }}>
                  14.0
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total KM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: travelColors.primary.forest, fontWeight: 'bold' }}>
                  3h 40m
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: travelColors.primary.coral, fontWeight: 'bold' }}>
                  35
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Photos Taken
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Adventures */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: travelColors.primary.ocean,
            fontFamily: '"Playfair Display", serif',
            mb: 3
          }}>
            Recent Adventures
          </Typography>
          
          <Grid container spacing={3}>
            {mockTrips.map((trip) => (
              <Grid item xs={12} md={6} lg={4} key={trip.id}>
                <Card sx={{ 
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${travelColors.primary.ocean}20`,
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: travelColors.text.primary }}>
                        {trip.title}
                      </Typography>
                      <Chip 
                        label={trip.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${travelColors.accents.success}20`,
                          color: travelColors.accents.success,
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📅 {trip.date}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" sx={{ color: travelColors.primary.ocean }} />
                        <Typography variant="body2">{trip.distance}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timer fontSize="small" sx={{ color: travelColors.primary.sunset }} />
                        <Typography variant="body2">{trip.duration}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhotoCamera fontSize="small" sx={{ color: travelColors.primary.forest }} />
                        <Typography variant="body2">{trip.photos} photos</Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TravelExplore />}
                      sx={{
                        borderColor: travelColors.primary.ocean,
                        color: travelColors.primary.ocean,
                        '&:hover': {
                          backgroundColor: `${travelColors.primary.ocean}10`,
                          borderColor: travelColors.primary.ocean,
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Coming Soon Features */}
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ color: travelColors.primary.ocean }}>
            🚀 Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive maps, GPS tracking, route planning, and photo journaling features are being enhanced!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SimpleTripsPage;