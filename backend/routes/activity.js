const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getActivityFeed, getRecentActivity } = require('../controllers/activityController');

router.use(protect);

router.get('/', getActivityFeed);
router.get('/recent', getRecentActivity);

module.exports = router;
