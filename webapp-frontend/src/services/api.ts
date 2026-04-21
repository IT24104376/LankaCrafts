import axios from 'axios';
import { auth } from '../config/firebase';

const BASE_URL = 'http://localhost:5000';

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



// ── Saved Crafts ─────────────────────────────────────────────────────────────

export const getSavedCrafts = () =>
  api.get('/tourist/saved-crafts');

export const addSavedCraft = (craftId: string) =>
  api.post('/tourist/saved-crafts', { craftId });

export const removeSavedCraft = (craftId: string) =>
  api.delete(`/tourist/saved-crafts/${craftId}`);


// ── Blogs ─────────────────────────────────────────────────────────────────────

export const getBlogs = (page = 1, sort = 'recent', tag?: string) => {
  const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : '';
  return api.get(`/api/tourist/blogs?page=${page}&sort=${sort}${tagParam}`);
};

export const getBlog = (id: string) =>
  api.get(`/api/tourist/blogs/${id}`);

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

// ── Artist Auth ─────────────────────────────────────────────────────────────────

export const registerArtist = (data: object) =>
  api.post('/api/artist/auth/register', data);

export const loginArtist = () =>
  api.post('/api/artist/auth/login');

// ── Artist Profile ─────────────────────────────────────────────────────────────

export const getArtistProfile = () =>
  api.get('/api/artist/profile');

export const updateArtistProfile = (data: object) =>
  api.patch('/api/artist/profile', data);

export const deleteArtistProfile = () =>
  api.delete('/api/artist/profile');

export const uploadArtistProfilePic = (formData: FormData) =>
  api.post('/api/artist/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── Artist Crafts ─────────────────────────────────────────────────────────────

export const getMyCrafts = () =>
  api.get('/api/artist/crafts');

export const createCraft = (data: object) =>
  api.post('/api/artist/crafts', data);

export const updateCraft = (id: string, data: object) =>
  api.patch(`/api/artist/crafts/${id}`, data);

export const deleteCraft = (id: string) =>
  api.delete(`/api/artist/crafts/${id}`);

// ── Public Artists ────────────────────────────────────────────────────────────

export const getArtists = (page = 1, limit = 20, craftType?: string, search?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (craftType) params.append('craftType', craftType);
  if (search) params.append('search', search);
  return api.get(`/api/artists?${params.toString()}`);
};

export const getArtistById = (id: string) =>
  api.get(`/api/artists/${id}`);

export const getFeaturedArtist = () =>
  api.get('/api/artists/featured');

// ── Public Crafts ────────────────────────────────────────────────────────────

export const getCrafts = (page = 1, limit = 20, category?: string, search?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  return api.get(`/api/crafts/public/crafts?${params.toString()}`);
};

export const getCraftById = (id: string) =>
  api.get(`/api/crafts/public/crafts/${id}`);

export const createPaymentLink = (data: object) =>
  api.post('/api/payments/create', data);


export default api;
