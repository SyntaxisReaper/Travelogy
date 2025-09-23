import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, Chip, Alert } from '@mui/material';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { tripsAPI } from '../services/api';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface HeatPoint { lat: number; lon: number; weight?: number }

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [heat, setHeat] = useState<HeatPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, h] = await Promise.all([
          tripsAPI.getStats().catch(() => null),
          tripsAPI.getHeatmap().catch(() => []),
        ]);
        setStats(s);
        const points: HeatPoint[] = Array.isArray(h)
          ? h.map((p: any) => ({ lat: p.lat || p.latitude, lon: p.lon || p.longitude, weight: p.weight }))
          : [];
        setHeat(points.filter((p) => typeof p.lat === 'number' && typeof p.lon === 'number'));
      } catch (e) {
        setError('Failed to load analytics');
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    if (!stats) return [];
    // Accept several shapes: stats.timeline, stats.monthly, etc.
    const timeline = stats.timeline || stats.monthly || [];
    return timeline.map((x: any) => ({ name: x.label || x.month || x.day, trips: x.trips || x.count || 0 }));
  }, [stats]);

  const center: LatLngExpression = heat.length ? [heat[0].lat, heat[0].lon] : [20, 0];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Analytics
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Total trips: ${stats?.total_trips ?? 0}`} />
              <Chip label={`Distance: ${Math.round(stats?.total_distance ?? 0)} km`} />
              <Chip label={`Eco score: ${stats?.eco_score ?? 0}`} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 260 }}>
            <Typography variant="h6" gutterBottom>Trips over time</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#00e5ff" fill="url(#gradTrips)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Trip density</Typography>
            <Box sx={{ height: 380 }}>
              <MapContainer center={center} zoom={heat.length ? 6 : 2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {heat.map((p, i) => (
                  <Circle key={i} center={[p.lat, p.lon] as LatLngExpression} radius={2000 * (p.weight || 1)} pathOptions={{ color: '#ff4081', opacity: 0.6 }} />
                ))}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
