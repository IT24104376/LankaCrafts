import api from './axiosInstance';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginAdmin = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

// ── Artisans ──────────────────────────────────────────────────────────────────
export const getArtisans = (params?: Record<string, string>) =>
  api.get('/admin/artisans', { params });

export const updateArtisanStatus = (id: string, status: string) =>
  api.patch(`/admin/artisans/${id}/status`, { status });

// ── Tourists ──────────────────────────────────────────────────────────────────
export const getTourists = (params?: Record<string, string>) =>
  api.get('/admin/tourists', { params });

export const toggleTouristStatus = (id: string) =>
  api.patch(`/admin/tourists/${id}/status`);

// ── Workshops ─────────────────────────────────────────────────────────────────
export const getWorkshops = (params?: Record<string, string>) =>
  api.get('/admin/workshops', { params });

export const updateWorkshopStatus = (id: string, status: string) =>
  api.patch(`/admin/workshops/${id}/status`, { status });

export const getBookings = (params?: Record<string, string>) =>
  api.get('/admin/workshops/bookings', { params });

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = (params?: Record<string, string>) =>
  api.get('/reviews', { params });

export const updateReviewStatus = (id: string, action: string) =>
  api.patch(`/reviews/${id}/status`, { action });

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getAnalyticsOverview = () => api.get('/analytics/overview');
export const getActivityChart = (period: string) => api.get('/analytics/activity', { params: { period } });
export const getTopArtisans = () => api.get('/analytics/top-artisans');
export const getTouristDemographics = () => api.get('/analytics/tourist-demographics');
export const getWorkshopPopularity = () => api.get('/analytics/workshop-popularity');

// ── Activity ──────────────────────────────────────────────────────────────────
export const getActivityFeed = () => api.get('/activity');
export const getRecentActivity = () => api.get('/activity/recent');
