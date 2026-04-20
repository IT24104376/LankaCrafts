import axiosInstance from './axios';
import api from './axiosInstance';

export interface BookingData {
  artisanId?: string;
  craftId?: string;
  craftName?: string;
  artisanName?: string;
  location?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  bookingDate?: string;
  bookingTime?: string;
  groupSize?: number;
  status?: string;
}

export const bookingApi = {
  createBooking: async (data: BookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },

  getBookingsByUid: async (id: string) => {
    const response = await api.get(`/bookings/user/${id}`);
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
