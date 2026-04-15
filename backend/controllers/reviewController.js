const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');

exports.getReviews = async (req, res, next) => {
  try {
    const { status, rating, workshop, search, sort } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (rating && rating !== 'all') filter.rating = parseInt(rating);
    if (workshop && workshop !== 'all') filter.workshopName = workshop;
    if (search) {
      filter.$or = [
        { touristName: { $regex: search, $options: 'i' } },
        { artisanName: { $regex: search, $options: 'i' } },
        { workshopName: { $regex: search, $options: 'i' } },
      ];
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    if (sort === 'lowest') sortOption = { rating: 1 };
    const reviews = await Review.find(filter).sort(sortOption);
    res.json({ success: true, data: reviews, count: reviews.length });
  } catch (err) {
    next(err);
  }
};

exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { action } = req.body;
    const validActions = ['hide', 'remove', 'restore', 'spam'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, message: `Invalid action. Must be one of: ${validActions.join(', ')}` });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    const statusMap = { hide: 'hidden', remove: 'removed', restore: 'active', spam: 'flagged' };
    review.status = statusMap[action];
    if (action === 'spam') review.flagReason = 'Marked as spam by admin';
    await review.save();

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};
