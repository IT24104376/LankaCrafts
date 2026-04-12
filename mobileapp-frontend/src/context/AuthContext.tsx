// Auth Context for Mobile App
// Handles Firebase Authentication and session management

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getIdToken,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { setFirebaseToken, artistApi, touristApi } from '../services/api';

interface AuthUser {
  uid: string;
  email: string | null;
  userType: 'artist' | 'tourist' | null;
  profile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: 'artist' | 'tourist') => Promise<void>;
  register: (email: string, password: string, userType: 'artist' | 'tourist') => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firebase auth instance - you'll need to configure this
const getFirebaseAuth = () => {
  // This would be imported from your firebase config
  // For now, we'll use a placeholder
  return auth;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // Get the ID token
          const token = await firebaseUser.getIdToken();
          setFirebaseToken(token);
          
          // Store user info
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            userType: null, // Will be determined after login/register
            profile: null,
          });
        } catch (err) {
          console.error('[Auth] Error getting token:', err);
        }
      } else {
        setUser(null);
        setFirebaseToken(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string, userType: 'artist' | 'tourist') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      setFirebaseToken(token);
      
      // Call the appropriate backend login endpoint
      let profile;
      if (userType === 'artist') {
        const response = await artistApi.login();
        profile = response.artist;
      } else {
        const response = await touristApi.login();
        profile = response.tourist;
      }
      
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        userType,
        profile,
      });
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, userType: 'artist' | 'tourist') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      setFirebaseToken(token);
      
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        userType,
        profile: null,
      });
    } catch (err: any) {
      console.error('[Auth] Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setFirebaseToken(null);
      setUser(null);
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<string | null> => {
    try {
      if (auth.currentUser) {
        const token = await getIdToken(auth.currentUser, true); // Force refresh
        setFirebaseToken(token);
        return token;
      }
      return null;
    } catch (err) {
      console.error('[Auth] Token refresh error:', err);
      return null;
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;