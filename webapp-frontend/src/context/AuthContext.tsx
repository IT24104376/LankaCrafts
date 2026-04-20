import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { registerTourist, loginTourist, getProfile } from '../services/api';
import { loginAdmin, getMe } from '../api/adminApi';

// --- Interfaces ---

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

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
  savedCrafts: string[];
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
  reviews?: string[];
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
  // Common
  loading: boolean;

  // Tourist/Artist (Firebase)
  firebaseUser: User | null;
  tourist: TouristProfile | null;
  artist: ArtistProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profileData: object) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginArtist: (email: string, password: string) => Promise<void>;
  registerArtist: (email: string, password: string, profileData: object) => Promise<void>;
  logoutArtist: () => Promise<void>;
  refreshArtist: () => Promise<void>;

  // Admin (Custom JWT)
  admin: AdminUser | null;
  adminToken: string | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // State for Firebase Users
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [tourist, setTourist] = useState<TouristProfile | null>(null);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);

  // State for Admin
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('admin_token'));

  const [loading, setLoading] = useState(true);

  // --- Initialization Logic ---
  useEffect(() => {
    // 1. Initialize Firebase Auth
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
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

    // 2. Initialize Admin Auth
    const initAdmin = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        try {
          const res = await getMe();
          setAdmin(res.data.admin);
        } catch {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdminToken(null);
          setAdmin(null);
        }
      }
    };

    initAdmin();

    return () => unsubscribeFirebase();
  }, []);

  // --- Tourist Actions ---
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, profileData: object) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const res = await registerTourist({ email, ...profileData });
    setTourist(res.data.tourist);
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

  // --- Artist Actions ---
  const loginArtist = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerArtist = async (email: string, password: string, profileData: object) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logoutArtist = async () => {
    await signOut(auth);
    setArtist(null);
    setFirebaseUser(null);
  };

  const refreshArtist = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/artist/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setArtist(data.artist);
    } catch (err) {
      console.error('Failed to refresh artist profile:', err);
    }
  };

  // --- Admin Actions ---
  const adminLogin = async (email: string, password: string) => {
    const res = await loginAdmin(email, password);
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setAdminToken(newToken);
    setAdmin(adminData);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        // Tourist/Artist
        firebaseUser,
        tourist,
        artist,
        login,
        register,
        logout,
        refreshUser,
        loginArtist,
        registerArtist,
        logoutArtist,
        refreshArtist,
        // Admin
        admin,
        adminToken,
        adminLogin,
        adminLogout,
        isAdminAuthenticated: !!adminToken && !!admin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}