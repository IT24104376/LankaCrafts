import express from 'express';
import { verifyToken } from '../services/artistService.js';
import { 
  createCraft, 
  getCraftsByArtist, 
  getCraftById, 
  updateCraft, 
  deleteCraft,
  getAllCrafts,
  getCraftsByCategory,
  searchCrafts,
  incrementCraftViews
} from '../services/craftService.js';
import Artist from '../models/Artist.js';

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

router.get('/crafts/my', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findOne({ firebaseUid: req.uid });
    if (!artist) {
      return res.status(404).json({ error: 'Artist profile not found.' });
    }
    
    const crafts = await getCraftsByArtist(artist._id);
    res.json({ crafts });
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

router.get('/public/crafts', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    let result;
    if (search) {
      result = await searchCrafts(search, parseInt(page), parseInt(limit));
    } else if (category) {
      result = await getCraftsByCategory(category, parseInt(page), parseInt(limit));
    } else {
      result = await getAllCrafts({}, { createdAt: -1 }, parseInt(page), parseInt(limit));
    }
    
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/public/crafts/:id', async (req, res) => {
  try {
    const craft = await getCraftById(req.params.id);
    await incrementCraftViews(req.params.id);
    res.json({ craft });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
