import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginAdmin, getMe } from '../api/adminApi';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        try {
          const res = await getMe();
          setAdmin(res.data.admin);
        } catch {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginAdmin(email, password);
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!token && !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
