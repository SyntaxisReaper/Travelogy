// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration (from environment)
import { FIREBASE_CONFIG } from '../config/env';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG as any);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only if supported)
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
} catch (e) {
  console.warn('Analytics initialization failed:', e);
}

// Set auth persistence
try {
  setPersistence(auth, browserLocalPersistence);
} catch (e) {
  console.warn('Auth persistence setup failed:', e);
}

export { analytics };

// Initialize Auth Providers (safe regardless of app init)
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
  // Add additional parameters that might help with domain issues
  hd: '' // Allow any hosted domain
});

// Debug: Log current domain for troubleshooting
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Debug Info:');
  console.log('Current domain:', window.location.hostname);
  console.log('Current origin:', window.location.origin);
  console.log('Firebase auth domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
  console.log('If Google sign-in fails, add this domain to Firebase Console > Authentication > Settings > Authorized domains');
}

export default app;
