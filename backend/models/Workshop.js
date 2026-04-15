const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    artisan: { type: String, required: true, trim: true },
    artisanInitials: { type: String },
    artisanColor: { type: String, default: '#2F5D50' },
    craft: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    duration: { type: String },
    price: { type: Number, required: true, min: 0 },
    submittedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    description: { type: String, trim: true },
    schedule: { type: String, trim: true },
    totalBookings: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
