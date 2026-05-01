import express from 'express';
import multer from 'multer';
import { verifyAnyFirebaseToken } from '../middleware/auth.js';
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

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', verifyAnyFirebaseToken, upload.array('images', 10), async (req, res) => {
  try {
    // Ensure user is an artist
    if (req.user.role !== 'artist') {
      return res.status(403).json({ error: 'Access denied. Artist account required.' });
    }
    const artistId = req.user.uid;
    const craft = await createCraft(artistId, req.body, req.files || []);
    res.status(201).json({
      message: 'Craft created successfully.',
      craft
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});


router.patch('/:id', verifyAnyFirebaseToken, upload.array('images', 10), async (req, res) => {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ error: 'Access denied. Artist account required.' });
    }
    const artistId = req.user.uid;
    const craft = await updateCraft(req.params.id, artistId, req.body, req.files || []);
    res.json({
      message: 'Craft updated successfully.',
      craft
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAnyFirebaseToken, async (req, res) => {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ error: 'Access denied. Artist account required.' });
    }
    const artistId = req.user.uid;
    await deleteCraft(req.params.id, artistId);
    res.json({ message: 'Craft deleted successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/public/crafts', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, artistId } = req.query;

    let result;
    if (search) {
      result = await searchCrafts(search, parseInt(page), parseInt(limit));
    } else {
      const filters = {};
      if (category) filters.category = category;
      if (artistId) filters.artistId = artistId;
      
      result = await getAllCrafts(filters, { createdAt: -1 }, parseInt(page), parseInt(limit));
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
