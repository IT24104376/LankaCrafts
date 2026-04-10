import axiosInstance from './axios';

export const artisanApi = {
  register: async (data: any) => {
    const response = await axiosInstance.post('/artisans/register', data);
    return response.data;
  },

  getArtisansByCraft: async (craftId: string) => {
    const response = await axiosInstance.get('/artisans', {
      params: { craftId }
    });
    return response.data;
  }
};
