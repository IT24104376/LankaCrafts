import express from 'express';
import { verifyToken, registerArtist, loginArtist, getArtistProfile, updateArtistProfile } from '../services/artistService.js';

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

router.get('/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const Artist = (await import('../models/Artist.js')).default;
    const artist = await Artist.findById(id).select('-firebaseUid');
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found.' });
    }
    
    res.json({ artist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const Artist = (await import('../models/Artist.js')).default;
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    let artist = await Artist.findOne({
      isFeatured: true,
      featuredWeekStart: { $gte: startOfWeek }
    }).select('-firebaseUid');
    
    if (!artist) {
      const lastFeatured = await Artist.findOne({
        isFeatured: true,
        featuredWeekStart: { $lt: startOfWeek }
      }).sort({ featuredWeekStart: -1 });
      
      if (lastFeatured) {
        lastFeatured.isFeatured = false;
        await lastFeatured.save();
      }
      
      const availableArtists = await Artist.find({
        status: 'active',
        $or: [
          { isFeatured: false },
          { isFeatured: { $exists: false } }
        ]
      }).limit(20);
      
      if (availableArtists.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableArtists.length);
        artist = availableArtists[randomIndex];
        artist.isFeatured = true;
        artist.featuredWeekStart = startOfWeek;
        await artist.save();
      }
    }
    
    if (!artist) {
      return res.status(404).json({ error: 'No featured artist available.' });
    }
    
    res.json({ artist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const Artist = (await import('../models/Artist.js')).default;
    const { page = 1, limit = 20, craftType, search } = req.query;
    
    const query = { status: 'active' };
    
    if (craftType) {
      query.craftType = craftType;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { craftType: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [artists, total] = await Promise.all([
      Artist.find(query).select('-firebaseUid').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Artist.countDocuments(query)
    ]);
    
    res.json({
      artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
