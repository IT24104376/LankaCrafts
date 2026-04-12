import axiosInstance from './axios';

export const artisanApi = {
  // Register artist - uses /api/artists/register
  register: async (data: any) => {
    const response = await axiosInstance.post('/artists/register', data);
    return response.data;
  },

  // Login artist - uses /api/artists/login  
  login: async (data: any) => {
    const response = await axiosInstance.post('/artists/login', data);
    return response.data;
  },

  // Get artists list - uses /api/artists
  getAll: async (params?: { page?: number; limit?: number; craftType?: string; search?: string }) => {
    const response = await axiosInstance.get('/artists', { params });
    return response.data;
  },

  // Get artist by ID - uses /api/artists/profile/:id
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/artists/profile/${id}`);
    return response.data;
  },

  // Get featured artist - uses /api/artists/featured
  getFeatured: async () => {
    const response = await axiosInstance.get('/artists/featured');
    return response.data;
  },

  // Get artisans by craft type
  getArtisansByCraft: async (craftType: string) => {
    const response = await axiosInstance.get('/artists', {
      params: { craftType }
    });
    return response.data;
  }
};
