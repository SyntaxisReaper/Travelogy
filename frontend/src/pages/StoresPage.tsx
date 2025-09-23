import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, TextField, Button, Stack, Chip, Divider } from '@mui/material';
import { storesAPI } from '../services/api';

interface Store { id: string; name: string; items: { id: string; name: string; price: number }[] }

const StoresPage: React.FC = () => {
  const [q, setQ] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [cart, setCart] = useState<Array<{ store_id: string; item_id: string; name: string; price: number; qty: number }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await storesAPI.getStores({ q });
        setStores(Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : []);
      } catch (e) {
        setStores([]);
      }
    };
    load();
  }, [q]);

  const addToCart = (s: Store, it: Store['items'][number]) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.item_id === it.id && x.store_id === s.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { store_id: s.id, item_id: it.id, name: it.name, price: it.price, qty: 1 }];
    });
  };

  const total = useMemo(() => cart.reduce((sum, x) => sum + x.price * x.qty, 0), [cart]);

  const checkout = async () => {
    try {
      const payload = { items: cart.map(({ store_id, item_id, qty }) => ({ store_id, item_id, qty })) };
      const res = await storesAPI.checkout(payload);
      alert(`Order placed: ${res.order_id || 'OK'}`);
      setCart([]);
    } catch (e) {
      alert('Checkout failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>🛒 Local Stores</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Search items or stores" value={q} onChange={(e) => setQ(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label={`Cart: ${cart.length} items`} />
              <Chip label={`Total: $${total.toFixed(2)}`} color="success" />
              <Button variant="contained" onClick={checkout} disabled={!cart.length}>Checkout</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {stores.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{s.name}</Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                {s.items.map((it) => (
                  <Stack key={it.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                    <Typography>{it.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={`$${it.price}`} />
                      <Button size="small" variant="outlined" onClick={() => addToCart(s, it)}>Add</Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StoresPage;
