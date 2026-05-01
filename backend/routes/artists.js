import express from 'express';
import Artist from '../models/Artist.js';

const router = express.Router();

/**
 * GET /api/artists
 * List active artists with optional filters (craftType, search) and pagination.
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, craftType, search } = req.query;
    const query = { status: 'active' };

    if (craftType) {
      query.craftType = craftType;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { craftType: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [artists, total] = await Promise.all([
      Artist.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Artist.countDocuments(query),
    ]);

    res.json({
      artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/artists/featured
 * Returns a single featured artist (highest rated).
 */
router.get('/featured', async (req, res) => {
  try {
    const artist = await Artist.findOne({ status: 'active' }).sort({
      rating: -1,
      reviewCount: -1,
    });
    if (!artist) {
      return res.status(404).json({ error: 'No featured artist found.' });
    }
    res.json({ artist });
  } catch (err) {
    console.error('Error fetching featured artist:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/artists/:id
 * Get a single active artist by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist || artist.status !== 'active') {
      return res.status(404).json({ error: 'Artist not found.' });
    }
    res.json({ artist });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid artist ID.' });
    }
    console.error('Error fetching artist:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
