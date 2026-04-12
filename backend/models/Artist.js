import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    callingName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },

    craftType: {
      type: String,
      required: [true, 'Craft type is required'],
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicUrl: {
      type: String,
      default: '',
    },

    address: {
      number: { type: String, default: '' },
      street: { type: String, default: '' },
      village: { type: String, default: '' },
      city: { type: String, required: [true, 'City is required'] },
      district: { type: String, required: [true, 'District is required'] },
      province: { type: String, required: [true, 'Province is required'] },
      postalCode: { type: String, default: '' },
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      formattedAddress: {
        type: String,
        default: '',
      },
    },

    specialties: {
      type: [String],
      default: [],
    },

    availability: {
      type: Map,
      of: {
        morning: { type: Boolean, default: false },
        afternoon: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
      },
      default: {},
    },

    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    workshopsConducted: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['active', 'deactivated', 'pending'],
      default: 'active',
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredWeekStart: {
      type: Date,
    },
  },
  { timestamps: true }
);

artistSchema.index({ location: '2dsphere' });

artistSchema.virtual('initials').get(function () {
  if (!this.fullName) return 'LC';
  const parts = this.fullName.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
});

artistSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Artist', artistSchema);
