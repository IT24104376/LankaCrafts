const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getReviews, updateReviewStatus } = require('../controllers/reviewController');

router.use(protect);

router.get('/', getReviews);
router.patch('/:id/status', updateReviewStatus);

module.exports = router;
