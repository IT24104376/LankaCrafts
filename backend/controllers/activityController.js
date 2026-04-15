const ActivityLog = require('../models/ActivityLog');

exports.getActivityFeed = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(6);
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};
