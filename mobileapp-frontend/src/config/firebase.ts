// Firebase Configuration for Mobile App
// This mirrors the webapp-frontend firebase config

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration - use environment variables in production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDqK_7G0p6h9y7r2t4e6w8u0i1o2p3q4r",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "lanka-crafts.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "lanka-crafts",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "lanka-crafts.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('[Firebase] Initialized successfully');
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
  // Create a fallback for development
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };
export default app;