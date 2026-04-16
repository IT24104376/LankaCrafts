import express from 'express';
import Artist from '../models/Artist.js';
import { getArtistProfile, updateArtistProfile, deleteArtistProfile } from '../services/artistService.js';
import { verifyToken } from '../services/artistService.js';
import { getCraftsByArtist, createCraft, updateCraft, deleteCraft } from '../services/craftService.js';

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
    const artist = await Artist.findOne({ firebaseUid: req.uid});
    if (!artist) return res.status(404).json({error: 'Artist not found' });
    const crafts = await getCraftsByArtist(artist._id);
    res.json({ crafts });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/crafts', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findOne({ firebaseUid: req.uid });
    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found.' });
    }

    const craft = await createCraft(artist._id, req.body);
    res.status(201).json({
      message: 'Craft created successfully.',
      craft
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/crafts/:id', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findOne({ firebaseUid: req.uid });
    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found.' });
    }

    const craft = await updateCraft(req.params.id, artist._id, req.body);
    res.json({
      message: 'Craft updated successfully.',
      craft
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/crafts/:id', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findOne({ firebaseUid: req.uid });
    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found.' });
    }

    await deleteCraft(req.params.id, artist._id);
    res.json({ message: 'Craft deleted successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
