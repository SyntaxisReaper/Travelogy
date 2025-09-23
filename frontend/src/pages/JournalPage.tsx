import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Box, Stack, Chip } from '@mui/material';
import { tripsAPI } from '../services/api';

interface DiaryEntry { id?: string; note?: string; photos?: string[]; created_at?: string; trip_id?: string }

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Try a dedicated timeline endpoint if available, else collect from trips
        const tl = await tripsAPI.getTimeline().catch(() => null);
        if (tl && Array.isArray(tl?.results || tl)) {
          setEntries((tl.results || tl) as DiaryEntry[]);
          return;
        }
        const trips = await tripsAPI.getTrips();
        const all: DiaryEntry[] = [];
        const list = Array.isArray(trips?.results) ? trips.results : Array.isArray(trips) ? trips : [];
        for (const t of list) {
          const ds = t.diaries || t.diary_entries || [];
          ds.forEach((d: any) => all.push({ ...d, trip_id: t.id }));
        }
        setEntries(all);
      } catch (e) {
        setError('Failed to load journal entries');
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📓 Travel Journal
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {!sorted.length && (
        <Typography variant="body2" color="text.secondary">No journal entries yet. Start a trip and add a diary entry.</Typography>
      )}
      <Stack spacing={2}>
        {sorted.map((d, i) => (
          <Paper key={d.id || i} sx={{ p: 2 }}>
            {d.created_at && <Chip label={new Date(d.created_at).toLocaleString()} sx={{ mb: 1 }} />}
            {d.note && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                {d.note}
              </Typography>
            )}
            {Array.isArray(d.photos) && d.photos.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {d.photos.map((u, j) => (
                  <Box key={j} component="img" src={u} alt={`photo-${j}`} sx={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 1 }} />
                ))}
              </Box>
            )}
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default JournalPage;
