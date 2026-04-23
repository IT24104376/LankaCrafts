import admin from '../config/firebase.js';
import Artist from '../models/Artist.js';
import { uploadBufferToCloudinary, deleteByUrl } from '../utils/cloudinaryHelper.js';

export async function uploadProfilePicture(artist, fileBuffer) {
  // Delete old image from Cloudinary if present
  if (artist.profilePicUrl) {
    try {
      await deleteByUrl(artist.profilePicUrl);
    } catch (delErr) {
      console.error('Failed to delete old image from Cloudinary:', delErr);
    }
  }

  const result = await uploadBufferToCloudinary(fileBuffer, 'lankacrafts/artists', 'image');

  const updated = await Artist.findByIdAndUpdate(
    artist._id,
    { $set: { profilePicUrl: result.secure_url } },
    { new: true }
  );

  return { profilePicUrl: result.secure_url, artist: updated };
}

export async function verifyToken(idToken) {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      const e = new Error('Token expired. Please log in again.');
      e.status = 401;
      throw e;
    }
    const e = new Error('Invalid or expired Firebase token.');
    e.status = 401;
    throw e;
  }
}

export async function registerArtist(uid, firebaseEmail, body) {
  const existing = await Artist.findOne({ firebaseUid: uid });
  if (existing) {
    const e = new Error('Artist profile already exists for this account.');
    e.status = 409;
    throw e;
  }

  const {
    fullName,
    callingName,
    email,
    phone,
    craftType,
    bio,
    address,
    location,
    specialties,
    availability,
  } = body;

  if (!fullName || !craftType) {
    const e = new Error('fullName and craftType are required.');
    e.status = 400;
    throw e;
  }

  const artist = await Artist.create({
    firebaseUid: uid,
    fullName,
    callingName: callingName || fullName.split(' ')[0],
    email: email || firebaseEmail,
    phone: phone || '',
    craftType,
    bio: bio || '',
    address: address || {},
    location: location || { type: 'Point', coordinates: [0, 0], formattedAddress: '' },
    specialties: specialties || [],
    availability: availability || {},
    profilePicUrl: '',
    status: 'active',
  });

  return artist;
}

export async function loginArtist(uid) {
  const artist = await Artist.findOne({ firebaseUid: uid, status: 'active' });
  if (!artist) {
    const e = new Error('Artist profile not found or deactivated. Please contact support.');
    e.status = 404;
    throw e;
  }
  return artist;
}

export async function getArtistProfile(uid) {
  const artist = await Artist.findOne({ firebaseUid: uid });
  if (!artist) {
    const e = new Error('Artist profile not found.');
    e.status = 404;
    throw e;
  }
  return artist;
}

export async function updateArtistProfile(uid, updates) {
  const allowedUpdates = [
    'fullName', 'callingName', 'phone', 'craftType', 'bio', 'profilePicUrl',
    'address', 'location', 'specialties', 'availability'
  ];

  const filteredUpdates = {};
  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  const artist = await Artist.findOneAndUpdate(
    { firebaseUid: uid },
    filteredUpdates,
    { new: true, runValidators: true }
  );

  if (!artist) {
    const e = new Error('Artist profile not found.');
    e.status = 404;
    throw e;
  }

  return artist;
}

export async function deleteArtistProfile(uid) {
  const artist = await Artist.findOneAndDelete({ firebaseUid: uid });
  if (!artist) {
    const e = new Error('Artist profile not found.');
    e.status = 404;
    throw e;
  }
  return artist;
}
