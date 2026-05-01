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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Profile Resolver Logic ---
   const fetchCorrectProfile = async () => {
     try {
       const res = await getProfile();
       setTourist(res.data.tourist);
       setArtist(null);
     } catch {
       try {
         const res = await getArtistProfile();
         // API returns { success: true, data: artist }
         const artistData = res.data?.data;
         if (artistData) {
           // Normalize to use id instead of _id for consistency
           setArtist({ ...artistData, id: artistData._id });
         } else {
           setArtist(null);
         }
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

    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('firebase_token', token);
        await fetchCorrectProfile();
      } else {
        await AsyncStorage.removeItem('firebase_token');
        setTourist(null);
        setArtist(null);
      }
      firebaseReady = true;
      checkReady();
    });

    const initAdmin = async () => {
      const storedToken = await AsyncStorage.getItem('admin_token');
      if (storedToken) {
        setAdminToken(storedToken);
        try {
          const res = await getMe();
          setAdmin(res.data.admin);
        } catch {
          await handleAdminLogout();
        }
      }
      adminReady = true;
      checkReady();
    };

    initAdmin();
    return () => unsubscribeFirebase();
  }, []);

  // --- Tourist Actions ---
  const handleLogin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleRegister = async (email: string, password: string, profileData: object) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const res = await registerTourist({ email, ...profileData });
    setTourist(res.data.tourist);
    setArtist(null);
  };

  const handleLogout = async () => {
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(true);
    const res = await loginArtist(token);
    setArtist(res.data.artist);
    setTourist(null);
  };

  const handleRegisterArtist = async (email: string, password: string, profileData: object) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken(true);
    const res = await registerArtist({ email, ...profileData }, token);
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
      const artistData = res.data?.data;
      if (artistData) {
        setArtist({ ...artistData, id: artistData._id });
      }
    } catch (err) {
      console.error('Failed to refresh artist profile:', err);
    }
  };

  // --- Admin Actions ---
  const handleAdminLogin = async (email: string, password: string) => {
    const res = await loginAdmin(email, password);
    const { token: newToken, admin: adminData } = res.data;
    await AsyncStorage.setItem('admin_token', newToken);
    await AsyncStorage.setItem('admin_user', JSON.stringify(adminData));
    setAdminToken(newToken);
    setAdmin(adminData);
  };

  const handleAdminLogout = async () => {
    await AsyncStorage.removeItem('admin_token');
    await AsyncStorage.removeItem('admin_user');
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
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
        loginArtist: handleLoginArtist,
        registerArtist: handleRegisterArtist,
        logoutArtist,
        refreshArtist,
        admin,
        adminToken,
        adminLogin: handleAdminLogin,
        adminLogout: handleAdminLogout,
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
