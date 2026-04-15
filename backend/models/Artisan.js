const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    craft: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    submittedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    experience: { type: String, trim: true },
    bio: { type: String, trim: true },
    initials: { type: String, trim: true },
    color: { type: String, default: '#2F5D50' },
    certifications: [{ type: String }],
    workshops: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artisan', artisanSchema);
