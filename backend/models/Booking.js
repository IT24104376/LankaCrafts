const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    workshopName: { type: String },
    craft: { type: String },
    artisan: { type: String },
    artisanColor: { type: String, default: '#C65D3B' },
    tourist: { type: String },
    touristInitials: { type: String },
    touristColor: { type: String, default: '#2F5D50' },
    country: { type: String },
    email: { type: String },
    phone: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    groupSize: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
    region: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
