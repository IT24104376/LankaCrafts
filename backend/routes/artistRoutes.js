import express from 'express';
import { verifyAnyFirebaseToken } from '../middleware/auth.js';
import {
  getArtistProfile,
  updateArtistProfile,
  getArtistBookings,
  getArtistSchedule,
  updateArtistSchedule
} from '../controllers/artistController.js';

const router = express.Router();

// Profile routes - protected (artist only)
router.get('/profile', verifyAnyFirebaseToken, getArtistProfile);
router.patch('/profile', verifyAnyFirebaseToken, updateArtistProfile);

// Bookings routes - protected (artist only)
router.get('/bookings', verifyAnyFirebaseToken, getArtistBookings);

// Schedule routes - protected (artist only)
router.get('/schedule', verifyAnyFirebaseToken, getArtistSchedule);
router.patch('/schedule', verifyAnyFirebaseToken, updateArtistSchedule);

export default router;