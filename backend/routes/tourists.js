const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getTourists, getTourist, toggleTouristStatus } = require('../controllers/touristController');

router.use(protect);

router.get('/', getTourists);
router.get('/:id', getTourist);
router.patch('/:id/status', toggleTouristStatus);

module.exports = router;
