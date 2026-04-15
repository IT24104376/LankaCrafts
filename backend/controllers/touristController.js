const Tourist = require('../models/Tourist');
const ActivityLog = require('../models/ActivityLog');

exports.getTourists = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }
    const tourists = await Tourist.find(filter).sort({ joinedDate: -1 });
    res.json({ success: true, data: tourists, count: tourists.length });
  } catch (err) {
    next(err);
  }
};

exports.getTourist = async (req, res, next) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).json({ success: false, message: 'Tourist not found.' });
    res.json({ success: true, data: tourist });
  } catch (err) {
    next(err);
  }
};

exports.toggleTouristStatus = async (req, res, next) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).json({ success: false, message: 'Tourist not found.' });
    tourist.status = tourist.status === 'active' ? 'suspended' : 'active';
    await tourist.save();

    await ActivityLog.create({
      type: tourist.status === 'suspended' ? 'suspend' : 'verify',
      user: tourist.name,
      initials: tourist.initials || tourist.name.split(' ').map(n => n[0]).join(''),
      color: tourist.color || '#2F5D50',
      description: `Tourist account ${tourist.status}: ${tourist.name}`,
      page: '/admin/tourist-management',
      country: tourist.country,
    });

    res.json({ success: true, data: tourist });
  } catch (err) {
    next(err);
  }
};
