const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getWorkshops, getWorkshop, updateWorkshopStatus, getBookings } = require('../controllers/workshopController');

router.use(protect);

router.get('/', getWorkshops);
router.get('/bookings', getBookings);
router.get('/:id', getWorkshop);
router.patch('/:id/status', updateWorkshopStatus);

module.exports = router;
