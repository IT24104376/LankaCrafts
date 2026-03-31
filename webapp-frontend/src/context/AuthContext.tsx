import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { registerTourist, loginTourist, getProfile } from '../services/api';

interface TouristProfile {
  id: string;
  fullName: string;
  callingName: string;
  email: string;
  country: string;
  interests: string[];
  preferredLanguages: string[];
  preferredRegions: string[];
  savedWorkshops: string[];
  initials: string;
  idNumber?: string;
  dateOfBirth?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
  };
  profilePicUrl?: string;
}

interface AuthContextType {
  firebaseUser: User | null;
  tourist: TouristProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    profileData: object
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [tourist, setTourist] = useState<TouristProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Try to load profile from backend on page reload
        try {
          const res = await loginTourist();
          setTourist(res.data.tourist);
        } catch {
          // Profile may not exist yet (during registration)
          setTourist(null);
        }
      } else {
        setTourist(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will fire and load the profile automatically
  };

  const register = async (
    email: string,
    password: string,
    profileData: object
  ) => {
    // 1. Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Create MongoDB profile (token is auto-attached by api.ts interceptor)
    const res = await registerTourist({ email, ...profileData });
    setTourist(res.data.tourist);

    // Silence unused variable warning
    void userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setTourist(null);
    setFirebaseUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getProfile();
      setTourist(res.data.tourist);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, tourist, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
