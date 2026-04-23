import Artist from '../models/Artist.js';
import ActivityLog from '../models/ActivityLog.js';

// Map admin UI statuses to Artist model statuses and back
const toModelStatus = (uiStatus) => {
  if (uiStatus === 'verified') return 'active';
  if (uiStatus === 'rejected') return 'deactivated';
  return 'pending';
};

const toUIStatus = (modelStatus) => {
  if (modelStatus === 'active') return 'verified';
  if (modelStatus === 'deactivated') return 'rejected';
  return 'pending';
};

export async function getArtisans(req, res, next) {
  try {
    const { status, region, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = toModelStatus(status);
    }

    if (region && region !== 'all') {
      filter['address.province'] = { $regex: region, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { craftType: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.district': { $regex: search, $options: 'i' } },
      ];
    }

    const artists = await Artist.find(filter).sort({ createdAt: -1 });

    // Map Artist documents to the format expected by the admin UI
    const data = artists.map((a) => {
      const initials = a.initials || (a.fullName || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const region = a.address
        ? [a.address.city, a.address.district, a.address.province].filter(Boolean).join(', ')
        : (a.location?.formattedAddress || '');
      return {
        _id: a._id,
        name: a.fullName,
        craft: a.craftType,
        region,
        email: a.email,
        phone: a.phone || '',
        submittedDate: a.createdAt,
        status: toUIStatus(a.status),
        rating: a.rating || 0,
        experience: '',
        bio: a.bio || '',
        initials,
        color: '#2F5D50',
        certifications: a.specialties || [],
        workshops: a.workshopsConducted || 0,
      };
    });

    res.json({ success: true, data, count: data.length });
  } catch (err) {
    next(err);
  }
}

export async function getArtisan(req, res, next) {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, message: 'Artisan not found.' });
    res.json({ success: true, data: artist });
  } catch (err) {
    next(err);
  }
}

export async function updateArtisanStatus(req, res, next) {
  try {
    const { status: uiStatus } = req.body;
    if (!['verified', 'rejected', 'pending'].includes(uiStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be verified, rejected, or pending.' });
    }

    const modelStatus = toModelStatus(uiStatus);
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      { status: modelStatus },
      { new: true, runValidators: true }
    );

    if (!artist) return res.status(404).json({ success: false, message: 'Artisan not found.' });

    const initials = artist.initials || (artist.fullName || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    await ActivityLog.create({
      type: uiStatus === 'verified' ? 'verify' : 'reject',
      user: artist.fullName,
      initials,
      color: '#2F5D50',
      description: `Artisan ${uiStatus === 'verified' ? 'verified' : 'rejected'}: ${artist.fullName}`,
      page: '/admin/artisan-verification',
    });

    res.json({ success: true, data: { ...artist.toJSON(), status: uiStatus } });
  } catch (err) {
    next(err);
  }
}
