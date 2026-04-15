const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    touristName: { type: String, required: true, trim: true },
    touristInitials: { type: String },
    touristColor: { type: String, default: '#2F5D50' },
    artisanName: { type: String, required: true, trim: true },
    workshopName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'hidden', 'flagged', 'removed'], default: 'active' },
    datePosted: { type: Date, default: Date.now },
    flagReason: { type: String, trim: true },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
