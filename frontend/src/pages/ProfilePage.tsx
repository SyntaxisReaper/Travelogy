import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, TextField, Button, Stack, Alert, FormGroup, FormControlLabel, Checkbox, Chip, CircularProgress, Avatar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUser, updateUserProfile, clearError, updateConsent } from '../store/slices/authSlice';
import { authAPI, bookingsAPI, gamificationAPI } from '../services/api';
import EmergencySOS from '../components/EmergencySOS';
import { auth, googleProvider } from '../services/firebase';
import type { Auth, linkWithPopup, unlink } from 'firebase/auth';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error, hasGivenConsent } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [consent, setConsent] = useState({
    location_tracking_consent: false,
    data_sharing_consent: false,
    analytics_consent: false,
    marketing_consent: false,
  });
  const [savingConsent, setSavingConsent] = useState(false);

  // Reservations
  const [reservations, setReservations] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingsAPI.getReservations();
        setReservations(Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : []);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  // Gamification
  const [gami, setGami] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const r = await gamificationAPI.getProfile();
        setGami(r);
      } catch (e) {
        // If backend not available, compute locally
        try {
          const [stats, tripsRes] = await Promise.all([
            authAPI.getProfile().then(() => import('../services/api').then(({ tripsAPI }) => tripsAPI.getStats())).catch(() => ({ total_trips: 0, eco_score: 0 })),
            import('../services/api').then(({ tripsAPI }) => tripsAPI.getTrips()),
          ]);
          const list = Array.isArray((tripsRes as any)?.results) ? (tripsRes as any).results : Array.isArray(tripsRes as any) ? (tripsRes as any) : [];
          const mod = await import('../utils/gamification');
          const computed = mod.computeBadges(stats as any, list as any);
          setGami({ points: computed.points, badges: computed.badges });
        } catch (_) {
          // ignore
        }
      }
    };
    load();
  }, []);

  // Load/seed user on mount
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    } else {
      setForm({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
      setConsent({
        location_tracking_consent: !!user.location_tracking_consent,
        data_sharing_consent: !!user.data_sharing_consent,
        analytics_consent: !!user.analytics_consent,
        marketing_consent: !!user.marketing_consent,
      });
    }
  }, [user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    try {
      const payload = {
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      };
      const updated = await authAPI.updateProfile(payload);
      dispatch(updateUserProfile(updated));
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsent((c) => ({ ...c, [name]: checked }));
  };

  const handleSaveConsent = async () => {
    setSavingConsent(true);
    setSuccess(null);
    try {
      await dispatch(updateConsent(consent)).unwrap();
      setSuccess('Consent preferences saved');
    } catch (err) {
      console.error('Failed to save consent', err);
    } finally {
      setSavingConsent(false);
    }
  };

  const metaChips = useMemo(() => {
    if (!user) return null;
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label={`User: ${user.full_name || user.username}`} />
        <Chip label={`Email: ${user.email}`} />
        {user.created_at && <Chip label={`Joined: ${new Date(user.created_at).toLocaleDateString()}`} />}
        {user.last_activity && <Chip label={`Last active: ${new Date(user.last_activity).toLocaleString()}`} />}
      </Stack>
    );
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        👤 Profile
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Header with Avatar and basic info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {(() => {
            const fbUser = (auth as Auth | null)?.currentUser || null;
            const src = fbUser?.photoURL || user?.photo_url || undefined;
            const display = fbUser?.displayName || user?.full_name || user?.username || 'User';
            const email = fbUser?.email || user?.email || '';
            const initial = display?.[0] || 'U';
            return (
              <>
                <Avatar src={src} alt={display} sx={{ width: 64, height: 64 }}>
                  {!src ? initial : null}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>{display}</Typography>
                  <Typography variant="body2" color="text.secondary">{email}</Typography>
                </Box>
              </>
            );
          })()}
        </Box>
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>

        {!user && loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSave}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
              {metaChips}
            </Stack>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Privacy & Consent
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox name="location_tracking_consent" checked={consent.location_tracking_consent} onChange={handleConsentChange} />}
            label="Allow location tracking"
          />
          <FormControlLabel
            control={<Checkbox name="data_sharing_consent" checked={consent.data_sharing_consent} onChange={handleConsentChange} />}
            label="Allow data sharing for research"
          />
          <FormControlLabel
            control={<Checkbox name="analytics_consent" checked={consent.analytics_consent} onChange={handleConsentChange} />}
            label="Allow analytics personalization"
          />
          <FormControlLabel
            control={<Checkbox name="marketing_consent" checked={consent.marketing_consent} onChange={handleConsentChange} />}
            label="Allow marketing communication"
          />
        </FormGroup>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSaveConsent} disabled={savingConsent}>
            {savingConsent ? 'Saving…' : 'Save Preferences'}
          </Button>
          {hasGivenConsent && <Chip label="Basic Consent: Given" color="success" />}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Linked Accounts
        </Typography>
        {(() => {
          const fbUser = (auth as Auth | null)?.currentUser || null;
          const providers = fbUser?.providerData?.map((p) => p.providerId) || [];
          const hasGoogle = providers.includes('google.com');
          const canUnlink = (fbUser?.providerData?.length || 0) > 1;

          const handleLinkGoogle = async () => {
            try {
              if (!fbUser) return;
              const mod = await import('firebase/auth');
              await mod.linkWithPopup(fbUser, googleProvider);
              setSuccess('Google account linked');
            } catch (e) {
              console.error('Link Google failed', e);
            }
          };

          const handleUnlinkGoogle = async () => {
            try {
              if (!fbUser) return;
              if (!canUnlink) {
                setSuccess('Cannot unlink the only sign-in method.');
                return;
              }
              const mod = await import('firebase/auth');
              await mod.unlink(fbUser, 'google.com');
              setSuccess('Google account unlinked');
            } catch (e) {
              console.error('Unlink Google failed', e);
            }
          };

          return (
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Chip label={hasGoogle ? 'Google: Connected' : 'Google: Not connected'} color={hasGoogle ? 'success' : 'default'} />
              {!hasGoogle ? (
                <Button variant="outlined" onClick={handleLinkGoogle}>Connect Google</Button>
              ) : (
                <Button variant="outlined" color="warning" onClick={handleUnlinkGoogle} disabled={!canUnlink}>Disconnect Google</Button>
              )}
            </Stack>
          );
        })()}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reservations
        </Typography>
        {!reservations.length && (
          <Typography variant="body2" color="text.secondary">No reservations yet.</Typography>
        )}
        <Stack spacing={1}>
          {reservations.map((r) => (
            <Stack key={r.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Typography variant="body2">
                [{(r.type || r.category || '').toUpperCase()}] {r.name || r.title} • {r.date ? new Date(r.date).toLocaleString() : ''}
              </Typography>
              {/* Future: add cancel/manage buttons */}
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gamification
        </Typography>
        {!gami && (
          <Typography variant="body2" color="text.secondary">No gamification data yet.</Typography>
        )}
        {gami && (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip label={`Level ${gami.points?.level ?? 1}`} />
              <Chip label={`${gami.points?.total ?? 0} pts`} />
              <Chip label={`Streak: ${gami.points?.current_streak ?? 0} days`} color="success" />
            </Stack>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Badges</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(gami.badges || []).map((b: any, i: number) => (
                <Chip key={i} label={`${b.icon || '🏅'} ${b.name}`} sx={{ mb: 1 }} />
              ))}
            </Stack>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Safety & Emergency
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Use the red emergency button at the bottom-right anytime. Or click below to open the same emergency dialog.
        </Typography>
        <Box>
          <EmergencySOS mode="inline" />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Download My Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Export a JSON bundle of your profile, trips, reservations, and gamification.
        </Typography>
        <Button variant="outlined" onClick={async () => {
          try {
            const [profile, trips, reservations, gamiData] = await Promise.all([
              authAPI.getProfile().catch(() => null),
              import('../services/api').then(({ tripsAPI }) => tripsAPI.getTrips()).catch(() => []),
              bookingsAPI.getReservations().catch(() => []),
              gamificationAPI.getProfile().catch(() => null),
            ]);
            const bundle = { profile, trips, reservations, gamification: gamiData };
            const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-data.json';
            a.click();
            URL.revokeObjectURL(url);
          } catch (e) {
            console.error('Export failed', e);
          }
        }}>Download JSON</Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
