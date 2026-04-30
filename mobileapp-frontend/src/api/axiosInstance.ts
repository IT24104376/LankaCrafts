import axios from 'axios';
import { auth } from '../config/firebase';
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
  process.env.API_BASE_URL ??
  'http://localhost:5000';

const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '').replace(/\/api$/, '');

const api = axios.create({
  baseURL: normalizedBaseUrl + '/api',
  headers: { 'Content-Type': 'application/json' },
});

console.log('🔗 [axiosInstance] Configured API baseURL:', api.defaults.baseURL);

// ── RELIABLE TOKEN GETTER ──────────────────────────────────
const getAuthToken = async (): Promise<string | null> => {
  try {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
    // Fallback to stored admin token
    const adminToken = await AsyncStorage.getItem('admin_token');
    return adminToken;
  } catch {
    const adminToken = await AsyncStorage.getItem('admin_token');
    return adminToken;
  }
};

// ── INTERCEPTOR ──────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  // Skip Firebase for admin auth endpoints
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/me')) {
    const adminToken = await AsyncStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  }

  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    console.error('❌ [axiosInstance] Response Error:', error.message, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
