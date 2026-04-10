import axiosInstance from './axios';

export const touristApi = {
  register: async (data: any) => {
    const response = await axiosInstance.post('/tourists/register', data);
    return response.data;
  },

  login: async (data: any) => {
    const response = await axiosInstance.post('/tourists/login', data);
    return response.data;
  }
};
