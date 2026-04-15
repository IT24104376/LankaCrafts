
const Artisan = require('../models/Artisan');
const Tourist = require('../models/Tourist');
const Workshop = require('../models/Workshop');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

exports.getOverview = async (req, res, next) => {
  try {
    const [totalArtisans, totalTourists, activeWorkshops, pendingArtisans, pendingWorkshops] = await Promise.all([
      Artisan.countDocuments(),
      Tourist.countDocuments(),
      Workshop.countDocuments({ status: 'approved' }),
      Artisan.countDocuments({ status: 'pending' }),
      Workshop.countDocuments({ status: 'pending' }),
    ]);
    res.json({
      success: true,
      data: {
        totalArtisans,
        totalTourists,
        activeWorkshops,
        pendingVerifications: pendingArtisans + pendingWorkshops,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getActivityChart = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;
    const DAILY = [
      { label: 'Mon', users: 320, bookings: 48 }, { label: 'Tue', users: 410, bookings: 62 },
      { label: 'Wed', users: 380, bookings: 55 }, { label: 'Thu', users: 520, bookings: 78 },
      { label: 'Fri', users: 490, bookings: 71 }, { label: 'Sat', users: 610, bookings: 94 },
      { label: 'Sun', users: 445, bookings: 67 },
    ];
    const WEEKLY = [
      { label: 'W1', users: 2100, bookings: 310 }, { label: 'W2', users: 2450, bookings: 368 },
      { label: 'W3', users: 2280, bookings: 342 }, { label: 'W4', users: 2890, bookings: 435 },
      { label: 'W5', users: 3120, bookings: 468 }, { label: 'W6', users: 2760, bookings: 414 },
    ];
    const MONTHLY = [
      { label: 'Jul', users: 8200, bookings: 1230 }, { label: 'Aug', users: 9400, bookings: 1410 },
      { label: 'Sep', users: 8800, bookings: 1320 }, { label: 'Oct', users: 10200, bookings: 1530 },
      { label: 'Nov', users: 11500, bookings: 1725 }, { label: 'Dec', users: 13200, bookings: 1980 },
    ];
    const data = period === 'weekly' ? WEEKLY : period === 'monthly' ? MONTHLY : DAILY;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getTopArtisans = async (req, res, next) => {
  try {
    const artisans = await Artisan.find({ status: 'verified' })
      .sort({ rating: -1, workshops: -1 })
      .limit(6);
    res.json({ success: true, data: artisans });
  } catch (err) {
    next(err);
  }
};

exports.getTouristDemographics = async (req, res, next) => {
  try {
    const pipeline = [
      { $group: { _id: '$country', tourists: { $sum: 1 }, bookings: { $sum: '$totalBookings' } } },
      { $sort: { tourists: -1 } },
      { $limit: 6 },
    ];
    const raw = await Tourist.aggregate(pipeline);
    const data = raw.map((d) => ({
      country: d._id || 'Unknown',
      count: d.tourists,
      bookings: d.bookings || 0,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getWorkshopPopularity = async (req, res, next) => {
  try {
    const raw = await Workshop.find({ status: 'approved' })
      .sort({ totalBookings: -1 })
      .limit(7)
      .select('name craft totalBookings');
    const data = raw.map((w) => ({
      name: w.name,
      craft: w.craft,
      bookings: w.totalBookings || 0,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
