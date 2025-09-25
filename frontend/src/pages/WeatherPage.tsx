import React, { useEffect, useMemo, useState } from 'react';
import { Container, Paper, Typography, Box, Grid, Button } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import GlobeMap from '../components/maps/GlobeMap';
import LeafletMap from '../components/maps/LeafletMap';
import WeatherMapModal from '../components/maps/WeatherMapModal';
import MapToolbar from '../components/maps/MapToolbar';
import PlaceSearch, { PlaceSuggestion } from '../components/maps/PlaceSearch';
import { fetchWeather, WeatherData, fetchAirQuality, fetchForecast, AirQualityData, ForecastPoint, inferSeason, fetchRainNearby, RainPoint, generateWeatherInsights, generateHealthInsights, recommendPlaces } from '../services/weather';

const WeatherPage: React.FC = () => {
  const [place, setPlace] = useState<PlaceSuggestion | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aq, setAQ] = useState<AirQualityData | null>(null);
  const [fc, setFC] = useState<ForecastPoint[] | null>(null);
  const [rains, setRains] = useState<RainPoint[] | null>(null);
  const [showRadar, setShowRadar] = useState<boolean>(!!process.env.REACT_APP_OWM_API_KEY);
  const [maximized, setMaximized] = useState<boolean>(false);
  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const hasMapbox = !!mapboxToken && mapboxToken.startsWith('pk.');
  const [provider, setProvider] = useState<'mapbox' | 'leaflet' | 'both'>(() => (hasMapbox ? 'mapbox' : 'leaflet'));
  const [mapboxStyle, setMapboxStyle] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [leafletStyle, setLeafletStyle] = useState<'dark' | 'osm' | 'topo'>('dark');

  useEffect(() => {
    let cancelled = false;
    let timer: any;
    // Clear previous data immediately to avoid stale display for new location
    setWeather(null); setAQ(null); setFC(null); setRains(null);
    const run = async () => {
      if (!place) return;
      const [w, air, fore, rainpts] = await Promise.all([
        fetchWeather(place.latitude, place.longitude),
        fetchAirQuality(place.latitude, place.longitude),
        fetchForecast(place.latitude, place.longitude),
        fetchRainNearby(place.latitude, place.longitude),
      ]);
      if (!cancelled) { setWeather(w); setAQ(air); setFC(fore); setRains(rainpts); }
    };
    run();
    // Live updates every 60 seconds
    if (place) {
      timer = setInterval(run, 60000);
    }
    return () => { cancelled = true; if (timer) clearInterval(timer); };
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
          <Button variant="outlined" size="small" onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              const { latitude, longitude } = pos.coords as GeolocationCoordinates;
              setPlace({ name: 'Current Location', latitude, longitude } as any);
            });
          }}>Use My Location</Button>
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
              {/* Real-time AI summary */}
              <Typography variant="body2" sx={{ mt: 0.5, color: '#9fb6bf' }}>
                {generateWeatherInsights(weather, aq).summary}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {typeof weather.feelsLikeC === 'number' && (
                  <Grid item><Typography variant="caption">Feels: {weather.feelsLikeC.toFixed(1)}°C</Typography></Grid>
                )}
                {typeof weather.humidity === 'number' && (
                  <Grid item><Typography variant="caption">Humidity: {weather.humidity}%</Typography></Grid>
                )}
                {typeof weather.windSpeedMs === 'number' && (
                  <Grid item><Typography variant="caption">Wind: {(weather.windSpeedMs * 3.6).toFixed(0)} km/h</Typography></Grid>
                )}
                {typeof weather.pressure === 'number' && (
                  <Grid item><Typography variant="caption">Pressure: {weather.pressure} hPa</Typography></Grid>
                )}
                {typeof weather.clouds === 'number' && (
                  <Grid item><Typography variant="caption">Clouds: {weather.clouds}%</Typography></Grid>
                )}
                {typeof weather.rain1h === 'number' && weather.rain1h > 0 && (
                  <Grid item><Typography variant="caption">Rain(1h): {weather.rain1h.toFixed(1)} mm</Typography></Grid>
                )}
                {typeof weather.visibility === 'number' && (
                  <Grid item><Typography variant="caption">Visibility: {Math.round(weather.visibility/1000)} km</Typography></Grid>
                )}
              </Grid>
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
                <Box sx={{ color: '#e6f8ff' }}>
                  {(() => { const map: Record<number,string> = {1:'Good',2:'Fair',3:'Moderate',4:'Poor',5:'Very Poor'}; return (
                    <>AQI: <b>{map[aq.aqi || 0] || 'Unknown'}</b>{aq.aqi ? ` (${aq.aqi}/5)` : ''}</>
                  ); })()}
                  {aq.components?.pm2_5 !== undefined && (<><br/>PM2.5: {Math.round(aq.components.pm2_5)} µg/m³</>)}
                  {aq.components?.pm10 !== undefined && (<><br/>PM10: {Math.round(aq.components.pm10)} µg/m³</>)}
                  {aq.components?.no2 !== undefined && (<><br/>NO₂: {Math.round(aq.components.no2)} µg/m³</>)}
                  {aq.components?.o3 !== undefined && (<><br/>O₃: {Math.round(aq.components.o3)} µg/m³</>)}
                  {aq.components?.so2 !== undefined && (<><br/>SO₂: {Math.round(aq.components.so2)} µg/m³</>)}
                  {aq.components?.co !== undefined && (<><br/>CO: {Math.round(aq.components.co)} µg/m³</>)}
                </Box>
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
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>AI Insights</Typography>
              <Box sx={{ color: '#e6f8ff' }}>
                {(() => {
                  const gi = generateWeatherInsights(weather, aq);
                  return (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>{gi.summary}</Typography>
                      {gi.tips.map((t, i) => (
                        <Typography key={i} variant="caption" display="block" sx={{ color: '#9fb6bf' }}>• {t}</Typography>
                      ))}
                    </>
                  );
                })()}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Health & Safety</Typography>
              <Box sx={{ color: '#e6f8ff' }}>
                {(() => {
                  const hi = generateHealthInsights(weather, aq);
                  return (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>Overall risk: <b>{hi.riskLevel}</b></Typography>
                      {hi.notes.map((n, i) => (
                        <Typography key={i} variant="caption" display="block" sx={{ color: '#9fb6bf' }}>• {n}</Typography>
                      ))}
                    </>
                  );
                })()}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <Typography variant="h6" sx={{ color: '#e6f8ff', mb: 1 }}>Recommended Places</Typography>
              <Box sx={{ color: '#e6f8ff' }}>
                {(() => {
                  const recs = recommendPlaces(weather, aq, place ? inferSeason(place.latitude, new Date()) : undefined);
                  if (!recs.length) return <Typography variant="body2" sx={{ color: '#9fb6bf' }}>No suggestions available.</Typography>;
                  return (
                    <Grid container spacing={1}>
                      {recs.map((r, i) => (
                        <Grid key={i} item>
                          <Typography variant="caption" sx={{ border: '1px solid #1de9b6', borderRadius: 1, px: 1, py: 0.25 }}>{r}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  );
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
                rainPoints={rains || undefined}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 }, background: '#0c0f14', border: '1px solid #1de9b6' }}>
              <LeafletMap
                latitude={place?.latitude}
                longitude={place?.longitude}
                label={mapLabel}
                weather={weather}
                dark
                showRadar={showRadar}
                tileName={leafletStyle}
                rainPoints={rains || undefined}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : provider === 'mapbox' && hasMapbox ? (
        <Paper sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 }, background: '#0c0f14', border: '1px solid #1de9b6' }}>
          <GlobeMap
            latitude={place?.latitude}
            longitude={place?.longitude}
            label={mapLabel}
            weather={weather}
            dark
            showRadar={showRadar}
            styleName={mapboxStyle}
            rainPoints={rains || undefined}
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 }, background: '#0c0f14', border: '1px solid #1de9b6' }}>
          <LeafletMap
            latitude={place?.latitude}
            longitude={place?.longitude}
            label={mapLabel}
            weather={weather}
            dark
            showRadar={showRadar}
            tileName={leafletStyle}
            rainPoints={rains || undefined}
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