import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Tabs, Tab, Grid, TextField, Button, Stack, Alert, Divider, Chip, MenuItem } from '@mui/material';
import { bookingsAPI } from '../services/api';

interface HotelResult { id: string; name: string; price: number; rating?: number; address?: string }
interface TrainResult { id: string; name: string; number?: string; departure?: string; arrival?: string; class?: string; price?: number }

const BookingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  // Hotel search state
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
  const [searchingHotels, setSearchingHotels] = useState(false);
  const [hotelError, setHotelError] = useState<string | null>(null);
  const [hotelProvider, setHotelProvider] = useState('backend');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Train search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('');
  const [trainResults, setTrainResults] = useState<TrainResult[]>([]);
  const [searchingTrains, setSearchingTrains] = useState(false);
  const [trainError, setTrainError] = useState<string | null>(null);
  const [trainProvider, setTrainProvider] = useState('backend');
  const [passengers, setPassengers] = useState(1);

  const searchHotels = async () => {
    setHotelError(null);
    setSearchingHotels(true);
    try {
      const res = await bookingsAPI.searchHotels({ city, check_in: checkIn, check_out: checkOut, guests, provider: hotelProvider, rooms, adults, children });
      setHotelResults(Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : []);
    } catch (e) {
      setHotelError('Failed to search hotels');
    } finally {
      setSearchingHotels(false);
    }
  };

  const searchTrains = async () => {
    setTrainError(null);
    setSearchingTrains(true);
    try {
      const res = await bookingsAPI.searchTrains({ from, to, date, class: trainClass, provider: trainProvider, passengers });
      setTrainResults(Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : []);
    } catch (e) {
      setTrainError('Failed to search trains');
    } finally {
      setSearchingTrains(false);
    }
  };

  const bookHotel = async (h: HotelResult) => {
    try {
      await bookingsAPI.bookHotel({ hotel_id: h.id, check_in: checkIn, check_out: checkOut, guests });
      alert('Hotel booking initiated');
    } catch (e) {
      alert('Failed to book hotel');
    }
  };

  const bookTrain = async (t: TrainResult) => {
    try {
      await bookingsAPI.bookTrain({ train_id: t.id, from, to, date, class: trainClass });
      alert('Train booking initiated');
    } catch (e) {
      alert('Failed to book train');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧳 Bookings
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Hotels" />
          <Tab label="Trains" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        {/* Hotels Tab */}
        {tab === 0 && (
          <Box>
            {hotelError && <Alert severity="error" sx={{ mb: 2 }}>{hotelError}</Alert>}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Check-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField label="Rooms" type="number" inputProps={{ min: 1 }} value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value)))} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField label="Adults" type="number" inputProps={{ min: 1 }} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField label="Children" type="number" inputProps={{ min: 0 }} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))} fullWidth />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField select label="Provider" value={hotelProvider} onChange={(e) => setHotelProvider(e.target.value)} fullWidth>
                  <MenuItem value="backend">Backend</MenuItem>
                  <MenuItem value="amadeus">Amadeus</MenuItem>
                  <MenuItem value="dummy">Dummy</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={searchHotels} disabled={searchingHotels}>
              {searchingHotels ? 'Searching…' : 'Search Hotels'}
            </Button>

            <Box sx={{ mt: 3 }}>
              {hotelResults.map((h) => (
                <Paper key={h.id} sx={{ p: 2, mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1">{h.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{h.address}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label={`$${h.price}`} />
                        {h.rating ? <Chip label={`⭐ ${h.rating}`} /> : null}
                      </Stack>
                    </Box>
                    <Button variant="outlined" onClick={() => bookHotel(h)}>Book</Button>
                  </Stack>
                </Paper>
              ))}
              {hotelResults.length === 0 && (
                <Typography variant="body2" color="text.secondary">No hotels found. Try different dates or city.</Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Trains Tab */}
        {tab === 1 && (
          <Box>
            {trainError && <Alert severity="error" sx={{ mb: 2 }}>{trainError}</Alert>}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField label="From" value={from} onChange={(e) => setFrom(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="To" value={to} onChange={(e) => setTo(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label="Class" value={trainClass} onChange={(e) => setTrainClass(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField label="Pax" type="number" inputProps={{ min: 1 }} value={passengers} onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}>
                <TextField select label="Provider" value={trainProvider} onChange={(e) => setTrainProvider(e.target.value)} fullWidth>
                  <MenuItem value="backend">Backend</MenuItem>
                  <MenuItem value="irctc">IRCTC</MenuItem>
                  <MenuItem value="dummy">Dummy</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={searchTrains} disabled={searchingTrains}>
              {searchingTrains ? 'Searching…' : 'Search Trains'}
            </Button>

            <Box sx={{ mt: 3 }}>
              {trainResults.map((t) => (
                <Paper key={t.id} sx={{ p: 2, mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1">{t.name} {t.number ? `(${t.number})` : ''}</Typography>
                      <Typography variant="body2" color="text.secondary">{t.departure} → {t.arrival} {t.class ? `• ${t.class}` : ''}</Typography>
                      <Stack direction="row" spacing={1}>
                        {t.price ? <Chip label={`$${t.price}`} /> : null}
                      </Stack>
                    </Box>
                    <Button variant="outlined" onClick={() => bookTrain(t)}>Book</Button>
                  </Stack>
                </Paper>
              ))}
              {trainResults.length === 0 && (
                <Typography variant="body2" color="text.secondary">No trains found. Try different route/date.</Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookingsPage;
