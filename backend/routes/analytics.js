const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getOverview, getActivityChart, getTopArtisans, getTouristDemographics, getWorkshopPopularity } = require('../controllers/analyticsController');

router.use(protect);

router.get('/overview', getOverview);
router.get('/activity', getActivityChart);
router.get('/top-artisans', getTopArtisans);
router.get('/tourist-demographics', getTouristDemographics);
router.get('/workshop-popularity', getWorkshopPopularity);

module.exports = router;
