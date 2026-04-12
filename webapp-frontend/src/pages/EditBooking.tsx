import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingApi } from "../api";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingDate: "",
    bookingTime: ""
  });

  useEffect(() => {
    const fetchBooking = async () => {
      const data = await bookingApi.getBookingById(id as string);
      setFormData({
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime
      });
    };

    fetchBooking();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await bookingApi.updateBooking(id as string, formData);

    alert("Booking updated successfully!");
    navigate("/my-bookings");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Update Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={formData.bookingDate}
          onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          value={formData.bookingTime}
          onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-[#BC3908] text-white px-4 py-2 rounded">
          Update Booking
        </button>
      </form>
    </div>
  );
};

export default EditBooking;