import Booking from '../models/workshopBooking.js';

export const checkDoubleBooking = async (req, res, next) => {
  try {
    const { artisanId, date, time } = req.body;

    if (!artisanId || !date || !time) {
      return next(); // let validateBookingBody handle missing fields
    }

    // Check 1 — is the artisan already booked at this date/time by anyone?
    const artisanQuery = {
      artisanId,
      bookingDate: date,
      bookingTime: time,
      status: { $in: ['pending', 'confirmed'] }
    };

    // Exclude current booking if updating
    if (req.params.id) {
      artisanQuery._id = { $ne: req.params.id };
    }

    const artisanBooked = await Booking.findOne(artisanQuery);
    if (artisanBooked) {
      return res.status(409).json({
        success: false,
        error: 'This artisan is already booked for this date and time.'
      });
    }

    // Check 2 — does this tourist already have a booking at this date/time?
    const touristQuery = {
      firebaseUid: req.firebaseUid,
      bookingDate: date,
      bookingTime: time,
      status: { $in: ['pending', 'confirmed'] }
    };

    if (req.params.id) {
      touristQuery._id = { $ne: req.params.id };
    }

    const touristBooked = await Booking.findOne(touristQuery);
    if (touristBooked) {
      return res.status(409).json({
        success: false,
        error: 'You already have a booking at this date and time.'
      });
    }

    next();
  } catch (err) {
    console.error('Double Booking Check Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to verify booking availability.'
    });
  }
};