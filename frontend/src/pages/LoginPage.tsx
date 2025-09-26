import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Link,
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmail, resetPassword, getAuthErrorMessage, signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../services/authService';
import { motion } from 'framer-motion';
import { colors } from '../styles/techTheme';
import HolographicCard from '../components/HolographicCard';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import { extractErrorCode } from '../utils/error';
import { auth } from '../services/firebase';
import type { Auth as FirebaseAuth } from 'firebase/auth';
import { useAppDispatch } from '../store/hooks';
import { login as backendLogin } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // If Firebase auth isn't available, skip auto-redirect logic and just render the page.

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (auth) {
        // Use Firebase authentication
        await signInWithEmail(email, password);
        navigate('/dashboard');
      } else {
        // Backend login fallback (Django JWT)
        await dispatch(backendLogin({ email, password }) as any).unwrap();
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const code = extractErrorCode(err);
      setError(getAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await resetPassword(email);
      setResetEmailSent(true);
      setError('');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(extractErrorCode(err)));
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) { 
      setError('Google sign-in is not available. Please use email/password login.'); 
      return; 
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = extractErrorCode(err);
      setError(getAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (!auth) { 
      setError('Facebook sign-in is not available. Please use email/password login.'); 
      return; 
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithFacebook();
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = extractErrorCode(err);
      setError(getAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSignIn = async () => {
    if (!auth) { 
      setError('Twitter sign-in is not available. Please use email/password login.'); 
      return; 
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithTwitter();
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = extractErrorCode(err);
      setError(getAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box sx={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at center, ${colors.deepSpace} 0%, ${colors.darkBg} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HolographicCard
            glowColor={colors.neonCyan}
            intensity="high"
            animated
            sx={{ p: 4, mb: 4 }}
          >
            <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
              <GlitchText
                text="🌐 Travelogy Login"
                variant="h4"
                glitchIntensity="low"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Access your neural travel dashboard
              </Typography>

              <Box component="form" onSubmit={handleLogin} sx={{ textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonCyan + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonCyan + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonCyan,
                        boxShadow: `0 0 10px ${colors.neonCyan}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonCyan,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonCyan + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonCyan + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonCyan,
                        boxShadow: `0 0 10px ${colors.neonCyan}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonCyan,
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {resetEmailSent && (
                  <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                    Password reset email sent! Check your inbox.
                  </Alert>
                )}

                <Box sx={{ mt: 3, mb: 2 }}>
                  <NeonButton
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    glowColor={colors.neonCyan}
                    pulseAnimation={isLoading}
                    size="large"
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: colors.neonCyan }} />
                        Accessing Neural Network...
                      </>
                    ) : (
                      '🚀 Access Dashboard'
                    )}
                  </NeonButton>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.neonCyan + '30' }} />

                {/* Social Login Buttons */}
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, opacity: 0.8 }}>
                  Or continue with
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                  <NeonButton
                    fullWidth
                    disabled={isLoading || !auth}
                    glowColor={colors.glitchRed}
                    size="medium"
                    onClick={handleGoogleSignIn}
                  >
                    🌐 Google
                  </NeonButton>
                  <NeonButton
                    fullWidth
                    disabled={isLoading || !auth}
                    glowColor={colors.neonBlue}
                    size="medium"
                    onClick={handleFacebookSignIn}
                  >
                    📘 Facebook
                  </NeonButton>
                  <NeonButton
                    fullWidth
                    disabled={isLoading || !auth}
                    glowColor={colors.neonCyan}
                    size="medium"
                    onClick={handleTwitterSignIn}
                  >
                    🐦 Twitter
                  </NeonButton>
                </Box>
                {!auth && (
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', opacity: 0.7 }}>
                    Social sign-in is ready. Try Google, Facebook, or Twitter above!
                  </Typography>
                )}

                <Divider sx={{ my: 2, borderColor: colors.neonCyan + '30' }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handleForgotPassword}
                    sx={{
                      color: colors.neonPink,
                      textDecoration: 'none',
                      '&:hover': {
                        textShadow: `0 0 5px ${colors.neonPink}`,
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Don&apos;t have an account?
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: colors.neonGreen,
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textShadow: `0 0 5px ${colors.neonGreen}`,
                      },
                    }}
                  >
                    🌟 Join the Network
                  </Link>
                </Box>
              </Box>
            </Box>
          </HolographicCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
