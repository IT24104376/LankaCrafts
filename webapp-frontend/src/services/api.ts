import axios from 'axios';
import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
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

// ── Auth ──────────────────────────────────────────────────────────────────────

export const registerTourist = (data: object) =>
  api.post('/api/tourist/auth/register', data);

export const loginTourist = () =>
  api.post('/api/tourist/auth/login');

// ── Profile ───────────────────────────────────────────────────────────────────

export const getProfile = () =>
  api.get('/api/tourist/profile');

export const updateProfile = (data: object) =>
  api.patch('/api/tourist/profile', data);

export const uploadProfilePic = (formData: FormData) =>
  api.post('/api/tourist/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getStats = () =>
  api.get('/api/tourist/stats');

export const getSavedWorkshops = () =>
  api.get('/api/tourist/saved-workshops');

export const addSavedWorkshop = (workshopId: number | string) =>
  api.post('/api/tourist/saved-workshops', { workshopId });

export const removeSavedWorkshop = (workshopId: number | string) =>
  api.delete(`/api/tourist/saved-workshops/${workshopId}`);

export const getReviews = () =>
  api.get('/api/tourist/reviews');

export const updateReviews = (reviewIds: string[]) =>
  api.post('/api/tourist/reviews', { reviewIds });

// ── Blogs ─────────────────────────────────────────────────────────────────────

export const getBlogs = (page = 1, sort = 'recent') =>
  api.get(`/api/tourist/blogs?page=${page}&sort=${sort}`);

export const getMyBlogs = () =>
  api.get('/api/tourist/blogs/me');

export const createBlog = (formData: FormData) =>
  api.post('/api/tourist/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBlog = (id: string, formData: FormData) =>
  api.patch(`/api/tourist/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const likeBlog = (id: string) =>
  api.patch(`/api/tourist/blogs/${id}/like`);

export const deleteBlog = (id: string) =>
  api.delete(`/api/tourist/blogs/${id}`);

// ── Bookings ──────────────────────────────────────────────────────────────────

export const getBookings = () =>
  api.get('/api/tourist/bookings');

export const createBooking = (data: object) =>
  api.post('/api/tourist/bookings', data);

export const cancelBooking = (id: string) =>
  api.patch(`/api/tourist/bookings/${id}/cancel`);

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
