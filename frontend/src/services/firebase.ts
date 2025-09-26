// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOeiar5dxHvmzruoiXWC9bUMi32RLza60",
  authDomain: "travelogy-c645554.firebaseapp.com",
  projectId: "travelogy-c645554",
  storageBucket: "travelogy-c645554.firebasestorage.app",
  messagingSenderId: "19390024183",
  appId: "1:19390024183:web:932b3d40156f8cfb0346f2",
  measurementId: "G-905E97MQG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only if supported)
let analytics: any = null;
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
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
