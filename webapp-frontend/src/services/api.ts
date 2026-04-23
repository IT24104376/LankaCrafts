import api from '../api/axiosInstance';

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

export const getReviews = (params?: object) =>
  api.get('/reviews', { params });

export const updateReviews = (reviewIds: string[]) =>
  api.post('/tourist/reviews', { reviewIds });

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
  api.get('/tourist/bookings');

export const createBooking = (data: object) =>
  api.post('/tourist/bookings', data);

export const cancelBooking = (id: string) =>
  api.patch(`/tourist/bookings/${id}/cancel`);

export const updateBooking = (id: string, data: object) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id: string) =>
  api.delete(`/bookings/${id}`);

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

export const uploadArtistProfilePic = (formData: FormData) =>
  api.post('/artist/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

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
  api.get(`/artists/${id}`);

export const getFeaturedArtist = () =>
  api.get('/artists/featured');

// ── Public Crafts ────────────────────────────────────────────────────────────

export const getCrafts = (page = 1, limit = 20, category?: string, search?: string, artistId?: string) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (artistId) params.append('artistId', artistId);
  return api.get(`/crafts/public/crafts?${params.toString()}`);
};

export const getCraftById = (id: string) =>
  api.get(`/crafts/public/crafts/${id}`);

export const createPaymentLink = (data: object) =>
  api.post('/payments/create', data);


export default api;
