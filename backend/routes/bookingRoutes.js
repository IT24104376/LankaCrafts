import express from 'express';
const router = express.Router();

import * as bookingController from '../services/bookingController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { validateBookingBody } from '../middleware/validateBooking.js';
import { checkDoubleBooking } from '../middleware/checkDoubleBooking.js';

// --------------------
// BOOKING ROUTES
// --------------------

// 1️ Create booking - validation, then check double booking
router.post('/', validateBookingBody, checkDoubleBooking, bookingController.createBooking);

// 2️ Get all bookings
router.get('/', verifyFirebaseToken, bookingController.getAllBookings);

// 3️ Get bookings by email - protected by auth
router.get('/user/:email', verifyFirebaseToken, bookingController.getBookingsByEmail);

// 3.5️ Get booking by ID - protected by auth
router.get('/:id', verifyFirebaseToken, bookingController.getBookingById);

// 4️ Update booking - protected by auth
router.put('/:id', verifyFirebaseToken, validateBookingBody, checkDoubleBooking, bookingController.updateBooking);

// 5️ Delete booking - protected by auth
router.delete('/:id', verifyFirebaseToken, bookingController.deleteBooking);

export default router;