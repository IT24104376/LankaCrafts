import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  registerTourist,
  loginTourist,
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
  status?: string;
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
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [tourist, setTourist] = useState<TouristProfile | null>(null);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Profile Resolver Logic ---
  const fetchCorrectProfile = async () => {
    try {
      // 1. Try Tourist first
      const res = await getProfile();
      const touristData = res.data?.tourist || res.data?.data;
      if (touristData) {
        setTourist(touristData);
        setArtist(null);
        await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
          email: touristData.email,
          role: 'tourist',
          username: touristData.callingName
        }));
      } else {
        throw new Error('Tourist data not found in response');
      }
    } catch {
      try {
        // 2. Try Artist second
        const res = await getArtistProfile();
        const artistData = res.data?.artist || res.data?.data;
        if (artistData) {
          const artistProfile = { ...artistData, id: artistData._id };
          setArtist(artistProfile);
          setTourist(null);
          await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
            email: artistProfile.email,
            role: 'artist',
            username: artistProfile.callingName
          }));
        } else {
          throw new Error('No artist profile found.');
        }
      } catch (err) {
        setTourist(null);
        setArtist(null);
        await AsyncStorage.removeItem('lankaCraftAuthUser');
        // No valid profile found; sign out of Firebase to clear state
        try {
          await signOut(auth);
        } catch (signOutErr) {
          console.error('Failed to sign out after profile check failed:', signOutErr);
        }
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
    const unsubscribeFirebase = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          await fetchCorrectProfile();
        } catch (err) {
          console.error('Error fetching token/profile on auth state change:', err);
        }
      } else {
        setToken(null);
        setTourist(null);
        setArtist(null);
        await AsyncStorage.removeItem('lankaCraftAuthUser');
      }
      firebaseReady = true;
      checkReady();
    });

    // Initialize Admin Auth
    const initAdmin = async () => {
      try {
        const storedAdminToken = await AsyncStorage.getItem('admin_token');
        if (storedAdminToken) {
          setAdminToken(storedAdminToken);
          try {
            const res = await getMe();
            setAdmin(res.data.admin);
          } catch {
            await handleAdminLogout();
          }
        }
      } catch (err) {
        console.error('Admin initialization failed:', err);
      } finally {
        adminReady = true;
        checkReady();
      }
    };

    initAdmin();
    return () => unsubscribeFirebase();
  }, []);

  // --- Tourist Actions ---
  const handleLogin = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    setToken(idToken);

    // Call backend to sync profile
    const res = await loginTourist();
    const touristData = res.data?.tourist || res.data?.data;
    
    if (!touristData) {
      throw new Error(`Login sync failed. Server response: ${JSON.stringify(res.data)}`);
    }
    
    setTourist(touristData);
    setArtist(null);

    await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
      email: touristData.email,
      role: 'tourist',
      username: touristData.callingName
    }));
  };

  const handleRegister = async (email: string, password: string, profileData: object) => {
    let userCredential: UserCredential | undefined = undefined;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      setToken(idToken);

      const res = await registerTourist({ email, ...profileData });
      const touristData = res.data?.tourist || res.data?.data;
      if (!touristData) {
        throw new Error(`Registration sync failed. Server response: ${JSON.stringify(res.data)}`);
      }
      setTourist(touristData);
      setArtist(null);

      await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
        email: touristData.email,
        role: 'tourist',
        username: touristData.callingName
      }));
    } catch (err) {
      if (userCredential?.user) {
        try {
          await userCredential.user.delete();
        } catch (delErr) {
          console.error('Failed to delete Firebase user after registration failure:', delErr);
        }
      }
      setToken(null);
      setTourist(null);
      throw err;
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setToken(null);
    setTourist(null);
    setArtist(null);
    await AsyncStorage.removeItem('lankaCraftAuthUser');
  };

  const refreshUser = async () => {
    try {
      const res = await getProfile();
      const touristData = res.data?.tourist || res.data?.data;
      if (touristData) {
        setTourist(touristData);
        await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
          email: touristData.email,
          role: 'tourist',
          username: touristData.callingName
        }));
      }
    } catch (err) {
      console.error('Failed to refresh tourist profile:', err);
    }
  };

  // --- Artist Actions ---
  const handleLoginArtist = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    setToken(idToken);

    // Call backend to sync profile
    const res = await loginArtist();
    const artistData = res.data?.artist || res.data?.data;
    
    if (!artistData) {
      throw new Error(`Login sync failed. Server response: ${JSON.stringify(res.data)}`);
    }

    const artistProfile = { ...artistData, id: artistData._id };
    setArtist(artistProfile);
    setTourist(null);

    await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
      email: artistProfile.email,
      role: 'artist',
      username: artistProfile.callingName
    }));
  };

  const handleRegisterArtist = async (email: string, password: string, profileData: object) => {
    let userCredential: UserCredential | undefined = undefined;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      setToken(idToken);

      const res = await registerArtist({ email, ...profileData });
      const artistData = res.data.artist || res.data.data;
      const artistProfile = { ...artistData, id: artistData._id };
      setArtist(artistProfile);
      setTourist(null);

      await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
        email: artistProfile.email,
        role: 'artist',
        username: artistProfile.callingName
      }));
    } catch (err) {
      if (userCredential?.user) {
        try {
          await userCredential.user.delete();
        } catch (delErr) {
          console.error('Failed to delete Firebase user after registration failure:', delErr);
        }
      }
      setToken(null);
      setArtist(null);
      throw err;
    }
  };

  const logoutArtist = async () => {
    await handleLogout();
  };

  const refreshArtist = async () => {
    try {
      const res = await getArtistProfile();
      const artistData = res.data?.artist || res.data?.data;
      if (artistData) {
        const artistProfile = { ...artistData, id: artistData._id };
        setArtist(artistProfile);
        await AsyncStorage.setItem('lankaCraftAuthUser', JSON.stringify({
          email: artistProfile.email,
          role: 'artist',
          username: artistProfile.callingName
        }));
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
    setAdminToken(newToken);
    setAdmin(adminData);
  };

  const handleAdminLogout = async () => {
    await AsyncStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        token,
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
        isAuthenticated: !!token || !!adminToken
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
