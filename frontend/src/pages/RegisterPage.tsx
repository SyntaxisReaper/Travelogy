import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Link,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signUpWithEmail, getAuthErrorMessage, signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../services/authService';import { auth } from '../services/firebase';import type { Auth as FirebaseAuth } from 'firebase/auth';import { useAppDispatch } from '../store/hooks';import { register as backendRegister } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { colors } from '../styles/techTheme';
import HolographicCard from '../components/HolographicCard';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import { extractErrorCode } from '../utils/error';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // If Firebase auth isn't available, skip auto-redirect logic and just render the page.

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError('Please accept the terms of service and privacy policy');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (auth as FirebaseAuth | null) {
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
      } else {
        await dispatch(backendRegister({
          email: formData.email,
          password: formData.password,
          username: formData.displayName || formData.email.split('@')[0],
        }) as any).unwrap();
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(extractErrorCode(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!(auth as FirebaseAuth | null)) { setError('Social login unavailable. Please use email/password.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(extractErrorCode(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (!(auth as FirebaseAuth | null)) { setError('Social login unavailable. Please use email/password.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await signInWithFacebook();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(extractErrorCode(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSignIn = async () => {
    if (!(auth as FirebaseAuth | null)) { setError('Social login unavailable. Please use email/password.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await signInWithTwitter();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(getAuthErrorMessage(extractErrorCode(err)));
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
            glowColor={colors.neonGreen}
            intensity="high"
            animated
            sx={{ p: 4, mb: 4 }}
          >
            <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
              <GlitchText
                text="🌟 Join Travelogy"
                variant="h4"
                glitchIntensity="low"
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Create your neural travel profile
              </Typography>

              <Box component="form" onSubmit={handleRegister} sx={{ textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonGreen + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonGreen + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonGreen,
                        boxShadow: `0 0 10px ${colors.neonGreen}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonGreen + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonGreen + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonGreen,
                        boxShadow: `0 0 10px ${colors.neonGreen}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonGreen + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonGreen + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonGreen,
                        boxShadow: `0 0 10px ${colors.neonGreen}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonGreen,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colors.neonGreen + '40',
                      },
                      '&:hover fieldset': {
                        borderColor: colors.neonGreen + '80',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.neonGreen,
                        boxShadow: `0 0 10px ${colors.neonGreen}40`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colors.neonGreen,
                    },
                  }}
                />

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        sx={{
                          color: colors.neonGreen,
                          '&.Mui-checked': {
                            color: colors.neonGreen,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I accept the{' '}
                        <Link
                          href="#"
                          sx={{
                            color: colors.neonCyan,
                            textDecoration: 'none',
                            '&:hover': {
                              textShadow: `0 0 5px ${colors.neonCyan}`,
                            },
                          }}
                        >
                          Terms of Service
                        </Link>
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        sx={{
                          color: colors.neonGreen,
                          '&.Mui-checked': {
                            color: colors.neonGreen,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I accept the{' '}
                        <Link
                          href="#"
                          sx={{
                            color: colors.neonCyan,
                            textDecoration: 'none',
                            '&:hover': {
                              textShadow: `0 0 5px ${colors.neonCyan}`,
                            },
                          }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box sx={{ mt: 3, mb: 2 }}>
                  <NeonButton
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    glowColor={colors.neonGreen}
                    pulseAnimation={isLoading}
                    size="large"
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: colors.neonGreen }} />
                        Creating Neural Profile...
                      </>
                    ) : (
                      '🚀 Join Network'
                    )}
                  </NeonButton>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.neonGreen + '30' }} />

                {/* Social Login Buttons */}
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, opacity: 0.8 }}>
                  Or join with
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <NeonButton
                    fullWidth
                    disabled={isLoading}
                    glowColor={colors.glitchRed}
                    size="medium"
                    onClick={handleGoogleSignIn}
                  >
                    🌐 Google
                  </NeonButton>
                  <NeonButton
                    fullWidth
                    disabled={isLoading}
                    glowColor={colors.neonBlue}
                    size="medium"
                    onClick={handleFacebookSignIn}
                  >
                    📘 Facebook
                  </NeonButton>
                  <NeonButton
                    fullWidth
                    disabled={isLoading}
                    glowColor={colors.neonCyan}
                    size="medium"
                    onClick={handleTwitterSignIn}
                  >
                    🐦 Twitter
                  </NeonButton>
                </Box>

                <Divider sx={{ my: 2, borderColor: colors.neonGreen + '30' }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Already have an account?
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: colors.neonCyan,
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textShadow: `0 0 5px ${colors.neonCyan}`,
                      },
                    }}
                  >
                    🔑 Access Dashboard
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

export default RegisterPage;
