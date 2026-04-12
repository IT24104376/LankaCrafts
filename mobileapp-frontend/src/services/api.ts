// API Service for Mobile Frontend
// Connects to the same backend as the webapp-frontend

import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL from environment variable or fallback to Android emulator localhost
// IMPORTANT: Set VITE_API_URL in your environment for production/development
// The /api suffix is added by the server routes, not here
import Constants from 'expo-constants';

const BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 'http://10.0.2.2:5000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds Firebase token to requests
api.interceptors.request.use(
  async (config) => {
    // We'll implement Firebase token retrieval in the auth context
    // For now, we'll set a placeholder that will be replaced by the auth context
    const token = await getFirebaseToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle unauthorized - could trigger logout
          console.error('[API] Unauthorized - Token may be invalid');
          break;
        case 403:
          console.error('[API] Forbidden - Access denied');
          break;
        case 404:
          console.error('[API] Not found');
          break;
        case 409:
          console.error('[API] Conflict - Resource already exists');
          break;
        case 500:
          console.error('[API] Server error');
          break;
        default:
          console.error('[API] Error:', data);
      }
      
      return Promise.reject(error);
    } else if (error.request) {
      // Network error
      console.error('[API] Network error - No response received');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('[API] Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Firebase token holder - will be set by AuthContext
let firebaseToken: string | null = null;

export const setFirebaseToken = (token: string | null) => {
  firebaseToken = token;
};

const getFirebaseToken = async (): Promise<string | null> => {
  // In a real implementation, this would get the token from Firebase Auth
  // For now, we use a stored token or get it from the current user
  return firebaseToken;
};

// ============================================
// Artist API
// ============================================

export const artistApi = {
  // Register new artist
  register: async (data: {
    fullName: string;
    callingName?: string;
    email: string;
    phone?: string;
    craftType: string;
    bio?: string;
    address: {
      number?: string;
      street?: string;
      village?: string;
      city: string;
      district: string;
      province: string;
      postalCode?: string;
    };
    specialties?: string[];
    availability?: object;
  }) => {
    const response = await api.post('/artist/auth/register', data);
    return response.data;
  },

  // Login artist
  login: async () => {
    const response = await api.post('/artist/auth/login');
    return response.data;
  },

  // Get current artist profile
  getProfile: async () => {
    const response = await api.get('/artist/profile');
    return response.data;
  },

  // Update artist profile
  updateProfile: async (data: object) => {
    const response = await api.patch('/artist/profile', data);
    return response.data;
  },

  // Delete artist profile
  deleteProfile: async () => {
    const response = await api.delete('/artist/profile');
    return response.data;
  },
};

// ============================================
// Public Artists API
// ============================================

export const artistsPublicApi = {
  // Get all artists with pagination
  getAll: async (page = 1, limit = 20, craftType?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (craftType) params.append('craftType', craftType);
    if (search) params.append('search', search);
    
    const response = await api.get(`/artists?${params.toString()}`);
    return response.data;
  },

  // Get artist by ID - correct path is /artists/profile/:id
  getById: async (id: string) => {
    const response = await api.get(`/artists/profile/${id}`);
    return response.data;
  },

  // Get featured artist
  getFeatured: async () => {
    const response = await api.get('/artists/featured');
    return response.data;
  },
};

// ============================================
// Crafts API (Ecommerce)
// ============================================

export const craftsApi = {
  // Get all public crafts with pagination
  getAll: async (page = 1, limit = 20, category?: string, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/crafts?${params.toString()}`);
    return response.data;
  },

  // Get craft by ID
  getById: async (id: string) => {
    const response = await api.get(`/crafts/${id}`);
    return response.data;
  },

  // Get crafts by category
  getByCategory: async (category: string, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('category', category);
    
    const response = await api.get(`/crafts?${params.toString()}`);
    return response.data;
  },

  // Search crafts
  search: async (query: string, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('search', query);
    
    const response = await api.get(`/crafts?${params.toString()}`);
    return response.data;
  },
};

// ============================================
// Artist's Own Crafts API
// ============================================

export const myCraftsApi = {
  // Get all crafts for the logged-in artist
  getAll: async () => {
    const response = await api.get('/artist/crafts');
    return response.data;
  },

  // Create a new craft
  create: async (data: {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    category: string;
    images?: string[];
    stock?: number;
    isAvailable?: boolean;
    dimensions?: object;
    weight?: object;
  }) => {
    const response = await api.post('/artist/crafts', data);
    return response.data;
  },

  // Update a craft
  update: async (id: string, data: object) => {
    const response = await api.patch(`/artist/crafts/${id}`, data);
    return response.data;
  },

  // Delete a craft
  delete: async (id: string) => {
    const response = await api.delete(`/artist/crafts/${id}`);
    return response.data;
  },
};

// ============================================
// Payments API
// ============================================

export const paymentsApi = {
  // Create PayHere payment link
  createPaymentLink: async (data: {
    orderId: string;
    amount: number;
    currency?: string;
    items?: string;
    customerName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }) => {
    const response = await api.post('/payments/create', data);
    return response.data;
  },
};

// ============================================
// Tourist API (for customer features)
// ============================================

export const touristApi = {
  // Register tourist
  register: async (data: {
    fullName: string;
    email: string;
    phone?: string;
    nationality?: string;
    preferredCraftTypes?: string[];
    travelDates?: object;
  }) => {
    const response = await api.post('/tourist/auth/register', data);
    return response.data;
  },

  // Login tourist
  login: async () => {
    const response = await api.post('/tourist/auth/login');
    return response.data;
  },

  // Get tourist profile
  getProfile: async () => {
    const response = await api.get('/tourist/profile');
    return response.data;
  },

  // Update tourist profile
  updateProfile: async (data: object) => {
    const response = await api.patch('/tourist/profile', data);
    return response.data;
  },

  // Get tourist stats
  getStats: async () => {
    const response = await api.get('/tourist/stats');
    return response.data;
  },
};

// ============================================
// Blogs API
// ============================================

export const blogsApi = {
  // Get all blogs
  getAll: async (page = 1, sort = 'recent', tag?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('sort', sort);
    if (tag) params.append('tag', tag);
    
    const response = await api.get(`/tourist/blogs?${params.toString()}`);
    return response.data;
  },

  // Get blog by ID
  getById: async (id: string) => {
    const response = await api.get(`/tourist/blogs/${id}`);
    return response.data;
  },

  // Create blog (tourist only)
  create: async (formData: FormData) => {
    const response = await api.post('/tourist/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update blog (tourist only)
  update: async (id: string, formData: FormData) => {
    const response = await api.patch(`/tourist/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete blog (tourist only)
  delete: async (id: string) => {
    const response = await api.delete(`/tourist/blogs/${id}`);
    return response.data;
  },

  // Like blog
  like: async (id: string) => {
    const response = await api.patch(`/tourist/blogs/${id}/like`);
    return response.data;
  },
};

// ============================================
// Bookings API
// ============================================

export const bookingsApi = {
  // Get all bookings for tourist
  getAll: async () => {
    const response = await api.get('/tourist/bookings');
    return response.data;
  },

  // Create new booking
  create: async (data: {
    workshopId: string;
    date: string;
    participants: number;
    specialRequests?: string;
  }) => {
    const response = await api.post('/tourist/bookings', data);
    return response.data;
  },

  // Cancel booking
  cancel: async (id: string) => {
    const response = await api.patch(`/tourist/bookings/${id}/cancel`);
    return response.data;
  },
};

// Export default API instance
export default api;