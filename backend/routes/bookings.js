import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getBookings, createBooking, cancelBooking } from '../services/bookingService.js';

const router = express.Router();

/**
 * GET /api/tourist/bookings
 * Returns all bookings for the authenticated tourist,
 * split into upcoming and past.
 */
router.get('/', verifyFirebaseToken, async (req, res) => {
  const { upcoming, past } = await getBookings(req.tourist._id);
  res.json({ upcoming, past });
});

/**
 * POST /api/tourist/bookings
 * Create a new booking for the authenticated tourist.
 * (Used when the BookWorkshop page is linked to a tourist account.)
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  const booking = await createBooking(req.tourist._id, req.body);
  res.status(201).json({ message: 'Booking created.', booking });
});

/**
 * PATCH /api/tourist/bookings/:id/cancel
 * Cancel a booking (only owns bookings can be cancelled).
 */
router.patch('/:id/cancel', verifyFirebaseToken, async (req, res) => {
  const booking = await cancelBooking(req.params.id, req.tourist._id);
  res.json({ message: 'Booking cancelled.', booking });
});

export default router;
