import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
  themeMode: 'light' | 'dark';
  themeFont: 'tech' | 'system' | 'mono' | 'grotesk';
  accent: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'blue' | 'teal' | 'amber';
  onChangeThemeMode: (m: 'light' | 'dark') => void;
  onChangeThemeFont: (f: 'tech' | 'system' | 'mono' | 'grotesk') => void;
  onChangeAccent: (a: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'blue' | 'teal' | 'amber') => void;
}

const ACCENTS: ThemePanelProps['accent'][] = ['cyan','pink','green','orange','purple','blue','teal','amber'];
const FONTS: ThemePanelProps['themeFont'][] = ['tech','system','mono','grotesk'];

const ThemePanel: React.FC<ThemePanelProps> = ({ open, onClose, themeMode, themeFont, accent, onChangeThemeMode, onChangeThemeFont, onChangeAccent }) => {
  const accentPreview: Record<string,string> = {
    cyan: '#1de9b6', pink: '#ff4081', green: '#66bb6a', orange: '#ffa726', purple: '#ab47bc', blue: '#42a5f5', teal: '#26a69a', amber: '#ffca28'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customize Theme</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Mode</Typography>
            <ToggleButtonGroup exclusive value={themeMode} onChange={(_, v) => v && onChangeThemeMode(v)} size="small">
              <ToggleButton value="dark">Dark</ToggleButton>
              <ToggleButton value="light">Light</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Font</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {FONTS.map((f) => (
                <Chip key={f} label={f} color={themeFont===f? 'primary' : 'default'} onClick={() => onChangeThemeFont(f)} />
              ))}
            </Stack>
            <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>Preview Heading</Typography>
              <Typography variant="body1">The quick brown fox jumps over the lazy dog 1234567890</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Accent</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ACCENTS.map((a) => (
                <Button key={a} variant={accent===a? 'contained' : 'outlined'} onClick={() => onChangeAccent(a)} sx={{
                  minWidth: 48,
                  p: 0,
                  borderColor: accentPreview[a],
                  color: accentPreview[a],
                  '&.MuiButton-contained': { backgroundColor: accentPreview[a], color: '#0c0f14' }
                }}>
                  {a}
                </Button>
              ))}
            </Stack>
            <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>Accent Preview</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" variant="outlined" />
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemePanel;