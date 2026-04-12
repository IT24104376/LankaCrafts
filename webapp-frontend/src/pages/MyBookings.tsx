import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { bookingApi } from '../api';
import { Calendar, Clock, Tag, Loader2, RefreshCw, Trash2, Pencil, Check, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// Define the Interface for TypeScript
interface Booking {
  _id: string;
  craftId: string;
  craftName: string;
  artisanId: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

interface MyBookingsProps {
  email: string;
}

interface Props {
  email?: string;
}

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("tourist");
  const email = storedUser ? JSON.parse(storedUser).email : null;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});

  // 2. Updated fetchBookings with Axios
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingApi.getBookingsByEmail(email);
      setBookings(data);
    } catch (error: any) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Updated handleDelete with Axios
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingApi.deleteBooking(id);
        setBookings(bookings.filter(b => b._id !== id));
      } catch (error: any) {
        console.error("Delete failed:", error.response?.data || error.message);
        alert("Could not delete booking. Please try again.");
      }
    }
  };

  const startEdit = (booking: Booking) => {
    setEditingId(booking._id);
    setEditData({
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime
    });
  };

  // 4. Updated handleUpdate with Axios
  const handleUpdate = async (id: string) => {
    try {
      // In Axios, you pass the data object as the second argument for PUT/POST
      await bookingApi.updateBooking(id, editData);

      setBookings(bookings.map(b => b._id === id ? { ...b, ...editData as Booking } : b));
      setEditingId(null);
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Failed to update the booking.");
    }
  };

  useEffect(() => {
    if (email) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  // Loading State UI
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <Loader2 className="animate-spin text-[#BC3908] mb-4" size={40} />
      <p className="text-stone-500 font-medium">Retrieving your artisan sessions...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 text-left">
      <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
        <h2 className="text-3xl font-serif italic text-stone-900">My Craft Journey</h2>
        <button onClick={fetchBookings} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-[#BC3908]">
          <RefreshCw size={20} />
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[2.5rem] p-16 text-center text-stone-400">
          No bookings found. Ready to start your first masterclass?
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-stone-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-4 group">
              <div className="space-y-2 flex-grow w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#BC3908] font-bold text-[10px] uppercase tracking-[0.2em]">
                    <Tag size={12} /> {booking.craftId}
                  </div>

                  <p className="text-sm text-stone-500">
                    Artisan: <span className="font-semibold text-stone-700">{booking.artisanId}</span>
                  </p>

                  <p className="text-sm text-stone-500">
                    Tourist Name: <span className="font-semibold text-stone-700">{booking.customerName}</span>
                  </p>
                </div>
                <p className="text-sm text-stone-500">
                  Workshop: <span className="font-semibold text-stone-700">{booking.craftId}</span>
                </p>

                {editingId === booking._id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="date"
                      className="border rounded-lg p-1 text-sm outline-none focus:ring-1 focus:ring-[#BC3908]"
                      value={editData.bookingDate || ''}
                      onChange={e => setEditData({ ...editData, bookingDate: e.target.value })}
                    />
                    <input
                      type="time"
                      className="border rounded-lg p-1 text-sm outline-none focus:ring-1 focus:ring-[#BC3908]"
                      value={editData.bookingTime || ''}
                      onChange={e => setEditData({ ...editData, bookingTime: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="flex gap-4 text-stone-400 text-xs font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {booking.bookingDate}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {booking.bookingTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                {editingId === booking._id ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(booking._id)} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"><Check size={18} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><X size={18} /></button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/edit-booking/${booking._id}`)}
                      className="p-2 text-stone-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(booking._id)} className="p-2 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100">
                      {booking.status}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;