import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, twitterProvider } from './firebase';
import { authAPI } from './api';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  travelStats?: {
    totalTrips: number;
    totalDistance: number;
    favoriteTransport: string;
    sustainabilityScore: number;
  };
}

const ensureFirebase = () => {
  if (!auth || !db) {
    const err: any = new Error('Authentication is not configured');
    err.code = 'auth/config-missing';
    throw err;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  try {
    ensureFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
    const user = userCredential.user;
    
    // Update the user's display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Create user profile in Firestore (best-effort — don't block auth if it fails)
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        travelStats: {
          totalTrips: 0,
          totalDistance: 0,
          favoriteTransport: '',
          sustainabilityScore: 100
        }
      };
      await setDoc(doc(db!, 'users', user.uid), userProfile);
    } catch (e) {
      console.warn('signUp: profile write skipped', e);
    }
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    ensureFirebase();
    const userCredential = await signInWithEmailAndPassword(auth!, email, password);
    const user = userCredential.user;
    
    // Update last login time (best-effort)
    try {
      const userRef = doc(db!, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
      }
    } catch (e) {
      console.warn('signIn: lastLoginAt write skipped', e);
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Best-effort backend sync of social profile
const syncProfileToBackend = async (user: User) => {
  try {
    const display = user.displayName || '';
    let first_name = '';
    let last_name = '';
    if (display) {
      const parts = display.split(' ');
      first_name = parts[0] || '';
      last_name = parts.slice(1).join(' ') || '';
    }
    const payload: Partial<{ first_name: string; last_name: string; photo_url: string }> = {
      ...(first_name ? { first_name } : {}),
      ...(last_name ? { last_name } : {}),
      ...(user.photoURL ? { photo_url: user.photoURL } : {}),
    };
    if (Object.keys(payload).length > 0) {
      await authAPI.updateProfile(payload as any);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Backend profile sync skipped', e);
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    ensureFirebase();
    const result = await signInWithPopup(auth!, googleProvider);
    const user = result.user;
    
    // Check/create profile (best-effort)
    try {
      const userRef = doc(db!, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          travelStats: {
            totalTrips: 0,
            totalDistance: 0,
            favoriteTransport: '',
            sustainabilityScore: 100
          }
        };
        await setDoc(userRef, userProfile);
      } else {
        await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
      }
    } catch (e) {
      console.warn('google signIn: profile write skipped', e);
    }

    // Best-effort sync to backend
    await syncProfileToBackend(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async (): Promise<User> => {
  try {
    ensureFirebase();
    const result = await signInWithPopup(auth!, facebookProvider);
    const user = result.user;
    
    try {
      const userRef = doc(db!, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          travelStats: {
            totalTrips: 0,
            totalDistance: 0,
            favoriteTransport: '',
            sustainabilityScore: 100
          }
        };
        await setDoc(userRef, userProfile);
      } else {
        await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
      }
    } catch (e) {
      console.warn('facebook signIn: profile write skipped', e);
    }

    await syncProfileToBackend(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    throw error;
  }
};

// Sign in with Twitter
export const signInWithTwitter = async (): Promise<User> => {
  try {
    ensureFirebase();
    const result = await signInWithPopup(auth!, twitterProvider);
    const user = result.user;
    
    try {
      const userRef = doc(db!, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          travelStats: {
            totalTrips: 0,
            totalDistance: 0,
            favoriteTransport: '',
            sustainabilityScore: 100
          }
        };
        await setDoc(userRef, userProfile);
      } else {
        await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
      }
    } catch (e) {
      console.warn('twitter signIn: profile write skipped', e);
    }

    await syncProfileToBackend(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Twitter:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    ensureFirebase();
    await signOut(auth!);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    ensureFirebase();
    await sendPasswordResetEmail(auth!, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    ensureFirebase();
    const userRef = doc(db!, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    ensureFirebase();
    const userRef = doc(db!, 'users', uid);
    await setDoc(userRef, updates, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Firebase Auth error messages helper
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/auth-domain-config-required':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for authentication. Please contact support.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/config-missing':
      return 'Authentication is not configured. Please try again later or contact support.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
