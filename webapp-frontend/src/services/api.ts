import axios from 'axios';
import { auth } from '../config/firebase';

// ✅ FIX: Properly handle undefined environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_URL}/api`;

console.log('[API] Configured BASE_URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Important for CORS with credentials
});

// Attach the Firebase ID token to every request automatically
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          console.error('[API] Unauthorized');
          break;
        case 403:
          console.error('[API] Forbidden');
          break;
        case 404:
          console.error('[API] Not found');
          break;
        case 500:
          console.error('[API] Server error');
          break;
        default:
          console.error('[API] Error:', data?.error || error.message);
      }
    } else if (error.request) {
      console.error('[API] Network error', error.message);
    } else {
      console.error('[API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const registerTourist = (data: object) =>
  api.post('/tourist/auth/register', data);

export const loginTourist = () =>
  api.post('/tourist/auth/login');

// ── Profile ───────────────────────────────────────────────────────────────────

export const getProfile = () =>
  api.get('/tourist/profile');

export const updateProfile = (data: object) =>
  api.patch('/tourist/profile', data);

export const uploadProfilePic = (formData: FormData) =>
  api.post('/tourist/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getStats = () =>
  api.get('/tourist/stats');

export const getSavedWorkshops = () =>
  api.get('/tourist/saved-workshops');

export const addSavedWorkshop = (workshopId: number | string) =>
  api.post('/tourist/saved-workshops', { workshopId });

export const removeSavedWorkshop = (workshopId: number | string) =>
  api.delete(`/tourist/saved-workshops/${workshopId}`);

export const getReviews = () =>
  api.get('/tourist/reviews');

export const updateReviews = (reviewIds: string[]) =>
  api.post('/tourist/reviews', { reviewIds });

// ── Blogs ─────────────────────────────────────────────────────────────────────

export const getBlogs = (page = 1, sort = 'recent', tag?: string) => {
  const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : '';
  return api.get(`/tourist/blogs?page=${page}&sort=${sort}${tagParam}`);
};

export const getBlog = (id: string) =>
  api.get(`/tourist/blogs/${id}`);

export const getMyBlogs = () =>
  api.get('/tourist/blogs/me');

export const createBlog = (formData: FormData) =>
  api.post('/tourist/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBlog = (id: string, formData: FormData) =>
  api.patch(`/tourist/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const likeBlog = (id: string) =>
  api.patch(`/tourist/blogs/${id}/like`);

export const deleteBlog = (id: string) =>
  api.delete(`/tourist/blogs/${id}`);

// ── Bookings ──────────────────────────────────────────────────────────────────

export const getBookings = () =>
  api.get('/bookings');

export const createBooking = (data: object) =>
  api.post('/bookings', data);

export const cancelBooking = (id: string) =>
  api.patch(`/bookings/${id}/cancel`);

// ── Artist Auth ─────────────────────────────────────────────────────────────────

export const registerArtist = (data: object) =>
  api.post('/artist/auth/register', data);

export const loginArtist = () =>
  api.post('/artist/auth/login');

// ── Artist Profile ─────────────────────────────────────────────────────────────

export const getArtistProfile = () =>
  api.get('/artist/profile');

export const updateArtistProfile = (data: object) =>
  api.patch('/artist/profile', data);

export const deleteArtistProfile = () =>
  api.delete('/artist/profile');

// ── Artist Crafts ─────────────────────────────────────────────────────────────

export const getMyCrafts = () =>
  api.get('/artist/crafts');

export const createCraft = (data: object) =>
  api.post('/artist/crafts', data);

export const updateCraft = (id: string, data: object) =>
  api.patch(`/artist/crafts/${id}`, data);

export const deleteCraft = (id: string) =>
  api.delete(`/artist/crafts/${id}`);

// ── Public Artists ────────────────────────────────────────────────────────────

export const getArtists = (page = 1, limit = 20, craftType?: string, search?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (craftType) params.append('craftType', craftType);
  if (search) params.append('search', search);
  return api.get(`/artists?${params.toString()}`);
};

export const getArtistById = (id: string) =>
  api.get(`/artists/profile/${id}`);

export const getFeaturedArtist = () =>
  api.get('/artists/featured');

// ── Public Crafts ────────────────────────────────────────────────────────────

export const getCrafts = (page = 1, limit = 20, category?: string, search?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  return api.get(`/crafts/public/crafts?${params.toString()}`);
};

export const getCraftById = (id: string) =>
  api.get(`/crafts/public/crafts?${id}`);

export const createPaymentLink = (data: object) =>
  api.post('/payments/create', data);

// ── Mock: Upcoming Workshops ──────────────────────────────────────────────────
// TODO: Replace with real API call once the workshops endpoint is available.
export interface MockWorkshop {
  id: number;
  img: string;
  name: string;
  artisan: string;
  date: string;
  status: 'Confirmed' | 'Pending';
  isNext: boolean;
}

export const getMockUpcomingWorkshops = (): Promise<MockWorkshop[]> =>
  Promise.resolve([
    {
      id: 10,
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
      name: 'Batik Textile Workshop',
      artisan: 'Kamala Wijesinghe',
      date: 'Mar 15, 2025',
      status: 'Confirmed',
      isNext: true,
    },
    {
      id: 11,
      img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&auto=format&fit=crop',
      name: 'Traditional Pottery Class',
      artisan: 'Rohan De Silva',
      date: 'Mar 22, 2025',
      status: 'Pending',
      isNext: false,
    },
    {
      id: 12,
      img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&auto=format&fit=crop',
      name: 'Lacquerwork Masterclass',
      artisan: 'Nimal Perera',
      date: 'Apr 5, 2025',
      status: 'Confirmed',
      isNext: false,
    },
  ]);

export default api;