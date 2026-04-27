import apiClient from '../api/axiosInstance';
import { AxiosError } from 'axios';

/**
 * Custom error type for API errors
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      code: error.code,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};

/**
 * Verify backend connectivity
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Auth API calls
 */
export const authApi = {
  register: (payload: Record<string, unknown>) =>
    apiClient.post('/auth/register', payload),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  verifyToken: (token: string) =>
    apiClient.post('/auth/verify-token', { token }),

  refreshToken: () =>
    apiClient.post('/auth/refresh'),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};

/**
 * Products API calls
 */
export const productsApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get('/api/products', { params: { page, limit } }),

  getFeatured: () =>
    apiClient.get('/api/products/featured'),

  search: (query: string) =>
    apiClient.get('/api/products/search', { params: { query } }),

  getById: (id: string) =>
    apiClient.get(`/api/products/${id}`),

  getByArtist: (artistId: string) =>
    apiClient.get(`/api/products/artist/${artistId}`),
};

/**
 * Artists API calls
 */
export const artistsApi = {
  getAll: (
    page = 1,
    limit = 10,
    searchOrFilters?: string | Record<string, string | number>
  ) =>
    apiClient.get('/artists', {
      params:
        typeof searchOrFilters === 'string'
          ? { page, limit, search: searchOrFilters }
          : { page, limit, ...(searchOrFilters || {}) },
    }),

  getById: (id: string) =>
    apiClient.get(`/artists/${id}`),

  getProfile: () =>
    apiClient.get('/artists/me'),

  update: (data: Record<string, unknown>) =>
    apiClient.put('/artists/me', data),

  setupProfile: (data: Record<string, unknown>) =>
    apiClient.post('/artists/setup', data),
};

/**
 * Map API calls
 */
export const mapApi = {
  getArtists: (filters?: Record<string, string | number>) =>
    apiClient.get('/api/map/artists', { params: filters }),
};

/**
 * Cart API calls
 */
export const cartApi = {
  getCart: () =>
    apiClient.get('/api/cart'),

  addItem: (productId: string, quantity: number) =>
    apiClient.post('/api/cart', { productId, quantity }),

  updateItem: (productId: string, quantity: number) =>
    apiClient.put(`/api/cart/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    apiClient.delete(`/api/cart/${productId}`),
};

/**
 * Orders API calls
 */
export const ordersApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get('/api/orders', { params: { page, limit } }),

  getById: (id: string) =>
    apiClient.get(`/api/orders/${id}`),

  create: (data: Record<string, unknown>) =>
    apiClient.post('/api/orders', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/orders/${id}`, data),
};

/**
 * Chat API calls
 */
export const chatApi = {
  getConversations: () =>
    apiClient.get('/chat/conversations'),

  createConversation: (payload: { artistUserId?: string; artistProfileId?: string; openingMessage?: string }) =>
    apiClient.post('/chat/conversations', payload),

  getConversationMessages: (conversationId: string) =>
    apiClient.get(`/chat/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, text: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/messages`, { text }),

  updateMessage: (conversationId: string, messageId: string, text: string) =>
    apiClient.put(`/chat/conversations/${conversationId}/messages/${messageId}`, { text }),

  deleteMessage: (conversationId: string, messageId: string) =>
    apiClient.delete(`/chat/conversations/${conversationId}/messages/${messageId}`),

  markConversationRead: (conversationId: string) =>
    apiClient.patch(`/chat/conversations/${conversationId}/read`),
};
