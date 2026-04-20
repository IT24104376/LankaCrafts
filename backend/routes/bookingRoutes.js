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
router.post('/', verifyFirebaseToken, validateBookingBody, checkDoubleBooking, bookingController.createBooking);

// 2️ Get all bookings
router.get('/', verifyFirebaseToken, bookingController.getAllBookings);

// 3️ Get bookings by uid - protected by auth
router.get('/user/:uid', verifyFirebaseToken, bookingController.getBookingsByUid);

// 4️ Update booking - protected by auth
router.put('/:id', verifyFirebaseToken, validateBookingBody, checkDoubleBooking, bookingController.updateBooking);

// 5️ Delete booking - protected by auth
router.delete('/:id', verifyFirebaseToken, bookingController.deleteBooking);

export default router;