// import { find, findById, findByIdAndUpdate } from '../models/Artisan.js';
// import { create } from '../models/ActivityLog.js';

export async function getArtisans(req, res, next) {
  try {
    const { status, region, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (region && region !== 'all') filter.region = region;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { craft: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
      ];
    }
    const artisans = await find(filter).sort({ submittedDate: -1 });
    res.json({ success: true, data: artisans, count: artisans.length });
  } catch (err) {
    next(err);
  }
}

export async function getArtisan(req, res, next) {
  try {
    const artisan = await findById(req.params.id);
    if (!artisan) return res.status(404).json({ success: false, message: 'Artisan not found.' });
    res.json({ success: true, data: artisan });
  } catch (err) {
    next(err);
  }
}

export async function updateArtisanStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be verified, rejected, or pending.' });
    }
    const artisan = await findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!artisan) return res.status(404).json({ success: false, message: 'Artisan not found.' });

    await create({
      type: status === 'verified' ? 'verify' : 'reject',
      user: artisan.name,
      initials: artisan.initials || artisan.name.split(' ').map(n => n[0]).join(''),
      color: artisan.color || '#2F5D50',
      description: `Artisan ${status === 'verified' ? 'verified' : 'rejected'}: ${artisan.name}`,
      page: '/admin/artisan-verification',
    });

    res.json({ success: true, data: artisan });
  } catch (err) {
    next(err);
  }
}
