import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
// @ts-ignore
import { API_BASE_URL, EXPO_PUBLIC_API_BASE_URL } from '@env';

const extra = Constants.expoConfig?.extra ?? {};
const rawBaseUrl =
  extra.API_BASE_URL ??
  extra.EXPO_PUBLIC_API_BASE_URL ??
  EXPO_PUBLIC_API_BASE_URL ??
  API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL;

const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '').replace(/\/api$/, '');

const api = axios.create({
  baseURL: normalizedBaseUrl + '/api',
  headers: { 'Content-Type': 'application/json' },
});

// console.log('🔗 [axiosInstance] Configured API baseURL:', api.defaults.baseURL);

// ── RELIABLE TOKEN GETTER ──────────────────────────────────
import { auth } from '../config/firebase';

const getAuthToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    // 1. Check if user is already available in memory
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then(resolve).catch(() => resolve(null));
      return;
    }

    // 2. Wait for Firebase to initialize (max 3 seconds)
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 3000);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      clearTimeout(timeout);
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// ── INTERCEPTOR ──────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  // Check if it's an admin route
  const isAdminRoute =
    config.url?.startsWith('/admin/') ||
    config.url?.startsWith('/analytics/') ||
    config.url?.startsWith('/activity/') ||
    config.url?.startsWith('/reviews/admin') ||
    config.url?.includes('/moderate') ||
    config.url === '/auth/login' ||
    config.url === '/auth/me';

  if (isAdminRoute) {
    const adminToken = await AsyncStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Set actor headers (required by Reviews API)
  const sessionUserRaw = await AsyncStorage.getItem('lankaCraftAuthUser');
  if (sessionUserRaw) {
    try {
      const user = JSON.parse(sessionUserRaw);
      if (user.email) config.headers['x-user-email'] = user.email;
      if (user.role) config.headers['x-user-role'] = user.role;
      if (user.username) config.headers['x-username'] = user.username;
    } catch {
      // ignore parse error
    }
  }

  return config;
}, (error) => {
  console.error('❌ [axiosInstance] Request Error:', error.message);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      console.warn('⚠️ [axiosInstance] Unauthorized - may need to re-login');
    }
    console.error('❌ [axiosInstance] Response Error:', error.message, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;