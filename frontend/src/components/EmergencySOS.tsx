import React, { useCallback, useMemo, useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { LocalHospital, MyLocation, Warning } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { colors } from '../styles/techTheme';
import { emergencyAPI } from '../services/api';

interface NearbyPlace {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  distanceMeters: number;
  phone?: string;
}

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000; // meters
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface EmergencySOSProps { mode?: 'fab' | 'inline'; buttonLabel?: string }

const EmergencySOS: React.FC<EmergencySOSProps> = ({ mode = 'fab', buttonLabel = 'Medical Emergency' }) => {
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lon: number; accuracy?: number } | null>(null);
  const [nearest, setNearest] = useState<NearbyPlace | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const locateAndFindHospital = useCallback(async () => {
    setError(null);
    setNearest(null);
    setSent(false);
    setLoading(true);

    const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) reject(new Error('Geolocation not supported'));
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000 });
    });

    try {
      const pos = await getPosition();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setPosition({ lat, lon, accuracy: pos.coords.accuracy });

      // Overpass API: search for hospitals/clinics within ~3km
      const query = `[out:json];(node(around:3000,${lat},${lon})[amenity~"hospital|clinic"];way(around:3000,${lat},${lon})[amenity~"hospital|clinic"];);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      const candidates: NearbyPlace[] = (data.elements || []).map((el: any) => {
        const nlat = el.type === 'node' ? el.lat : el.center?.lat;
        const nlon = el.type === 'node' ? el.lon : el.center?.lon;
        const dist = nlat && nlon ? haversine(lat, lon, nlat, nlon) : Number.MAX_SAFE_INTEGER;
        const phone = el.tags?.["contact:phone"] || el.tags?.phone;
        return {
          id: el.id,
          name: el.tags?.name || 'Nearest hospital/clinic',
          lat: nlat,
          lon: nlon,
          distanceMeters: dist,
          phone,
        } as NearbyPlace;
      }).filter((p: NearbyPlace) => Number.isFinite(p.distanceMeters));

      if (!candidates.length) {
        setError('No hospitals found nearby. Please call local emergency services.');
      } else {
        const sorted = candidates.sort((a, b) => a.distanceMeters - b.distanceMeters);
        setNearest(sorted[0]);
      }
    } catch (e) {
      setError((e as Error).message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    locateAndFindHospital();
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setNearest(null);
    setSending(false);
    setSent(false);
  };

  const handleSend = async () => {
    if (!position) return;
    setSending(true);
    setError(null);
    try {
      const payload = {
        type: 'medical_emergency',
        timestamp: new Date().toISOString(),
        user: user ? { id: user.id, name: user.full_name, email: user.email } : null,
        location: { lat: position.lat, lon: position.lon, accuracy: position.accuracy },
        nearestHospital: nearest ? { name: nearest.name, lat: nearest.lat, lon: nearest.lon, distance_m: Math.round(nearest.distanceMeters) } : null,
        client: 'travelogy-frontend',
      };

      let delivered = false;
      try {
        await emergencyAPI.sendReport(payload);
        delivered = true;
      } catch (e) {
        delivered = false;
      }

      if (!delivered) {
        const text = `EMERGENCY: Medical assistance requested\n` +
          `Location: ${position.lat.toFixed(6)}, ${position.lon.toFixed(6)}\n` +
          (nearest ? `Nearest hospital: ${nearest.name} (~${Math.round(nearest.distanceMeters)} m)\n` : '') +
          (user ? `User: ${user.full_name} (${user.email})\n` : '') +
          `Map: https://www.openstreetmap.org/?mlat=${position.lat}&mlon=${position.lon}#map=18/${position.lat}/${position.lon}`;

        if (navigator.share) {
          await navigator.share({ title: 'Medical Emergency', text });
        } else {
          // Fallback: mailto draft
          const mailto = `mailto:?subject=${encodeURIComponent('Medical Emergency')}&body=${encodeURIComponent(text)}`;
          window.location.href = mailto;
        }
      }

      setSent(true);
    } catch (e) {
      setError('Failed to send emergency report. Try calling the hospital directly.');
    } finally {
      setSending(false);
    }
  };

  const hospitalInfo = useMemo(() => {
    if (!nearest) return null;
    const km = (nearest.distanceMeters / 1000).toFixed(2);
    return `${nearest.name} • ${km} km away`;
  }, [nearest]);

  return (
    <>
      {mode === 'fab' ? (
        <Fab
          color="error"
          aria-label="medical-emergency"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: (theme) => theme.spacing(3),
            right: (theme) => theme.spacing(3),
            zIndex: 1500,
            boxShadow: `0 0 15px ${colors.glitchRed}`,
          }}
        >
          <LocalHospital />
        </Fab>
      ) : (
        <Button variant="contained" color="error" startIcon={<LocalHospital />} onClick={handleOpen}>
          {buttonLabel}
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" /> Medical Emergency
        </DialogTitle>
        <DialogContent dividers>
          {loading && (
            <Box display="flex" alignItems="center" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {!loading && !error && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                We use your current location to notify the nearest hospital/clinic.
              </Typography>
              {position && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MyLocation fontSize="small" />
                  <Typography variant="body2">
                    {position.lat.toFixed(6)}, {position.lon.toFixed(6)} (±{Math.round(position.accuracy || 0)} m)
                  </Typography>
                </Box>
              )}
              {hospitalInfo && (
                <Typography variant="body2" color="text.secondary">
                  {hospitalInfo}
                </Typography>
              )}
              {nearest?.phone && (
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" color="inherit" component="a" href={`tel:${nearest.phone}`}>
                    Call hospital: {nearest.phone}
                  </Button>
                </Box>
              )}
              {sent && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Emergency report prepared. If a backend is configured, it has been notified. Otherwise, we shared a message you can send immediately.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Close</Button>
          <Button onClick={handleSend} variant="contained" color="error" disabled={loading || sending}>
            {sending ? 'Sending…' : 'Send Emergency Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmergencySOS;
