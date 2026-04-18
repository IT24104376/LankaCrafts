// import { find, findById, findByIdAndUpdate } from '../models/Workshop.js';
// import { find as _find } from '../models/Booking.js';
// import { create } from '../models/ActivityLog.js';

// export async function getWorkshops(req, res, next) {
//   try {
//     const { status, search } = req.query;
//     const filter = {};
//     if (status && status !== 'all') filter.status = status;
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { artisan: { $regex: search, $options: 'i' } },
//         { craft: { $regex: search, $options: 'i' } },
//       ];
//     }
//     const workshops = await find(filter).sort({ submittedDate: -1 });
//     res.json({ success: true, data: workshops, count: workshops.length });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function getWorkshop(req, res, next) {
//   try {
//     const workshop = await findById(req.params.id);
//     if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found.' });
//     res.json({ success: true, data: workshop });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function updateWorkshopStatus(req, res, next) {
//   try {
//     const { status } = req.body;
//     if (!['approved', 'rejected', 'pending'].includes(status)) {
//       return res.status(400).json({ success: false, message: 'Invalid status. Must be approved, rejected, or pending.' });
//     }
//     const workshop = await findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
//     if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found.' });

//     await create({
//       type: status === 'approved' ? 'verify' : 'reject',
//       user: workshop.artisan,
//       description: `Workshop ${status}: ${workshop.name}`,
//       page: '/admin/workshop-verification',
//     });

//     res.json({ success: true, data: workshop });
//   } catch (err) {
//     next(err);
//   }
// }

// export async function getBookings(req, res, next) {
//   try {
//     const { craft, search } = req.query;
//     const filter = {};
//     if (craft && craft !== 'all') filter.craft = craft;
//     if (search) {
//       filter.$or = [
//         { tourist: { $regex: search, $options: 'i' } },
//         { workshopName: { $regex: search, $options: 'i' } },
//         { artisan: { $regex: search, $options: 'i' } },
//       ];
//     }
//     const bookings = await _find(filter).sort({ date: -1 });
//     res.json({ success: true, data: bookings, count: bookings.length });
//   } catch (err) {
//     next(err);
//   }
// }
