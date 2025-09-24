import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import GlobeMap from '../components/maps/GlobeMap';
import LeafletMap from '../components/maps/LeafletMap';
import WeatherMapModal from '../components/maps/WeatherMapModal';
import MapToolbar from '../components/maps/MapToolbar';
import PlaceSearch, { PlaceSuggestion } from '../components/maps/PlaceSearch';
import { fetchWeather, WeatherData } from '../services/weather';

const WeatherPage: React.FC = () => {
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
      const w = await fetchWeather(place.latitude, place.longitude);
      if (!cancelled) setWeather(w);
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

      {provider === 'both' && hasMapbox ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 0, overflow: 'hidden', height: 460, background: '#0c0f14', border: '1px solid #1de9b6' }}>
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
        <Paper sx={{ p: 0, overflow: 'hidden', height: 460, background: '#0c0f14', border: '1px solid #1de9b6' }}>
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