import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Request sent without token to:", config.url);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;