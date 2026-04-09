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

interface ArtistProfile {
  id: string;
  fullName: string;
  callingName: string;
  email: string;
  phone?: string;
  craftType: string;
  bio: string;
  address?: {
    number?: string;
    street?: string;
    village?: string;
    city?: string;
    district?: string;
    province?: string;
    postalCode?: string;
  };
  location?: {
    type: string;
    coordinates: number[];
    formattedAddress: string;
  };
  specialties: string[];
  availability: Record<string, { morning: boolean; afternoon: boolean; evening: boolean }>;
  rating: number;
  reviewCount: number;
  initials: string;
  profilePicUrl?: string;
}

interface AuthContextType {
  firebaseUser: User | null;
  tourist: TouristProfile | null;
  artist: ArtistProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    profileData: object
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginArtist: (email: string, password: string) => Promise<void>;
  registerArtist: (
    email: string,
    password: string,
    profileData: object
  ) => Promise<void>;
  logoutArtist: () => Promise<void>;
  refreshArtist: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [tourist, setTourist] = useState<TouristProfile | null>(null);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const res = await loginTourist();
          setTourist(res.data.tourist);
        } catch {
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
  };

  const register = async (
    email: string,
    password: string,
    profileData: object
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const res = await registerTourist({ email, ...profileData });
    setTourist(res.data.tourist);
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

  const loginArtist = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerArtist = async (
    email: string,
    password: string,
    profileData: object
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    void userCredential;
  };

  const logoutArtist = async () => {
    await signOut(auth);
    setArtist(null);
    setFirebaseUser(null);
  };

  const refreshArtist = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/artist/profile`, {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      const data = await res.json();
      setArtist(data.artist);
    } catch (err) {
      console.error('Failed to refresh artist profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        firebaseUser, 
        tourist, 
        artist, 
        loading, 
        login, 
        register, 
        logout, 
        refreshUser,
        loginArtist,
        registerArtist,
        logoutArtist,
        refreshArtist
      }}
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
