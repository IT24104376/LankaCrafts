import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  registerTourist,
  getProfile,
  registerArtist,
  loginArtist,
  getArtistProfile
} from '../services/api';
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
  loading: boolean;
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
  admin: AdminUser | null;
  adminToken: string | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
  isTouristAuthenticated: boolean;
  isArtistAuthenticated: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [tourist, setTourist] = useState<TouristProfile | null>(null);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  // --- Profile Resolver Logic ---
  // This helper tries to find who the user is after they log in
  const fetchCorrectProfile = async () => {
    try {
      // 1. Try Tourist first
      const res = await getProfile();
      setTourist(res.data.tourist);
      setArtist(null);
    } catch {
      try {
        // 2. If not a tourist, try Artist
        const res = await getArtistProfile();
        setArtist(res.data.artist);
        setTourist(null);
      } catch {
        setTourist(null);
        setArtist(null);
      }
    }
  };

  useEffect(() => {
    let firebaseReady = false;
    let adminReady = false;

    const checkReady = () => {
      if (firebaseReady && adminReady) {
        setLoading(false);
      }
    };

    // Initialize Firebase Auth Listener
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchCorrectProfile();
      } else {
        setTourist(null);
        setArtist(null);
      }
      firebaseReady = true;
      checkReady();
    });

    // Initialize Admin Auth
    const initAdmin = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        try {
          const res = await getMe();
          setAdmin(res.data.admin);
        } catch {
          adminLogout();
        }
      }
      adminReady = true;
      checkReady();
    };

    initAdmin();
    return () => unsubscribeFirebase();
  }, []);

  // --- Tourist Actions ---
  const login = async (email: string, password: string) => {
    console.log('AuthContext: Calling Firebase login for email:', email);
    await signInWithEmailAndPassword(auth, email, password);
    // Profile is handled by onAuthStateChanged
  };

  const register = async (email: string, password: string, profileData: object) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const res = await registerTourist({ email, ...profileData });
    setTourist(res.data.tourist);
    setArtist(null);
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
      console.error('Failed to refresh tourist profile:', err);
    }
  };

  // --- Artist Actions ---
  const handleLoginArtist = async (email: string, password: string) => {
    console.log('AuthContext: Calling Firebase loginArtist for email:', email);
    await signInWithEmailAndPassword(auth, email, password);
    const res = await loginArtist(); // Handled by API helper
    setArtist(res.data.artist);
    setTourist(null);
  };

  const handleRegisterArtist = async (email: string, password: string, profileData: object) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const res = await registerArtist({ email, ...profileData });
    setArtist(res.data.artist);
    setTourist(null);
  };

  const logoutArtist = async () => {
    await signOut(auth);
    setArtist(null);
    setFirebaseUser(null);
  };

  const refreshArtist = async () => {
    try {
      const res = await getArtistProfile();
      setArtist(res.data.artist);
    } catch (err) {
      console.error('Failed to refresh artist profile:', err);
    }
  };

  // --- Admin Actions ---
  const adminLogin = async (email: string, password: string) => {
    console.log('AuthContext: Calling backend adminLogin for email:', email);
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
        firebaseUser,
        tourist,
        artist,
        login,
        register,
        logout,
        refreshUser,
        loginArtist: handleLoginArtist,
        registerArtist: handleRegisterArtist,
        logoutArtist,
        refreshArtist,
        admin,
        adminToken,
        adminLogin,
        adminLogout,
        isAdminAuthenticated: !!adminToken && !!admin,
        isTouristAuthenticated: !!tourist,
        isArtistAuthenticated: !!artist,
        isAuthenticated: !!firebaseUser || !!tourist || !!artist || !!admin
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