const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getArtisans,
  getArtisan,
  updateArtisanStatus,
} = require('../controllers/artisanController');

router.use(protect);

router.get('/', getArtisans);
router.get('/:id', getArtisan);
router.patch('/:id/status', updateArtisanStatus);

module.exports = router;
