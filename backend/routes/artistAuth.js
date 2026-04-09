import express from 'express';
import { verifyToken, registerArtist, loginArtist } from '../services/artistService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required in Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  const { uid, email: firebaseEmail } = await verifyToken(idToken);

  const artist = await registerArtist(uid, firebaseEmail, req.body);

  res.status(201).json({
    message: 'Artist profile created successfully.',
    artist: {
      id: artist._id,
      fullName: artist.fullName,
      callingName: artist.callingName,
      email: artist.email,
      craftType: artist.craftType,
      bio: artist.bio,
      address: artist.address,
      location: artist.location,
      specialties: artist.specialties,
      availability: artist.availability,
      initials: artist.initials,
      profilePicUrl: artist.profilePicUrl,
    },
  });
});

router.post('/login', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  const { uid } = await verifyToken(idToken);

  const artist = await loginArtist(uid);

  res.json({
    message: 'Logged in successfully.',
    artist: {
      id: artist._id,
      fullName: artist.fullName,
      callingName: artist.callingName,
      email: artist.email,
      phone: artist.phone,
      craftType: artist.craftType,
      bio: artist.bio,
      address: artist.address,
      location: artist.location,
      specialties: artist.specialties,
      availability: artist.availability,
      rating: artist.rating,
      reviewCount: artist.reviewCount,
      initials: artist.initials,
      profilePicUrl: artist.profilePicUrl,
    },
  });
});

export default router;
