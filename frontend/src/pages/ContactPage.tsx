import React, { useMemo, useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Stack, Link, IconButton } from '@mui/material';
import { LinkedIn, Instagram, GitHub, Email } from '@mui/icons-material';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mailtoHref = useMemo(() => {
    const to = 'mailto:team@skystack.dev';
    const subject = encodeURIComponent('Contact Team SkyStack');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    return `${to}?subject=${subject}&body=${body}`;
  }, [name, email, message]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Contact Team SkyStack</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Get in touch</Typography>
        <Stack spacing={2}>
          <TextField label="Your Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline minRows={4} />
          <Box>
            <Button variant="contained" color="primary" startIcon={<Email />} href={mailtoHref} target="_blank" rel="noopener noreferrer">
              Send Message
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Social Links</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton component={Link} href="https://www.linkedin.com/in/ritesh-mishra-16161648lm" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedIn />
          </IconButton>
          <IconButton component={Link} href="https://www.instagram.com/skystack_.official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram />
          </IconButton>
          <IconButton component={Link} href="https://github.com/Akash943-ct" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitHub />
          </IconButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ContactPage;
