import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000') + '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── RELIABLE TOKEN GETTER ──────────────────────────────────
const getAuthToken = () => {
  const auth = getAuth();

  return new Promise((resolve) => {
    // 1. Check if user is already available in memory
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then(resolve);
      return;
    }

    // 2. If not, wait for Firebase to initialize (max 3 seconds)
    const timeout = setTimeout(() => {
      unsubscribe();
      // Fallback to localStorage if Firebase takes too long
      const local = localStorage.getItem('admin_token') || localStorage.getItem('token');
      resolve(local);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeout);
      unsubscribe();
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        // Final fallback to localStorage
        const local = localStorage.getItem('admin_token') || localStorage.getItem('token');
        resolve(local);
      }
    });
  });
};

// ── INTERCEPTOR ──────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  // ── SKIP FIREBASE FOR ADMIN AUTH ──────────────────────────
  // Admin login and profile checks don't use Firebase
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/me')) {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  }

  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Request sent without token to:", config.url);
  }

  // ── SET ACTOR HEADERS (Required by Reviews API) ──────────
  const sessionUserRaw = localStorage.getItem('lankaCraftAuthUser');
  if (sessionUserRaw) {
    try {
      const user = JSON.parse(sessionUserRaw);
      if (user.email) config.headers['x-user-email'] = user.email;
      if (user.role) config.headers['x-user-role'] = user.role;
      if (user.username) config.headers['x-username'] = user.username;
    } catch (e) {
      console.error("Failed to parse session user for headers", e);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;