import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Cloud, LocationOn } from '@mui/icons-material';
import { travelColors } from '../styles/travelTheme';
import TravelCard from '../components/TravelCard';
import TravelText from '../components/TravelText';
import AdventureButton from '../components/AdventureButton';
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
  const [geminiText, setGeminiText] = useState<string>('');
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const hasMapbox = !!mapboxToken && mapboxToken.startsWith('pk.');
  const [provider, setProvider] = useState<'mapbox' | 'leaflet' | 'both'>(() => (hasMapbox ? 'mapbox' : 'leaflet'));
  const [mapboxStyle, setMapboxStyle] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [leafletStyle, setLeafletStyle] = useState<'dark' | 'osm' | 'topo'>('dark');

  useEffect(() => {
    let cancelled = false;
    let timer: NodeJS.Timeout;
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
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${travelColors.backgrounds.cream} 0%, ${travelColors.backgrounds.lightSand} 50%, ${travelColors.primary.sky}12 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '7%',
          width: '170px',
          height: '170px',
          background: `radial-gradient(circle, ${travelColors.primary.ocean}15 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '8%',
          left: '6%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${travelColors.primary.forest}10 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Cloud sx={{ fontSize: 40, color: travelColors.primary.sky, mr: 2 }} />
            <TravelText
              text="Weather Insights"
              textVariant="adventure"
              animated
              variant="h3"
            />
          </Box>
          
          <TravelCard cardVariant="ocean" cardElevation="medium" borderAccent sx={{ mb: 3 }}>
            <Box sx={{ p: 3 }}>
              <TravelText
                text="Discover Weather Anywhere"
                textVariant="gradient"
                variant="h6"
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
                <Box sx={{ flex: 1, minWidth: 280 }}>
                  <PlaceSearch onSelect={setPlace} placeholder="Search city, place…" />
                </Box>
                <AdventureButton 
                  buttonVariant="ocean" 
                  size="small" 
                  startIcon={<LocationOn />}
                  onClick={() => {
                    if (!navigator.geolocation) return;
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const { latitude, longitude } = pos.coords;
                      setPlace({ name: 'Current Location', latitude, longitude } as PlaceSuggestion);
                    });
                  }}
                >
                  Use My Location
                </AdventureButton>
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
                <AdventureButton 
                  size="small" 
                  buttonVariant="sunset" 
                  disabled={!place || geminiLoading}
                  onClick={async () => {
                    if (!place) return;
                    setGeminiLoading(true);
                    try {
                      const { analyticsAPI } = await import('../services/api');
                      const result = await analyticsAPI.askGeminiWeather({
                        place: { name: place.name, city: place.city, country: place.country, lat: place.latitude, lon: place.longitude },
                        weather, aq,
                      });
                      setGeminiText(result?.insights || '');
                    } catch (e) {
                      setGeminiText('Sorry, Gemini insights are unavailable right now.');
                    } finally {
                      setGeminiLoading(false);
                    }
                  }}
                >
                  {geminiLoading ? 'Asking Gemini…' : 'Ask Gemini'}
                </AdventureButton>
              </Box>
              {weather ? (
                <Box sx={{ mt: 2 }}>
                  <TravelText
                    text={mapLabel || 'Current Location'}
                    textVariant="adventure"
                    variant="h5"
                    sx={{ mb: 1 }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: travelColors.text.secondary, 
                      mb: 2,
                      textTransform: 'capitalize'
                    }}
                  >
                    {weather.description || 'Current weather'}
                  </Typography>
                  {typeof weather.tempC === 'number' && (
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: travelColors.primary.sunset,
                        mb: 1
                      }}
                    >
                      {weather.tempC.toFixed(1)}°C
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: travelColors.text.secondary,
                      fontStyle: 'italic',
                      mb: 2
                    }}
                  >
                    {generateWeatherInsights(weather, aq).summary}
                  </Typography>
                  <Grid container spacing={1}>
                    {typeof weather.feelsLikeC === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Feels: {weather.feelsLikeC.toFixed(1)}°C
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.humidity === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Humidity: {weather.humidity}%
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.windSpeedMs === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Wind: {(weather.windSpeedMs * 3.6).toFixed(0)} km/h
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.pressure === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Pressure: {weather.pressure} hPa
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.clouds === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Clouds: {weather.clouds}%
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.rain1h === 'number' && weather.rain1h > 0 && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Rain(1h): {weather.rain1h.toFixed(1)} mm
                        </Typography>
                      </Grid>
                    )}
                    {typeof weather.visibility === 'number' && (
                      <Grid item>
                        <Typography variant="caption" sx={{ color: travelColors.text.primary }}>
                          Visibility: {Math.round(weather.visibility/1000)} km
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: travelColors.text.secondary,
                    textAlign: 'center',
                    py: 3,
                    fontStyle: 'italic'
                  }}
                >
                  Type to search a place. Select one to see its weather and map.
                </Typography>
              )}
            </Box>
          </TravelCard>

          {/* Insights */}
          {place && (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TravelCard cardVariant="forest" cardElevation="medium" borderAccent>
                  <Box sx={{ p: 3 }}>
                    <TravelText
                      text="Air Quality"
                      textVariant="wanderlust"
                      variant="h6"
                      sx={{ mb: 2 }}
                    />
                    {aq ? (
                      <Box sx={{ color: travelColors.text.primary }}>
                        {(() => { 
                          const map: Record<number,string> = {1:'Good',2:'Fair',3:'Moderate',4:'Poor',5:'Very Poor'}; 
                          const aqiColor = aq.aqi && aq.aqi <= 2 ? travelColors.primary.forest : 
                                          aq.aqi && aq.aqi <= 3 ? travelColors.primary.sunset : 
                                          travelColors.primary.coral;
                          return (
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: aqiColor, mb: 1 }}>
                              AQI: {map[aq.aqi || 0] || 'Unknown'}{aq.aqi ? ` (${aq.aqi}/5)` : ''}
                            </Typography>
                          ); 
                        })()}
                        {aq.components?.pm2_5 !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            PM2.5: {Math.round(aq.components.pm2_5)} μg/m³
                          </Typography>
                        )}
                        {aq.components?.pm10 !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            PM10: {Math.round(aq.components.pm10)} μg/m³
                          </Typography>
                        )}
                        {aq.components?.no2 !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            NO₂: {Math.round(aq.components.no2)} μg/m³
                          </Typography>
                        )}
                        {aq.components?.o3 !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            O₃: {Math.round(aq.components.o3)} μg/m³
                          </Typography>
                        )}
                        {aq.components?.so2 !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            SO₂: {Math.round(aq.components.so2)} μg/m³
                          </Typography>
                        )}
                        {aq.components?.co !== undefined && (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                            CO: {Math.round(aq.components.co)} μg/m³
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: travelColors.text.secondary, fontStyle: 'italic' }}>
                        Unavailable
                      </Typography>
                    )}
                  </Box>
                </TravelCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TravelCard cardVariant="ocean" cardElevation="medium" borderAccent sx={{ height: { xs: 240, md: 280 } }}>
                  <Box sx={{ p: 3, height: '100%' }}>
                    <TravelText
                      text="Forecast (Next Hours)"
                      textVariant="gradient"
                      variant="h6"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ height: { xs: 160, md: 200 } }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={(fc || []).slice(0, 8).map(p => ({ time: new Date(p.dt*1000).toLocaleTimeString([], { hour: '2-digit' }), temp: Math.round(p.tempC) }))}>
                          <defs>
                            <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={travelColors.primary.ocean} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={travelColors.primary.sky} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={`${travelColors.primary.ocean}30`} />
                          <XAxis dataKey="time" stroke={travelColors.text.secondary} />
                          <YAxis stroke={travelColors.text.secondary} />
                          <Tooltip 
                            contentStyle={{ 
                              background: travelColors.backgrounds.paper, 
                              border: `1px solid ${travelColors.primary.ocean}40`, 
                              borderRadius: '8px',
                              color: travelColors.text.primary 
                            }} 
                          />
                          <Area type="monotone" dataKey="temp" stroke={travelColors.primary.ocean} fill="url(#gradTemp)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </TravelCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <TravelCard cardVariant="sunset" cardElevation="medium" borderAccent>
                  <Box sx={{ p: 3 }}>
                    <TravelText
                      text="AI Insights"
                      textVariant="adventure"
                      variant="h6"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ color: travelColors.text.primary }}>
                      {geminiText ? (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: travelColors.text.primary }}>
                          {geminiText}
                        </Typography>
                      ) : (
                        (() => {
                          const gi = generateWeatherInsights(weather, aq);
                          return (
                            <>
                              <Typography variant="body2" sx={{ mb: 2, color: travelColors.text.primary }}>
                                {gi.summary}
                              </Typography>
                              {gi.tips.map((t, i) => (
                                <Typography key={i} variant="caption" display="block" sx={{ color: travelColors.text.secondary, mb: 0.5 }}>
                                  • {t}
                                </Typography>
                              ))}
                            </>
                          );
                        })()
                      )}
                    </Box>
                  </Box>
                </TravelCard>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TravelCard cardVariant="sunset" cardElevation="medium" borderAccent>
                  <Box sx={{ p: 3 }}>
                    <TravelText
                      text="Health & Safety"
                      textVariant="wanderlust"
                      variant="h6"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ color: travelColors.text.primary }}>
                      {(() => {
                        const hi = generateHealthInsights(weather, aq);
                        const riskColor = hi.riskLevel === 'Low' ? travelColors.primary.forest :
                                         hi.riskLevel === 'Moderate' ? travelColors.primary.sunset :
                                         travelColors.primary.coral;
                        return (
                          <>
                            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                              Overall risk: <span style={{ color: riskColor }}>{hi.riskLevel}</span>
                            </Typography>
                            {hi.notes.map((n, i) => (
                              <Typography key={i} variant="body2" display="block" sx={{ color: travelColors.text.secondary, mb: 1 }}>
                                • {n}
                              </Typography>
                            ))}
                          </>
                        );
                      })()}
                    </Box>
                  </Box>
                </TravelCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TravelCard cardVariant="paper" cardElevation="medium" borderAccent>
                  <Box sx={{ p: 3 }}>
                    <TravelText
                      text="Recommended Places"
                      textVariant="gradient"
                      variant="h6"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ color: travelColors.text.primary }}>
                      {(() => {
                        const recs = recommendPlaces(weather, aq, place ? inferSeason(place.latitude, new Date()) : undefined);
                        if (!recs.length) return (
                          <Typography variant="body2" sx={{ color: travelColors.text.secondary, fontStyle: 'italic' }}>
                            No suggestions available.
                          </Typography>
                        );
                        return (
                          <Grid container spacing={1}>
                            {recs.map((r, i) => (
                              <Grid key={i} item>
                                <Box sx={{ 
                                  border: `2px solid ${travelColors.primary.ocean}40`, 
                                  borderRadius: '12px', 
                                  px: 2, 
                                  py: 1,
                                  backgroundColor: `${travelColors.primary.ocean}10`,
                                  color: travelColors.primary.ocean,
                                  fontWeight: 'bold'
                                }}>
                                  {r}
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        );
                      })()}
                    </Box>
                    
                    <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${travelColors.primary.ocean}30` }}>
                      <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                        <strong>Current Season:</strong> {place ? inferSeason(place.latitude, new Date()) : '—'}
                      </Typography>
                    </Box>
                  </Box>
                </TravelCard>
              </Grid>
            </Grid>

            </>
          )}

          {provider === 'both' && hasMapbox ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TravelCard cardVariant="default" cardElevation="high" borderAccent>
                  <Box sx={{ p: 0, overflow: 'hidden', height: { xs: 320, md: 460 } }}>
                    <GlobeMap
                      latitude={place?.latitude}
                      longitude={place?.longitude}
                      label={mapLabel}
                      weather={weather}
                      showRadar={showRadar}
                      styleName={mapboxStyle}
                      rainPoints={rains || undefined}
                    />
                  </Box>
                </TravelCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <TravelCard cardVariant="default" cardElevation="high" borderAccent>
                  <Box sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 } }}>
                    <LeafletMap
                      latitude={place?.latitude}
                      longitude={place?.longitude}
                      label={mapLabel}
                      weather={weather}
                      showRadar={showRadar}
                      tileName={leafletStyle}
                      rainPoints={rains || undefined}
                    />
                  </Box>
                </TravelCard>
              </Grid>
            </Grid>
          ) : provider === 'mapbox' && hasMapbox ? (
            <TravelCard cardVariant="default" cardElevation="high" borderAccent sx={{ mb: 3 }}>
              <Box sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 } }}>
                <GlobeMap
                  latitude={place?.latitude}
                  longitude={place?.longitude}
                  label={mapLabel}
                  weather={weather}
                  showRadar={showRadar}
                  styleName={mapboxStyle}
                  rainPoints={rains || undefined}
                />
              </Box>
            </TravelCard>
          ) : (
            <TravelCard cardVariant="default" cardElevation="high" borderAccent sx={{ mb: 3 }}>
              <Box sx={{ p: 0, overflow: 'hidden', height: { xs: 260, md: 420 } }}>
                <LeafletMap
                  latitude={place?.latitude}
                  longitude={place?.longitude}
                  label={mapLabel}
                  weather={weather}
                  showRadar={showRadar}
                  tileName={leafletStyle}
                  rainPoints={rains || undefined}
                />
              </Box>
            </TravelCard>
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default WeatherPage;