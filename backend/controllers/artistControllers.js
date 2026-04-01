import { User } from '../models/User.js';

const CRAFTS = ['Lacquerwork', 'Batik', 'Pottery', 'Mask Carving', 'Weaving', 'Brasswork'];
const REGIONS = ['Kandy', 'Galle', 'Colombo', 'Jaffna', 'Ratnapura'];

const toDisplayName = (user) => {
  const base = user.username || user.email.split('@')[0];
  return String(base)
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

const toArtistDto = (user, idx = 0) => ({
  id: user._id.toString(),
  name: toDisplayName(user),
  craft: CRAFTS[idx % CRAFTS.length],
  region: REGIONS[idx % REGIONS.length],
  years: `${3 + (idx % 15)}+ yrs`,
  email: user.email,
  username: user.username || null
});

export const getArtists = async (_req, res) => {
  const docs = await User.find({ role: 'artist' }).sort({ createdAt: -1 }).lean();
  res.json({ artists: docs.map((d, i) => toArtistDto(d, i)) });
};

export const getArtistById = async (req, res) => {
  const doc = await User.findOne({ _id: req.params.id, role: 'artist' }).lean();
  if (!doc) return res.status(404).json({ message: 'Artist not found' });

  const artists = await User.find({ role: 'artist' }).sort({ createdAt: -1 }).lean();
  const idx = artists.findIndex((a) => a._id.toString() === req.params.id);
  res.json({ artist: toArtistDto(doc, idx < 0 ? 0 : idx) });
};
