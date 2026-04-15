const mongoose = require('mongoose');

const workshopAttendanceSchema = new mongoose.Schema({
  workshop: { type: String },
  artisan: { type: String },
  date: { type: Date },
  craft: { type: String },
});

const touristSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    joinedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    initials: { type: String },
    color: { type: String, default: '#2F5D50' },
    totalBookings: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    workshopsAttended: [workshopAttendanceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tourist', touristSchema);
