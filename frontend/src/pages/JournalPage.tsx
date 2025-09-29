import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Stack, Chip, Grid, ImageList, ImageListItem, Alert, Skeleton, Fab, Collapse, IconButton, TextField, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Book,
  PhotoCamera,
  Download,
  TableChart,
  FlightTakeoff,
  LocationOn,
  Timeline,
  TravelExplore,
  Explore,
  Map,
  DirectionsCar,
  DirectionsWalk,
  DirectionsBike,
  Train,
  Flight,
  Add,
  Close,
  CloudUpload,
  Save,
  NoteAdd
} from '@mui/icons-material';
import { tripsAPI } from '../services/api';
import { travelColors } from '../styles/travelTheme';
import TravelText from '../components/TravelText';
import TravelCard from '../components/TravelCard';
import AdventureButton from '../components/AdventureButton';
import { EnhancedPhotoUpload, PhotoFile } from '../upgrades/photo-system';

interface DiaryEntry { 
  id?: string; 
  note?: string; 
  photos?: string[] | { url: string; caption?: string }[]; 
  created_at?: string; 
  trip_id?: string;
  transport_mode?: string;
  distance_km?: number;
  start_time?: string;
  location_name?: string;
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  
  // Enhanced photo upload state
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [newPhotos, setNewPhotos] = useState<PhotoFile[]>([]);
  const [journalNote, setJournalNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Load trips first to get complete context
        const tripsRes = await tripsAPI.getTrips();
        const tripsList = Array.isArray(tripsRes?.results) ? tripsRes.results : Array.isArray(tripsRes) ? tripsRes : [];
        setTrips(tripsList);

        // Try a dedicated timeline endpoint if available
        const tl = await tripsAPI.getTimeline().catch(() => null);
        if (tl && Array.isArray(tl?.results || tl)) {
          setEntries((tl.results || tl) as DiaryEntry[]);
          return;
        }
        
        // Collect diary entries from trips with enhanced metadata
        const all: DiaryEntry[] = [];
        for (const t of tripsList) {
          const ds = t.diaries || t.diary_entries || [];
          ds.forEach((d: any) => {
            all.push({ 
              ...d, 
              trip_id: t.id,
              transport_mode: t.transport_mode,
              distance_km: t.distance_km,
              start_time: t.start_time,
              location_name: t.location_name || t.destination,
              created_at: d.created_at || t.start_time
            });
          });
          
          // If trip has no diary but has notes or important info, create an entry
          if (ds.length === 0 && (t.notes || t.transport_mode)) {
            all.push({
              id: `trip-${t.id}`,
              note: t.notes || `${t.transport_mode} trip of ${(t.distance_km || 0).toFixed(1)} km`,
              trip_id: t.id,
              transport_mode: t.transport_mode,
              distance_km: t.distance_km,
              start_time: t.start_time,
              created_at: t.start_time,
              location_name: t.location_name || t.destination,
              photos: []
            });
          }
        }
        setEntries(all);
      } catch (e) {
        console.error('Failed to load journal entries:', e);
        setError('Failed to load journal entries. You can still use the photo upload feature!');
        // Set empty arrays so the page still renders
        setEntries([]);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });
  }, [entries]);

  // Save journal entry function
  const saveJournalEntry = async () => {
    if (!journalNote.trim() && newPhotos.length === 0) {
      setError('Please add a note or photos to save your journal entry.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Create a new journal entry
      const newEntry: DiaryEntry = {
        id: `journal-${Date.now()}`,
        note: journalNote.trim(),
        photos: newPhotos.map(photo => ({
          url: photo.preview, // In a real app, you'd upload to Firebase Storage first
          caption: photo.caption
        })),
        created_at: new Date().toISOString(),
        trip_id: undefined, // This is a standalone journal entry
        transport_mode: undefined,
        distance_km: undefined,
        location_name: newPhotos.find(p => p.metadata.location) 
          ? `📍 ${newPhotos.find(p => p.metadata.location)?.metadata.location?.lat.toFixed(4)}, ${newPhotos.find(p => p.metadata.location)?.metadata.location?.lng.toFixed(4)}`
          : undefined
      };

      // Add to entries state (in real app, save to backend/Firebase)
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      
      // Clear the form
      setJournalNote('');
      setNewPhotos([]);
      setShowPhotoUpload(false);
      
      // Success message (you could use a toast/snackbar here)
      console.log('Journal entry saved!', newEntry);
      
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      setError('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTransportModeEmoji = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'walking': return '🚶';
      case 'cycling': return '🚴';
      case 'driving': return '🚗';
      case 'bus': return '🚌';
      case 'train': return '🚂';
      case 'plane': return '✈️';
      case 'boat': return '🚢';
      default: return '🌟';
    }
  };

  const getTransportModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'walking': return <DirectionsWalk />;
      case 'cycling': return <DirectionsBike />;
      case 'driving': return <DirectionsCar />;
      case 'bus': 
      case 'train': return <Train />;
      case 'plane': return <Flight />;
      default: return <TravelExplore />;
    }
  };

  const renderPhotos = (photos: string[] | { url: string; caption?: string }[] | undefined) => {
    if (!photos || photos.length === 0) return null;
    
    const photoUrls = Array.isArray(photos) ? 
      photos.map(p => typeof p === 'string' ? p : p.url) : [];
    
    if (photoUrls.length === 0) return null;

    return (
      <ImageList cols={Math.min(3, photoUrls.length)} rowHeight={200} sx={{ mt: 2 }}>
        {photoUrls.map((url, j) => {
          const photoItem = photos[j];
          const caption = typeof photoItem === 'object' && photoItem && 'caption' in photoItem ? photoItem.caption : undefined;
          return (
            <ImageListItem key={j}>
              <img 
                src={url} 
                alt={`Travel memory ${j + 1}`} 
                style={{ 
                  objectFit: 'cover', 
                  width: '100%', 
                  height: '200px',
                  borderRadius: '8px',
                  border: `2px solid ${travelColors.primary.ocean}40`,
                  boxShadow: travelColors.shadows.soft
                }} 
              />
              {caption && (
                <Typography variant="caption" sx={{ 
                  color: travelColors.text.secondary, 
                  mt: 1, 
                  display: 'block',
                  textAlign: 'center'
                }}>
                  {caption}
                </Typography>
              )}
            </ImageListItem>
          );
        })}
      </ImageList>
    );
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${travelColors.backgrounds.cream} 0%, ${travelColors.backgrounds.lightSand} 50%, ${travelColors.primary.sky}08 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          right: '3%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${travelColors.primary.coral}10 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '12%',
          left: '5%',
          width: '180px',
          height: '180px',
          background: `radial-gradient(circle, ${travelColors.primary.forest}08 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Book sx={{ fontSize: 40, color: travelColors.primary.ocean, mr: 2 }} />
              <TravelText
                text="Travel Journal"
                textVariant="adventure"
                animated
                variant="h3"
              />
            </Box>
            {sorted.length > 0 && (
              <Stack direction="row" spacing={1}>
                <AdventureButton
                  buttonVariant="forest"
                  startIcon={<Download />}
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(sorted, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'travel-journal.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export JSON
                </AdventureButton>
                <AdventureButton
                  buttonVariant="ocean"
                  startIcon={<TableChart />}
                  onClick={() => {
                    const header = ['created_at', 'trip_id', 'transport_mode', 'distance_km', 'location', 'note', 'photos'];
                    const rows = sorted.map(e => [
                      e.created_at || '', 
                      e.trip_id || '', 
                      e.transport_mode || '',
                      e.distance_km || 0,
                      e.location_name || '',
                      (e.note || '').replace(/\n/g, ' '), 
                      Array.isArray(e.photos) ? e.photos.length : 0
                    ]);
                    const csv = [header.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'travel-journal.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export CSV
                </AdventureButton>
              </Stack>
            )}
          </Stack>

          {error && (
            <>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  backgroundColor: `${travelColors.primary.coral}15`, 
                  color: travelColors.primary.coral,
                  border: `1px solid ${travelColors.primary.coral}40`
                }}
              >
                {error}
              </Alert>
              <Alert severity="info" sx={{ mb: 3 }}>
                Tip: Click the + button at the bottom-right to add photos to your journal.
              </Alert>
            </>
          )}

          {loading && (
            <Grid container spacing={3}>
              {[1, 2, 3].map(i => (
                <Grid item xs={12} key={i}>
                  <Skeleton 
                    variant="rectangular" 
                    height={200} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: `${travelColors.primary.ocean}10`,
                      border: `1px solid ${travelColors.primary.ocean}20`
                    }} 
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && !sorted.length && (
            <TravelCard
              cardVariant="sunset"
              cardElevation="high"
              borderAccent
              sx={{ p: 6, textAlign: 'center' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TravelExplore sx={{ fontSize: 80, color: travelColors.primary.sunset, mb: 3 }} />
                <TravelText
                  text="Your Adventure Journal Awaits"
                  textVariant="wanderlust"
                  animated
                  variant="h4"
                  sx={{ mb: 3 }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: travelColors.text.secondary, 
                    mb: 4,
                    maxWidth: '500px',
                    fontStyle: 'italic'
                  }}
                >
                  No travel memories captured yet. Start your first adventure and create unforgettable journal entries to fill your travel story.
                </Typography>
                <AdventureButton 
                  buttonVariant="sunset" 
                  size="large"
                  startIcon={<FlightTakeoff />}
                  adventure
                  onClick={() => window.location.href = '/trips'}
                >
                  Start First Adventure
                </AdventureButton>
              </Box>
            </TravelCard>
          )}

          <Grid container spacing={3}>
            {sorted.map((entry, i) => {
              const cardVariants = ['ocean', 'sunset', 'forest', 'coral'];
              const cardVariant = cardVariants[i % 4];
              
              return (
                <Grid item xs={12} key={entry.id || i}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <TravelCard
                      cardVariant={cardVariant as any}
                      cardElevation="medium"
                      borderAccent
                      sx={{ p: 4 }}
                    >
                      {/* Header with timestamp and transport mode */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {entry.transport_mode && (
                            <Chip 
                              icon={getTransportModeIcon(entry.transport_mode)}
                              label={entry.transport_mode}
                              sx={{ 
                                bgcolor: `${travelColors.primary[cardVariant as keyof typeof travelColors.primary]}20`,
                                color: travelColors.primary[cardVariant as keyof typeof travelColors.primary],
                                fontWeight: 'bold',
                                '& .MuiChip-icon': {
                                  color: travelColors.primary[cardVariant as keyof typeof travelColors.primary]
                                }
                              }} 
                            />
                          )}
                          {entry.distance_km && (
                            <Chip 
                              icon={<Timeline />}
                              label={`${entry.distance_km.toFixed(1)} km`}
                              sx={{ 
                                bgcolor: `${travelColors.primary.sky}20`,
                                color: travelColors.primary.sky,
                                '& .MuiChip-icon': {
                                  color: travelColors.primary.sky
                                }
                              }} 
                            />
                          )}
                          {entry.location_name && (
                            <Chip 
                              icon={<LocationOn />}
                              label={entry.location_name}
                              sx={{ 
                                bgcolor: `${travelColors.primary.coral}20`,
                                color: travelColors.primary.coral,
                                '& .MuiChip-icon': {
                                  color: travelColors.primary.coral
                                }
                              }} 
                            />
                          )}
                        </Stack>
                        {entry.created_at && (
                          <Chip 
                            label={new Date(entry.created_at).toLocaleString()}
                            sx={{ 
                              bgcolor: `${travelColors.text.secondary}15`,
                              color: travelColors.text.secondary
                            }} 
                          />
                        )}
                      </Stack>

                      {/* Journal content */}
                      {entry.note && (
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 2, 
                            color: travelColors.text.primary,
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                            fontStyle: entry.note.includes('trip of') ? 'italic' : 'normal'
                          }}
                        >
                          {entry.note}
                        </Typography>
                      )}

                      {/* Photo gallery */}
                      {renderPhotos(entry.photos)}

                      {/* Trip link */}
                      {entry.trip_id && (
                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                          <AdventureButton
                            size="small"
                            buttonVariant="ocean"
                            startIcon={<Map />}
                            onClick={() => window.location.href = `/trips/${entry.trip_id}`}
                          >
                            View Full Trip
                          </AdventureButton>
                        </Stack>
                      )}
                    </TravelCard>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {/* Stats section */}
          {sorted.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <TravelCard
                cardVariant="forest"
                cardElevation="high"
                borderAccent
                sx={{ p: 4, mt: 4, textAlign: 'center' }}
              >
                <Box sx={{ mb: 3 }}>
                  <Timeline sx={{ fontSize: 32, color: travelColors.primary.forest, mb: 2 }} />
                  <TravelText
                    text="Journal Statistics"
                    textVariant="gradient"
                    animated
                    variant="h5"
                  />
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h3" sx={{ color: travelColors.primary.ocean, fontWeight: 'bold', mb: 1 }}>
                      {sorted.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                      Journal Entries
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h3" sx={{ color: travelColors.primary.coral, fontWeight: 'bold', mb: 1 }}>
                      {trips.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                      Total Adventures
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h3" sx={{ color: travelColors.primary.sunset, fontWeight: 'bold', mb: 1 }}>
                      {sorted.reduce((sum, entry) => sum + (Array.isArray(entry.photos) ? entry.photos.length : 0), 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                      Photos Captured
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="h3" sx={{ color: travelColors.primary.forest, fontWeight: 'bold', mb: 1 }}>
                      {trips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: travelColors.text.secondary }}>
                      Total Distance (km)
                    </Typography>
                  </Grid>
                </Grid>
              </TravelCard>
            </motion.div>
          )}

          {/* Enhanced Photo Upload Panel */}
          <Collapse in={showPhotoUpload}>
            <TravelCard
              cardVariant="ocean"
              cardElevation="high"
              borderAccent
              sx={{ p: 3, mt: 3 }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CloudUpload sx={{ fontSize: 32, color: travelColors.primary.ocean }} />
                  <TravelText
                    text="Enhanced Photo Upload"
                    textVariant="adventure"
                    variant="h5"
                  />
                </Box>
                <IconButton 
                  onClick={() => setShowPhotoUpload(false)}
                  sx={{ color: travelColors.primary.ocean }}
                >
                  <Close />
                </IconButton>
              </Stack>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>✨ New Enhanced Features:</strong> Drag & drop photos, automatic compression, 
                  location data extraction, EXIF metadata viewing, and smart image optimization!
                </Typography>
              </Alert>

              <EnhancedPhotoUpload
                onPhotosChange={setNewPhotos}
                maxFiles={20}
                maxFileSizeMB={25}
                compressImages={true}
                compressionQuality={0.85}
                showMetadata={true}
                enableGeolocation={true}
              />
              
              {/* Journal Entry Creation */}
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <NoteAdd sx={{ fontSize: 24, color: travelColors.primary.ocean }} />
                <Typography variant="h6">
                  Create Journal Entry
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="What's on your mind? Describe your experience, thoughts, or memories..."
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: travelColors.primary.ocean,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: travelColors.primary.ocean,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: travelColors.primary.ocean,
                  },
                }}
              />

              {newPhotos.length > 0 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="body2" color="success.contrastText" sx={{ mb: 1 }}>
                    📸 <strong>{newPhotos.length} photos ready!</strong> These enhanced photos include:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {newPhotos.some(p => p.compressed) && (
                      <Chip label="Compressed images" size="small" color="success" />
                    )}
                    {newPhotos.some(p => p.metadata.location) && (
                      <Chip label="GPS coordinates" size="small" color="success" />
                    )}
                    <Chip label="EXIF metadata" size="small" color="success" />
                    <Chip label="Smart optimization" size="small" color="success" />
                  </Stack>
                </Box>
              )}
              
              {/* Save/Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={saveJournalEntry}
                  disabled={isSaving || (!journalNote.trim() && newPhotos.length === 0)}
                  sx={{
                    bgcolor: travelColors.primary.ocean,
                    color: 'white',
                    borderRadius: '12px',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: travelColors.primary.forest,
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Journal Entry'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setJournalNote('');
                    setNewPhotos([]);
                    setShowPhotoUpload(false);
                  }}
                  disabled={isSaving}
                  sx={{
                    borderColor: travelColors.primary.coral,
                    color: travelColors.primary.coral,
                    borderRadius: '12px',
                    py: 1.5,
                    '&:hover': {
                      borderColor: travelColors.primary.coral,
                      bgcolor: `${travelColors.primary.coral}10`,
                    }
                  }}
                >
                  Cancel
                </Button>
              </Stack>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                💡 <strong>Tip:</strong> Your journal entry will include the note, photos with captions, and any GPS location data from your images.
              </Typography>
            </TravelCard>
          </Collapse>
        </motion.div>
      </Container>
      
      {/* Enhanced Photo Upload FAB */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#1de9b6', // Bright cyan for high visibility
          color: '#000',      // Black for contrast
          width: 64,
          height: 64,
          boxShadow: '0 8px 24px rgba(29, 233, 182, 0.4)',
          border: '2px solid rgba(29, 233, 182, 0.6)',
          '&:hover': {
            bgcolor: '#00e676',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 32px rgba(29, 233, 182, 0.6)'
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: '50%',
            border: '2px solid #1de9b6',
            animation: error ? 'pulse 2s infinite' : 'none'
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.7
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1
            }
          },
          transition: 'all 0.3s ease',
          zIndex: 9999
        }}
        onClick={() => setShowPhotoUpload(!showPhotoUpload)}
      >
        {showPhotoUpload ? <Close fontSize="large" /> : <Add fontSize="large" />}
      </Fab>
    </Box>
  );
};

export default JournalPage;