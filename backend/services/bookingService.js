import Booking from '../models/Booking.js';

/**
 * Return all bookings for a tourist, split into upcoming and past.
 */
export async function getBookings(touristId) {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    Booking.find({ tourist: touristId, date: { $gte: now } })
      .sort({ date: 1 })
      .lean(),
    Booking.find({ tourist: touristId, date: { $lt: now } })
      .sort({ date: -1 })
      .lean(),
  ]);

  return { upcoming, past };
}

/**
 * Create a new booking for a tourist.
 */
export async function createBooking(touristId, body) {
  const { workshopName, artisan, location, date, status, imageUrl, price } = body;

  if (!workshopName || !date) {
    const e = new Error('workshopName and date are required.');
    e.status = 400;
    throw e;
  }

  const booking = await Booking.create({
    tourist: touristId,
    workshopName,
    artisan: artisan || '',
    location: location || '',
    date: new Date(date),
    status: status || 'Pending',
    imageUrl: imageUrl || '',
    price: price || '',
  });

  return booking;
}

/**
 * Cancel a booking, enforcing ownership.
 * Throws 404 if not found, 403 if not the owner.
 */
export async function cancelBooking(bookingId, touristId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const e = new Error('Booking not found.');
    e.status = 404;
    throw e;
  }
  if (!booking.tourist.equals(touristId)) {
    const e = new Error('You can only cancel your own bookings.');
    e.status = 403;
    throw e;
  }

  booking.status = 'Cancelled';
  await booking.save();
  return booking;
}
