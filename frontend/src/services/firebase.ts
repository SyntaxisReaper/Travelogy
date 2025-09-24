// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, setPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
import { FIREBASE_CONFIG } from '../config/env';

// Safe initialization that won't crash the app if env is missing/misconfigured
let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;

try {
  if (FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.appId) {
    app = initializeApp(FIREBASE_CONFIG as any);
    auth = getAuth(app);
    // Prevent automatic sign-in persistence across reloads unless the user explicitly signs in
    // Use in-memory persistence so a full reload returns to a logged-out state
    setPersistence(auth, inMemoryPersistence).catch((e) => console.warn('[firebase] setPersistence failed', e));
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // eslint-disable-next-line no-console
    console.warn('[firebase] Missing config. Skipping Firebase initialization.');
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[firebase] Initialization failed. Running without Firebase.', e);
}

// Initialize Auth Providers (safe regardless of app init)
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
