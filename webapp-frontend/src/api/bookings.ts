import axiosInstance from './axios';

export interface BookingData {
  email?: string;
  touristEmail?: string;
  artisanId?: number | string | null;
  craftId?: string;
  date?: string;
  time?: string;
  timeSlot?: string;
  [key: string]: any;
}

export const bookingApi = {
  createBooking: async (data: BookingData) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },

  getBookingsByEmail: async (email: string) => {
    const response = await axiosInstance.get(`/bookings/user/${email}`);
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id: string, data: Partial<BookingData>) => {
    const response = await axiosInstance.put(`/bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  }
};
