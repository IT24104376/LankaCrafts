import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true, sparse: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['tourist', 'artist', 'admin'], required: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
