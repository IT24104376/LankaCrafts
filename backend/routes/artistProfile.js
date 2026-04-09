import express from 'express';
import { getArtistProfile, updateArtistProfile, deleteArtistProfile } from '../services/artistService.js';
import { verifyToken } from '../services/artistService.js';
import { getCraftsByArtist } from '../services/craftService.js';

const router = express.Router();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Firebase ID token required.' });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await verifyToken(idToken);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

router.get('/profile', authenticate, async (req, res) => {
  try {
    const artist = await getArtistProfile(req.uid);
    res.json({ artist });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/profile', authenticate, async (req, res) => {
  try {
    const artist = await updateArtistProfile(req.uid, req.body);
    res.json({ 
      message: 'Profile updated successfully.',
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
        profilePicUrl: artist.profilePicUrl,
        rating: artist.rating,
        reviewCount: artist.reviewCount,
        initials: artist.initials,
      }
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/profile', authenticate, async (req, res) => {
  try {
    await deleteArtistProfile(req.uid);
    res.json({ message: 'Profile deleted successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/crafts', authenticate, async (req, res) => {
  try {
    const crafts = await getCraftsByArtist(req.uid);
    res.json({ crafts });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
