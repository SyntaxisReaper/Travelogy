import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  DirectionsCar,
  DirectionsWalk,
  DirectionsBike,
  DirectionsTransit,
  NaturePeople,
  LocationOn,
  TrendingUp,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { tripsAPI, gamificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  total_trips: number;
  total_distance: number;
  total_duration: number;
  most_used_mode: string;
  trips_this_week: number;
  eco_score: number;
  mode_breakdown: Record<string, number>;
}

interface GamificationProfile {
  points: {
    total: number;
    level: number;
    current_streak: number;
    longest_streak: number;
  };
  badges: Array<{
    name: string;
    description: string;
    icon: string;
    color: string;
  }>;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [gamification, setGamification] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, gamificationRes] = await Promise.all([
          tripsAPI.getStats(),
          gamificationAPI.getProfile(),
        ]);
        
        setStats(statsRes);
        setGamification(gamificationRes);

        // Check for active trip
        try {
          const activeTripRes = await tripsAPI.getActiveTrip();
          setActiveTrip(activeTripRes);
        } catch (error) {
          // No active trip, which is fine
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walk': return <DirectionsWalk />;
      case 'cycle': return <DirectionsBike />;
      case 'car': return <DirectionsCar />;
      case 'bus':
      case 'metro': return <DirectionsTransit />;
      default: return <LocationOn />;
    }
  };

  const handleStartTrip = () => {
    navigate('/trips?action=start');
  };

  const handleCompleteTrip = () => {
    navigate('/trips?action=complete');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        {activeTrip ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LocationOn />}
            onClick={handleCompleteTrip}
            size="large"
          >
            Complete Active Trip
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleStartTrip}
            size="large"
          >
            Start New Trip
          </Button>
        )}
      </Box>

      {/* Active Trip Alert */}
      {activeTrip && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: 'primary.light', 
            color: 'white',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            🚗 Active Trip in Progress
          </Typography>
          <Typography>
            Started: {new Date(activeTrip.start_time).toLocaleTimeString()}
          </Typography>
          <Typography>
            Mode: {activeTrip.transport_mode}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp color="primary" />
                <Typography variant="h6" ml={1}>
                  Total Trips
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {stats?.total_trips || 0}
              </Typography>
              <Typography color="text.secondary">
                {stats?.trips_this_week || 0} this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn color="primary" />
                <Typography variant="h6" ml={1}>
                  Distance
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {Math.round(stats?.total_distance || 0)}
              </Typography>
              <Typography color="text.secondary">
                kilometers traveled
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <NaturePeople color="success" />
                <Typography variant="h6" ml={1}>
                  Eco Score
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {stats?.eco_score || 0}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats?.eco_score || 0} 
                sx={{ mt: 1 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6">
                  Level {gamification?.points.level || 1}
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {gamification?.points.total || 0}
              </Typography>
              <Typography color="text.secondary">
                points earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Transport Mode Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transport Mode Breakdown
            </Typography>
            <Box>
              {stats?.mode_breakdown && Object.entries(stats.mode_breakdown).map(([mode, count]) => (
                <Box key={mode} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center">
                    {getModeIcon(mode)}
                    <Typography variant="body1" ml={1} sx={{ textTransform: 'capitalize' }}>
                      {mode}
                    </Typography>
                  </Box>
                  <Chip label={count} size="small" />
                </Box>
              ))}
              {!stats?.mode_breakdown && (
                <Typography color="text.secondary">
                  No trips recorded yet. Start your first trip to see your transport patterns!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Achievements
            </Typography>
            <Box>
              {gamification?.badges && gamification.badges.slice(0, 3).map((badge, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Box 
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <Typography variant="h6">{badge.icon}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{badge.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {badge.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {!gamification?.badges?.length && (
                <Typography color="text.secondary">
                  Complete more trips to earn achievements!
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;