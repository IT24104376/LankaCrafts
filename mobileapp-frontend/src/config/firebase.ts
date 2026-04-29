import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
// @ts-ignore
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY ?? FIREBASE_API_KEY ?? process.env.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN ?? FIREBASE_AUTH_DOMAIN ?? process.env.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID ?? FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET ?? FIREBASE_STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    extra.FIREBASE_MESSAGING_SENDER_ID ??
    FIREBASE_MESSAGING_SENDER_ID ??
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID ?? FIREBASE_APP_ID ?? process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage for auth persistence in React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
