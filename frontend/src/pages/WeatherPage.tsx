import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import GlobeMap from '../components/maps/GlobeMap';
import LeafletMap from '../components/maps/LeafletMap';
import WeatherMapModal from '../components/maps/WeatherMapModal';
import MapToolbar from '../components/maps/MapToolbar';
import PlaceSearch, { PlaceSuggestion } from '../components/maps/PlaceSearch';
import { fetchWeather, WeatherData, fetchAirQuality, fetchForecast, AirQualityData, ForecastPoint, inferSeason } from '../services/weather';

const WeatherPage: React.FC = () => {
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aq, setAQ] = useState<AirQualityData | null>(null);
  const [fc, setFC] = useState<ForecastPoint[] | null>(null);
  const [showRadar, setShowRadar] = useState<boolean>(!!process.env.REACT_APP_OWM_API_KEY);
  const [maximized, setMaximized] = useState<boolean>(false);
  const hasMapbox = !!process.env.REACT_APP_MAPBOX_TOKEN;
  const [provider, setProvider] = useState<'mapbox' | 'leaflet' | 'both'>(() => (hasMapbox ? 'mapbox' : 'leaflet'));
  const [mapboxStyle, setMapboxStyle] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [leafletStyle, setLeafletStyle] = useState<'dark' | 'osm' | 'topo'>('dark');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!place) return;
      const [w, air, fore] = await Promise.all([
        fetchWeather(place.latitude, place.longitude),
        fetchAirQuality(place.latitude, place.longitude),
        fetchForecast(place.latitude, place.longitude),
      ]);
      if (!cancelled) { setWeather(w); setAQ(air); setFC(fore); }
    };
    run();
    return () => { cancelled = true; };
  }, [place]);

  const mapLabel = useMemo(() => {
    if (place?.city) return `${place.city}${place.country ? ', ' + place.country : ''}`;
    if (place?.name) return place.name;
    return undefined;
  }, [place]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#e6f8ff' }}>
        ☁️ Weather
      </Typography>
      <Paper sx={{ p: 2, mb: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <PlaceSearch onSelect={setPlace} placeholder="Search city, place…" />
          </Box>
          <MapToolbar
            hasMapbox={hasMapbox}
            provider={provider}
            onProviderChange={setProvider}
            mapboxStyle={mapboxStyle}
            onMapboxStyleChange={setMapboxStyle}
            leafletStyle={leafletStyle}
            onLeafletStyleChange={setLeafletStyle}
            showRadar={showRadar}
            onToggleRadar={() => setShowRadar(v => !v)}
            onMaximize={() => setMaximized(true)}
          />
        </Box>
        <Box sx={{ mt: 2, color: '#e6f8ff', opacity: 0.85 }}>
          {weather ? (
            <>
              <Typography variant="h6" sx={{ color: '#1de9b6' }}>{mapLabel || 'Location'}</Typography>
              <Typography variant="body2">{weather.description || 'Current weather'}</Typography>
              {typeof weather.tempC === 'number' && (
                <Typography variant="h5" fontWeight={700}>{weather.tempC.toFixed(1)}°C</Typography>
              )}
            </>
          ) : (
            <Typography variant="body2">Type to search a place. Select one to see its weather and map.</Typography>
          )}
        </Box>
      </Paper>

      {/* Insights */}
      {place && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Air Quality</Typography>
              {aq ? (
                <Box sx={{ color: '#e6f8ff' }}>AQI: <b>{aq.aqi}</b></Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#9fb6bf' }}>Unavailable</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6', height: { xs: 200, md: 240 } }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Forecast (next hours)</Typography>
              <Box sx={{ height: { xs: 140, md: 180 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={(fc || []).slice(0, 8).map(p => ({ time: new Date(p.dt*1000).toLocaleTimeString([], { hour: '2-digit' }), temp: Math.round(p.tempC) }))}>
                    <defs>
                      <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1de9b6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1de9b6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1de9b666" />
                    <XAxis dataKey="time" stroke="#e6f8ff" />
                    <YAxis stroke="#e6f8ff" />
                    <Tooltip contentStyle={{ background: '#0c0f14', border: '1px solid #1de9b6', color: '#e6f8ff' }} />
                    <Area type="monotone" dataKey="temp" stroke="#1de9b6" fill="url(#gradTemp)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Health & Activities</Typography>
              <Box sx={{ color: '#e6f8ff' }}>
                {(() => {
                  const t = weather?.tempC ?? 20;
                  const aqi = aq?.aqi ?? 2;
                  if (aqi >= 4) return 'Air quality is poor. Avoid outdoor strenuous activity.';
                  if (t > 32) return 'It’s hot. Hydrate well and prefer light activities.';
                  if (t < 8) return 'It’s cold. Dress warmly for outdoor activities.';
                  return 'Conditions look fine for a walk or light run.';
                })()}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Current Season</Typography>
              <Box sx={{ color: '#e6f8ff' }}>
                {place ? inferSeason(place.latitude, new Date()) : '—'}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {provider === 'both' && hasMapbox ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
      <Paper sx={{ p: 0, overflow: 'hidden', height: { xs: 320, md: 460 }, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <GlobeMap
                latitude={place?.latitude}
                longitude={place?.longitude}
                label={mapLabel}
                weather={weather}
                dark
                showRadar={showRadar}
                styleName={mapboxStyle}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 0, overflow: 'hidden', height: 460, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <LeafletMap
                latitude={place?.latitude}
                longitude={place?.longitude}
                label={mapLabel}
                weather={weather}
                dark
                showRadar={showRadar}
                tileName={leafletStyle}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : provider === 'mapbox' && hasMapbox ? (
        <Paper sx={{ p: 0, overflow: 'hidden', height: { xs: 320, md: 460 }, background: '#0c0f14', border: '1px solid #1de9b6' }}>
          <GlobeMap
            latitude={place?.latitude}
            longitude={place?.longitude}
            label={mapLabel}
            weather={weather}
            dark
            showRadar={showRadar}
            styleName={mapboxStyle}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 0, overflow: 'hidden', height: 460, background: '#0c0f14', border: '1px solid #1de9b6' }}>
          <LeafletMap
            latitude={place?.latitude}
            longitude={place?.longitude}
            label={mapLabel}
            weather={weather}
            dark
            showRadar={showRadar}
            tileName={leafletStyle}
          />
        </Paper>
      )}

      <WeatherMapModal
        open={maximized}
        onClose={() => setMaximized(false)}
        useMapbox={provider !== 'leaflet' && hasMapbox}
        showRadar={showRadar}
        place={place}
        onSelectPlace={setPlace}
        weather={weather}
        mapboxStyle={mapboxStyle}
        leafletStyle={leafletStyle}
      />
    </Container>
  );
};

export default WeatherPage;