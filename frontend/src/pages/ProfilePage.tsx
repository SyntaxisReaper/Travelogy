import React, { useEffect, useMemo, useState } from 'react';
import { 
  Container, Typography, Paper, Box, Grid, TextField, Button, Stack, Alert, 
  FormGroup, FormControlLabel, Checkbox, Chip, CircularProgress, Avatar,
  Card, CardContent, IconButton, Fab
} from '@mui/material';
import {
  Palette, Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import EmergencySOS from '../components/EmergencySOS';
import AgeGroupThemePanel from '../components/AgeGroupThemePanel';
import { colors } from '../styles/techTheme';

// Mock user data for demonstration
const MOCK_USER = {
  id: 1,
  username: 'demo_user',
  email: 'demo@travelogy.com',
  first_name: 'Demo',
  last_name: 'User',
  full_name: 'Demo User',
  created_at: '2024-01-15T10:30:00Z',
  last_activity: '2024-09-27T15:00:00Z',
  location_tracking_consent: true,
  data_sharing_consent: false,
  analytics_consent: true,
  marketing_consent: false,
};

const MOCK_RESERVATIONS = [
  {
    id: 1,
    type: 'HOTEL',
    name: 'Grand Plaza Hotel',
    date: '2024-10-15T14:00:00Z',
    status: 'confirmed'
  },
  {
    id: 2,
    type: 'FLIGHT',
    name: 'Flight AA1234',
    date: '2024-11-02T09:30:00Z',
    status: 'pending'
  }
];

const MOCK_GAMIFICATION = {
  points: {
    total: 1250,
    level: 7,
    current_streak: 12
  },
  badges: [
    { name: 'Early Adopter', icon: '🚀' },
    { name: 'Eco Warrior', icon: '🌱' },
    { name: 'Explorer', icon: '🗺️' }
  ]
};

const ProfilePage: React.FC = () => {
  // Use mock data instead of Redux for now
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    username: MOCK_USER.username,
    email: MOCK_USER.email,
    first_name: MOCK_USER.first_name,
    last_name: MOCK_USER.last_name,
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  
  const [consent, setConsent] = useState({
    location_tracking_consent: MOCK_USER.location_tracking_consent,
    data_sharing_consent: MOCK_USER.data_sharing_consent,
    analytics_consent: MOCK_USER.analytics_consent,
    marketing_consent: MOCK_USER.marketing_consent,
  });
  
  const [savingConsent, setSavingConsent] = useState(false);
  const [fbSubject, setFbSubject] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [gami, setGami] = useState(MOCK_GAMIFICATION);
  const hasGivenConsent = true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setUser(prev => ({ ...prev, ...form }));
      setSuccess('Profile updated successfully');
      setSaving(false);
    }, 1000);
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConsent((c) => ({ ...c, [name]: checked }));
  };

  const handleSaveConsent = async () => {
    setSavingConsent(true);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Consent preferences saved');
      setSavingConsent(false);
    }, 800);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(45deg, #2196f3, #9c27b0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            👤 Profile Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={() => setThemeDialogOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Palette />
            </IconButton>
          </Stack>
        </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

        {/* Header with Avatar and basic info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ 
            mb: 3, 
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: colors.neonCyan }}>
                  {user?.full_name?.[0] || user?.username?.[0] || 'D'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>{user?.full_name || user?.username || 'Demo User'}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email || 'demo@travelogy.com'}</Typography>
                </Box>
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
            </CardContent>
          </Card>
        </motion.div>

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

      {/* Change Password */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <ChangePasswordForm />
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Linked Accounts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connect external accounts for easier login and data sync.
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Chip label="Google: Demo Account" color="success" />
          <Chip label="Facebook: Not connected" color="default" />
          <Button 
            variant="outlined" 
            onClick={() => setSuccess('Account linking is available in the full version!')}
            disabled
          >
            Manage Connections
          </Button>
        </Stack>
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
                [{(r.type || '').toUpperCase()}] {r.name} • {r.date ? new Date(r.date).toLocaleString() : ''}
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

      {/* Feedback Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Feedback
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tell Team SkyStack what you think. Share bugs, ideas, or general comments.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Subject" fullWidth value={fbSubject} onChange={(e) => setFbSubject(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Message" fullWidth multiline minRows={4} value={fbMessage} onChange={(e) => setFbMessage(e.target.value)} />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => {
            if (!fbSubject || !fbMessage) {
              setError('Please fill in both subject and message');
              return;
            }
            
            // Use mailto as fallback
            const to = 'mailto:team@skystack.dev';
            const subject = encodeURIComponent(fbSubject);
            const from = user?.email || 'demo@travelogy.com';
            const body = encodeURIComponent(`${fbMessage}\n\nFrom: ${from}`);
            window.location.href = `${to}?subject=${subject}&body=${body}`;
            
            setSuccess('Feedback prepared! Your email client should open.');
            setFbSubject('');
            setFbMessage('');
          }}>
            Send Feedback
          </Button>
          <Button variant="text" onClick={() => {
            setFbSubject('');
            setFbMessage('');
          }}>Clear</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Download My Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Export a JSON bundle of your profile, trips, reservations, and gamification.
        </Typography>
        <Button variant="outlined" onClick={() => {
          // Use mock data for demo
          const bundle = {
            profile: user,
            trips: [{ id: 1, name: 'Demo Trip', date: '2024-10-01' }],
            reservations: reservations,
            gamification: gami
          };
          
          const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'travelogy-demo-data.json';
          a.click();
          URL.revokeObjectURL(url);
          
          setSuccess('Demo data exported successfully!');
        }}>Download JSON</Button>
      </Paper>
      
      {/* Theme Settings Dialog */}
      <AgeGroupThemePanel 
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />
      
      {/* Emergency Floating Action Button */}
      <Fab
        color="error"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          '&:hover': {
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease'
        }}
        onClick={() => {
          // Trigger emergency SOS
          document.dispatchEvent(new CustomEvent('emergency-activate'));
        }}
      >
        <Warning />
      </Fab>
      </motion.div>
    </Container>
  );
};

const ChangePasswordForm: React.FC = () => {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    setError(null); setSuccess(null); setLoading(true);
    
    // Basic validation
    if (newPwd !== newPwd2) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    if (newPwd.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Password changed successfully (demo mode)');
      setOldPwd(''); setNewPwd(''); setNewPwd2('');
      setLoading(false);
    }, 1000);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField label="Current Password" type="password" fullWidth value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="New Password" type="password" fullWidth value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Confirm New Password" type="password" fullWidth value={newPwd2} onChange={(e) => setNewPwd2(e.target.value)} />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={submit} disabled={loading || !oldPwd || !newPwd || !newPwd2}>
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfilePage;
